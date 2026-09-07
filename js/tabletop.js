/* TableTop loader: includes class files (one per file) synchronously so the global API remains unchanged */
(function(){
    var base = 'js/tabletop_classes/';
    var files = [
        'TableTop_ViewPort.js',
        'TableTop_Die.js',
        'TableTop_Window.js',
        'TableTop_WindowManager.js',
        'TableTop_Menu.js',
        'ttPlayer.js',
        'ttGame.js',
        'TableTop.js'
    ];
    files.forEach(function(f){
        // Use document.write to ensure scripts are loaded and executed synchronously
        document.write('<scr' + 'ipt type="text/javascript" src="' + base + f + '"></scr' + 'ipt>');
    });
})();

