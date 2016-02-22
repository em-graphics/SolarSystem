var config;
(function (config) {
    var Screen = (function () {
        function Screen() {
        }
        Screen.WIDTH = 1000;
        Screen.HEIGHT = 800;
        Screen.RATIO = 1.333333;
        return Screen;
    })();
    config.Screen = Screen;
})(config || (config = {}));
//# sourceMappingURL=screen.js.map