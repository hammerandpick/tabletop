export class NetCode {
    
    #myID=null;
    #remoteIDs=[];
    #debug=false;

    config = {
        iceServers: [{ urls: "stun:stun.l.google.com:19302" }]
    };

    

    $ = (id) => document.getElementById(id);
    logEl = this.$("log");
    peers = new Map(); // peerId -> peerState

    constructor({ debug = false } = {}) {
        this.#debug = debug;
    }

    setMyID(id) {
        this.#myID = id;
        // $("myId").value = id;
        // log(`✅ Meine ID gesetzt: ${id}`);
    }

    log(line) { 
        if (this.#debug) {
            console.log(line);
            if (this.logEl) {
                this.logEl.textContent += line + "\n";
                this.logEl.scrollTop = this.logEl.scrollHeight; // Scroll to bottom
            }
        }
    }

    getMyId() { return this.#myID; }
    
    setDebug(enabled) { this.#debug = enabled; }

    getremoteId() { return this.$("remoteId").value.trim(); }

    ensurePeerOption(peerId) {
        const sel = this.$("peerSelect");
        if ([...sel.options].some(o => o.value === peerId)) return;
        const opt = document.createElement("option");
        opt.value = peerId;
        opt.textContent = peerId;
        sel.appendChild(opt);
        if (!sel.value) sel.value = peerId;
    }

    wireDataChannel(peerId, dc) {
        dc.onopen = () => {
            this.log(`✅ [${peerId}] DataChannel offen`);
            this.ensurePeerOption(peerId);
        };
        dc.onclose = () => this.log(`⛔ [${peerId}] DataChannel geschlossen`);
        dc.onerror = (e) => this.log(`⚠️ [${peerId}] DataChannel Fehler: ${e?.message || e}`);
        dc.onmessage = (e) => this.log(`📩 [${peerId}] ${e.data}`);
    }

    createPeer(peerId, initiator) {
        const pc = new RTCPeerConnection(this.config);
        const state = {
            pc,
            dc: null,
            localCandidates: [],
            iceDone: null,
            _iceDoneResolve: null,
            initiator
        };

        // Promise, die "ICE complete" signalisiert (für Non-Trickle-JSON Paket)
        state.iceDone = new Promise(res => state._iceDoneResolve = res);

        pc.onicecandidate = (ev) => {
            if (ev.candidate) state.localCandidates.push(ev.candidate);
            // Wenn candidate == null, ist Gathering fertig (Non-trickle Paket).
            if (!ev.candidate) state._iceDoneResolve();
        };

        pc.oniceconnectionstatechange = () =>
            this.log(`ℹ️ [${peerId}] iceConnectionState=${pc.iceConnectionState}`);

        pc.onconnectionstatechange = () =>
            this.log(`ℹ️ [${peerId}] connectionState=${pc.connectionState}`);

        pc.ondatachannel = (ev) => {
            state.dc = ev.channel;
            this.wireDataChannel(peerId, state.dc);
        };

        if (initiator) {
            // Initiator erstellt den DataChannel; Gegenstelle bekommt ihn per ondatachannel. [4](https://webrtc.org/getting-started/data-channels)
            state.dc = pc.createDataChannel("chat");
            this.wireDataChannel(peerId, state.dc);
        }

        this.peers.set(peerId, state);
        this.ensurePeerOption(peerId);
        return state;
    }

    async buildSignalEnvelope(toPeerId, type, pcState) {
        // Warten bis ICE Gathering fertig, dann SDP + alle Kandidaten in ein JSON.
        await pcState.iceDone;
        return {
            from: this.getMyId(),
            to: toPeerId,
            type, // "offer" | "answer"
            sdp: pcState.pc.localDescription,
            candidates: pcState.localCandidates
        };
    }

    setOutbox(obj) {
        this.$("outbox").value = JSON.stringify(obj, null, 2);
    }
    
    async makeOffer(toPeerId) {
        if (!toPeerId) return this.log("⚠️ Remote ID fehlt");
        if (this.peers.has(toPeerId)) this.log(`ℹ️ [${toPeerId}] existiert bereits, erstelle neue Offer dennoch (Renegotiation).`);

        const st = this.peers.get(toPeerId) || this.createPeer(toPeerId, true);

        const offer = await st.pc.createOffer();
        await st.pc.setLocalDescription(offer);

        this.log(`📤 [${toPeerId}] Offer erstellt – warte auf ICE…`);
        const env = await this.buildSignalEnvelope(toPeerId, "offer", st);
        this.setOutbox(env);
        this.log(`✅ [${toPeerId}] Offer+ICE in Outbox (kopieren)`);
    }

    async applyIncoming() {
        let msg;
        try {
            msg = JSON.parse(this.$("inbox").value);
        } catch {
            return this.log("⚠️ Eingehendes JSON ist ungültig.");
        }

        if (msg.to && msg.to !== this.getMyId()) {
            return this.log(`⚠️ Nachricht ist an "${msg.to}" adressiert, ich bin "${this.getMyId()}". Ignoriere.`);
        }
        if (!msg.from || !["offer", "answer"].includes(msg.type) || !msg.sdp) {
            return this.log("⚠️ Nachricht fehlt from/type/sdp oder enthält einen ungültigen Typ.");
        }

        const fromPeerId = msg.from;
        let st = this.peers.get(fromPeerId);

        // Wenn ich ein Offer empfange, bin ich NICHT Initiator für diesen Peer.
        if (!st) st = this.createPeer(fromPeerId, false);

        // Remote Description setzen (Offer/Answer)
        await st.pc.setRemoteDescription(msg.sdp);

        // ICE Candidates hinzufügen (Batch aus Envelope)
        if (Array.isArray(msg.candidates)) {
            for (const c of msg.candidates) {
            try { await st.pc.addIceCandidate(c); }
            catch (e) { this.log(`⚠️ [${fromPeerId}] addIceCandidate Fehler: ${e?.message || e}`); }
            }
        }

        this.log(`✅ [${fromPeerId}] Remote SDP + ICE angewendet (type=${msg.type})`);

        // Wenn wir ein Offer erhalten haben, müssen wir antworten:
        if (msg.type === "offer") {
            const answer = await st.pc.createAnswer();
            await st.pc.setLocalDescription(answer);

            this.log(`📤 [${fromPeerId}] Answer erstellt – warte auf ICE…`);
            const env = await this.buildSignalEnvelope(fromPeerId, "answer", st);
            this.setOutbox(env);
            this.log(`✅ [${fromPeerId}] Answer+ICE in Outbox (zurückkopieren)`);
        }
    }

    sendMessage() {
        const text = this.$("msg").value;
        if (!text) return;

        const isBroadcast = this.$("broadcast").checked;
        if (isBroadcast) {
            let sent = 0;
            for (const [peerId, st] of this.peers.entries()) {
            if (st.dc && st.dc.readyState === "open") {
                st.dc.send(text);
                sent++;
            }
            }
            this.log(`📤 Broadcast gesendet an ${sent} Peer(s): ${text}`);
            return;
        }

        const target = this.$("peerSelect").value;
        const st = this.peers.get(target);
        if (!st?.dc || st.dc.readyState !== "open") {
            return this.log(`⚠️ [${target}] Kanal nicht offen.`);
        }
        st.dc.send(text);
        this.log(`📤 [${target}] Gesendet: ${text}`);
    }
}