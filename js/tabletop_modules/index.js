// Module entry for TableTop classes
import { TableTop } from '../tabletop_classes/TableTop.js';
import { ttGame } from '../tabletop_classes/ttGame.js';
import { ttPlayer } from '../tabletop_classes/ttPlayer.js';
import { TableTop_ViewPort } from '../tabletop_classes/TableTop_ViewPort.js';
import { TableTop_Die } from '../tabletop_classes/TableTop_Die.js';
import { TableTop_Window } from '../tabletop_classes/TableTop_Window.js';
import { TableTop_WindowManager } from '../tabletop_classes/TableTop_WindowManager.js';
import { TableTop_Menu } from '../tabletop_classes/TableTop_Menu.js';

function attachGlobals() {
  window.TableTop = TableTop;
  window.ttGame = ttGame;
  window.ttPlayer = ttPlayer;
  window.TableTop_ViewPort = TableTop_ViewPort;
  window.TableTop_Die = TableTop_Die;
  window.TableTop_Window = TableTop_Window;
  window.TableTop_WindowManager = TableTop_WindowManager;
  window.TableTop_Menu = TableTop_Menu;
}

export {
  TableTop,
  ttGame,
  ttPlayer,
  TableTop_ViewPort,
  TableTop_Die,
  TableTop_Window,
  TableTop_WindowManager,
  TableTop_Menu,
  attachGlobals
};
