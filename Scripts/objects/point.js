/*
Source file name : https://github.com/em-graphics/SolarSystem.git
Live link : http://solarsystem-assignment2.azurewebsites.net
Author : Eunmi Han(300790610)
Date last Modified : Mar 26, 2016
Program Description : Solar System (Mercury, Venus, Earth and Mars with Moon)
Revision History :1.12

Last Modified by Eunmi Han

*/
/// <reference path="../../typings/tsd.d.ts"/>
var objects;
(function (objects) {
    // POINT CLASS ++++++++++++++++++++++++++++++++++++++++++
    var Point = (function () {
        // CONSTRUCTOR ++++++++++++++++++++++++++++++++++++++++
        function Point(x, y, z) {
            this.x = x;
            this.y = y;
            this.z = z;
        }
        return Point;
    })();
    objects.Point = Point;
})(objects || (objects = {}));
//# sourceMappingURL=point.js.map