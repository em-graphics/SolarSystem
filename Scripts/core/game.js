/*
Source file name : https://github.com/em-graphics/SolarSystem.git
Live link : http://solarsystem-assignment2.azurewebsites.net
Author : Eunmi Han(300790610)
Date last Modified : Mar 26, 2016
Program Description : Solar System (Mercury, Venus, Earth and Mars with Moon)
Revision History :1.12

Last Modified by Eunmi Han

*/
/// <reference path="_reference.ts"/>
// MAIN GAME FILE
// THREEJS Aliases
var Scene = THREE.Scene;
var Renderer = THREE.WebGLRenderer;
var PerspectiveCamera = THREE.PerspectiveCamera;
var BoxGeometry = THREE.BoxGeometry;
var CubeGeometry = THREE.CubeGeometry;
var PlaneGeometry = THREE.PlaneGeometry;
var SphereGeometry = THREE.SphereGeometry;
var Geometry = THREE.Geometry;
var AxisHelper = THREE.AxisHelper;
var LambertMaterial = THREE.MeshLambertMaterial;
var MeshBasicMaterial = THREE.MeshBasicMaterial;
var Material = THREE.Material;
var MeshPhongMaterial = THREE.MeshPhongMaterial;
var Mesh = THREE.Mesh;
var Object3D = THREE.Object3D;
var SpotLight = THREE.SpotLight;
var PointLight = THREE.PointLight;
var AmbientLight = THREE.AmbientLight;
var Control = objects.Control;
var GUI = dat.GUI;
var Color = THREE.Color;
var Vector3 = THREE.Vector3;
var Face3 = THREE.Face3;
var Point = objects.Point;
var CScreen = config.Screen;
var ImageUtils = THREE.ImageUtils;
var CircleGeometry = THREE.CircleGeometry;
var Line = THREE.Line;
var LineBasicMaterial = THREE.LineBasicMaterial;
var Sprite = THREE.Sprite;
var SpriteMaterial = THREE.SpriteMaterial;
//Custom Game Objects
var gameObject = objects.gameObject;
var scene;
var renderer;
var camera;
var axes;
var cube;
var plane;
var sun;
var ambientLight;
var spotLight;
var control;
var gui;
var stats;
var step = 0;
var cubeGeometry;
var cubeMaterial;
var earth;
var mercury;
var venus;
var mars;
var moon;
var jupiter;
var pointLight;
var t;
var g_sun;
var g_mercury;
var g_venus;
var g_earth;
var g_moon;
var g_mars;
var g_jupiter;
var pivot;
var o_mercury;
var o_venus;
var o_earth;
var o_mars;
var o_jupiter;
var checkCamera;
function init() {
    // Instantiate a new Scene object
    scene = new Scene();
    setupRenderer(); // setup the default renderer
    setupCamera(); // setup the camera
    // add an axis helper to the scene
    axes = new AxisHelper(20);
    scene.add(axes);
    console.log("Added Axis Helper to scene...");
    t = 0;
    // Add point light on sun
    pointLight = new PointLight(0xffffff, 1, 100);
    pointLight.position.set(0, 4, 0);
    pointLight.intensity = 5;
    pointLight.distance = 100;
    pointLight.castShadow = true;
    pointLight.shadowMapWidth = 2048;
    pointLight.shadowMapHeight = 2048;
    scene.add(pointLight);
    // Add stars 
    for (var i = 0; i < 2000; i++) {
        var particle = new Sprite(new SpriteMaterial({ color: Math.random() * 0x808080 + 0x808080 }));
        particle.position.x = Math.random() * 1000 - 500;
        particle.position.y = Math.random() * 1000 - 500;
        particle.position.z = Math.random() * 1000 - 500;
        particle.scale.x = particle.scale.y = 0.5;
        scene.add(particle);
    }
    //Add Planets and Texture to the Scene 
    var t_sun = ImageUtils.loadTexture('./images/sunmap.png');
    t_sun.anisotropy = 8;
    g_sun = new MeshBasicMaterial({ map: t_sun, overdraw: 0.5 });
    sun = new Mesh(new SphereGeometry(5, 32, 32), g_sun);
    sun.position.set(0, 4, 0);
    scene.add(sun);
    console.log("Added Sun Primitive to scene...");
    var t_mercury = ImageUtils.loadTexture('./images/mercurymap.jpg');
    t_mercury.anisotropy = 8;
    g_mercury = new MeshPhongMaterial({ map: t_mercury });
    mercury = new gameObject(new SphereGeometry(0.7, 32, 32), g_mercury, 8, 4, 0);
    mercury.castShadow = true;
    scene.add(mercury);
    console.log("Added Mercury Primitive to sphere object...");
    var t_venus = ImageUtils.loadTexture('./images/venusmap.jpg');
    t_venus.anisotropy = 8;
    g_venus = new MeshPhongMaterial({ map: t_venus });
    venus = new gameObject(new SphereGeometry(1, 32, 32), g_venus, 11, 4, 0);
    venus.castShadow = true;
    scene.add(venus);
    console.log("Added Venus Primitive to sphere object...");
    var t_earth = ImageUtils.loadTexture('./images/earthmap.jpg');
    t_earth.anisotropy = 8;
    g_earth = new MeshPhongMaterial({ map: t_earth });
    earth = new gameObject(new SphereGeometry(1, 32, 32), g_earth, 14, 4, 0);
    earth.castShadow = true;
    scene.add(earth);
    console.log("Added Earth Primitive to sphere object...");
    pivot = new Object3D();
    scene.add(pivot);
    var t_moon = ImageUtils.loadTexture('./images/moonmap.jpg');
    t_moon.anisotropy = 8;
    g_moon = new MeshPhongMaterial({ map: t_moon });
    moon = new gameObject(new SphereGeometry(0.3, 32, 32), g_moon, -1.7, 0, 0);
    pivot.castShadow = true;
    earth.add(moon);
    console.log("Added Moon Primitive to sphere object...");
    var t_mars = ImageUtils.loadTexture('./images/marsmap.jpg');
    t_mars.anisotropy = 8;
    g_mars = new MeshPhongMaterial({ map: t_mars });
    mars = new gameObject(new SphereGeometry(0.5, 32, 32), g_mars, 17, 4, 0);
    mars.castShadow = true;
    scene.add(mars);
    console.log("Added Mars Primitive to sphere object...");
    var t_jupiter = ImageUtils.loadTexture('./images/jupitermap.jpg');
    t_jupiter.anisotropy = 8;
    g_jupiter = new MeshPhongMaterial({ map: t_jupiter });
    jupiter = new gameObject(new SphereGeometry(0.9, 32, 32), g_jupiter, 20, 4, 0);
    jupiter.castShadow = true;
    scene.add(jupiter);
    console.log("Added jupiter Primitive to sphere object...");
    //Add Planet's Orbit
    o_mercury = new Geometry();
    for (var i = 0; i <= 35; i++) {
        var theta = (i / 35) * Math.PI * 2;
        o_mercury.vertices.push(new THREE.Vector3(Math.cos(theta) * 17, 4, Math.sin(theta) * 17));
    }
    scene.add(new Line(o_mercury, new LineBasicMaterial({ color: 0xFFFFFF })));
    o_venus = new Geometry();
    for (var i = 0; i <= 35; i++) {
        var theta = (i / 35) * Math.PI * 2;
        o_venus.vertices.push(new THREE.Vector3(Math.cos(theta) * 22, 4, Math.sin(theta) * 22));
    }
    scene.add(new Line(o_venus, new LineBasicMaterial({ color: 0xFFFFFF })));
    o_earth = new Geometry();
    for (var i = 0; i <= 35; i++) {
        var theta = (i / 35) * Math.PI * 2;
        o_earth.vertices.push(new THREE.Vector3(Math.cos(theta) * 30, 4, Math.sin(theta) * 30));
    }
    scene.add(new Line(o_earth, new LineBasicMaterial({ color: 0xFFFFFF })));
    o_mars = new Geometry();
    for (var i = 0; i <= 35; i++) {
        var theta = (i / 35) * Math.PI * 2;
        o_mars.vertices.push(new THREE.Vector3(Math.cos(theta) * 39, 4, Math.sin(theta) * 39));
    }
    scene.add(new Line(o_mars, new LineBasicMaterial({ color: 0xFFFFFF })));
    o_jupiter = new Geometry();
    for (var i = 0; i <= 35; i++) {
        var theta = (i / 35) * Math.PI * 2;
        o_jupiter.vertices.push(new THREE.Vector3(Math.cos(theta) * 43, 4, Math.sin(theta) * 43));
    }
    scene.add(new Line(o_jupiter, new LineBasicMaterial({ color: 0xFFFFFF })));
    // Add an AmbientLight to the scene
    ambientLight = new AmbientLight(0x090909);
    scene.add(ambientLight);
    console.log("Added an Ambient Light to Scene");
    // Add a SpotLight to the scene
    spotLight = new SpotLight(0xffffff);
    spotLight.position.set(20, 23.1, 5.4);
    spotLight.rotation.set(-0.8, 42.7, 19.5);
    spotLight.castShadow = true;
    scene.add(spotLight);
    console.log("Added a SpotLight Light to Scene");
    // add dat.gui controls
    gui = new GUI();
    gui.add({ zoom: 100 }, 'zoom', 5, 200).onChange(function (value) {
        camera.lookAt(sun.position);
        camera.fov = value;
        camera.updateProjectionMatrix();
        checkCamera = 1;
    });
    gui.add({ zoomToEarth: 90 }, 'zoomToEarth', 5, 200).onChange(function (value) {
        camera.lookAt(earth.position);
        camera.fov = value;
        camera.updateProjectionMatrix();
        checkCamera = 2;
    });
    // Add framerate stats
    addStatsObject();
    console.log("Added Stats to scene...");
    document.body.appendChild(renderer.domElement);
    gameLoop(); // render the scene      
}
function addStatsObject() {
    stats = new Stats();
    stats.setMode(0);
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.left = '0px';
    stats.domElement.style.top = '0px';
    document.body.appendChild(stats.domElement);
}
// Setup main game loop
function gameLoop() {
    stats.update();
    //Set a orbit for Planets
    mercury.position.x = Math.cos(t * 0.15) * 17;
    mercury.position.z = Math.sin(t * 0.15) * 17;
    venus.position.x = Math.sin(t * 0.3) * 22;
    venus.position.z = Math.cos(t * 0.3) * 22;
    earth.position.x = Math.sin(t * 0.2) * 30;
    earth.position.z = Math.cos(t * 0.2) * 30;
    pivot.position.x = Math.sin(t * 0.2) * 30;
    pivot.position.z = Math.cos(t * 0.2) * 30;
    mars.position.x = Math.sin(t * 0.07) * 39;
    mars.position.z = Math.cos(t * 0.07) * 39;
    jupiter.position.x = Math.cos(t * 0.07) * 43;
    jupiter.position.z = Math.sin(t * 0.07) * 43;
    // Set a rotation for planets
    sun.rotation.y -= 0.025;
    mercury.rotation.y += 0.02;
    venus.rotation.y -= 0.003;
    earth.rotation.y += 0.05;
    pivot.rotation.y += 0.01;
    mars.rotation.y += 0.01;
    jupiter.rotation.y += 0.013;
    t += Math.PI / 180 * 2;
    if (checkCamera == 1) {
        camera.lookAt(sun.position);
        camera.updateProjectionMatrix();
    }
    if (checkCamera == 2) {
        camera.lookAt(earth.position);
        camera.updateProjectionMatrix();
    }
    // render using requestAnimationFrame
    requestAnimationFrame(gameLoop);
    // render the scene
    renderer.render(scene, camera);
}
// Setup default renderer
function setupRenderer() {
    renderer = new Renderer();
    renderer.setClearColor(0x161616, 1.0);
    renderer.setSize(CScreen.WIDTH, CScreen.HEIGHT);
    //renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    console.log("Finished setting up Renderer...");
}
// Setup main camera for the scene
function setupCamera() {
    camera = new PerspectiveCamera(100, config.Screen.RATIO, 0.1, 1000);
    //camera = new PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.x = 0.6;
    camera.position.y = 50;
    camera.position.z = -20.5;
    camera.lookAt(new Vector3(0, 0, 0));
    console.log("Finished setting up Camera...");
}
//# sourceMappingURL=game.js.map