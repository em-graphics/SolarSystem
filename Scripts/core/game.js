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
var pointLight;
var mbMaterial;
var ob_mercury;
var ob_venus;
var ob_earth;
var ob_mars;
var pivot;
var test;
function init() {
    // Instantiate a new Scene object
    scene = new Scene();
    setupRenderer(); // setup the default renderer
    setupCamera(); // setup the camera
    // add an axis helper to the scene
    axes = new AxisHelper(10);
    scene.add(axes);
    console.log("Added Axis Helper to scene...");
    var pointLight = new THREE.PointLight(0xff2424, 1, 100);
    //Add Planets to the Scene
    sun = new gameObject(new SphereGeometry(5, 32, 32), new MeshBasicMaterial({ color: 0xff5e00 }), 0, 4, 0);
    scene.add(sun);
    // Add Point Light on sun
    sun.add(pointLight);
    console.log("Added Sun Primitive to scene...");
    ob_mercury = new Object3D();
    scene.add(ob_mercury);
    mercury = new gameObject(new SphereGeometry(0.7, 32, 32), new LambertMaterial({ color: 0xff0000 }), 8, 4, 0);
    ob_mercury.add(mercury);
    console.log("Added Mercury Primitive to sphere object...");
    ob_venus = new Object3D();
    scene.add(ob_venus);
    venus = new gameObject(new SphereGeometry(1, 32, 32), new LambertMaterial({ color: 0xff0000 }), 11, 4, 0);
    ob_venus.add(venus);
    console.log("Added Venus Primitive to sphere object...");
    ob_earth = new Object3D();
    scene.add(ob_earth);
    earth = new gameObject(new SphereGeometry(1, 32, 32), new LambertMaterial({ color: 0xff0000 }), 14, 4, 0);
    ob_earth.add(earth);
    console.log("Added Earth Primitive to sphere object...");
    pivot = new Object3D();
    pivot.position.x = 14;
    pivot.position.y = 4;
    pivot.rotateOnAxis;
    scene.add(pivot);
    moon = new gameObject(new SphereGeometry(5, 32, 32), new LambertMaterial({ color: 0xffe400 }), 1.7, 0, 0);
    pivot.add(moon);
    ob_mars = new Object3D();
    scene.add(ob_mars);
    mars = new gameObject(new SphereGeometry(0.5, 32, 32), new LambertMaterial({ color: 0xff0000 }), 17, 4, 0);
    ob_mars.add(mars);
    console.log("Added Mars Primitive to sphere object...");
    // Add an AmbientLight to the scene
    ambientLight = new AmbientLight(0x090909);
    scene.add(ambientLight);
    console.log("Added an Ambient Light to Scene");
    // Add a SpotLight to the scene
    spotLight = new SpotLight(0xffffff);
    spotLight.position.set(5.6, 23.1, 5.4);
    spotLight.rotation.set(-0.8, 42.7, 19.5);
    spotLight.castShadow = true;
    scene.add(spotLight);
    console.log("Added a SpotLight Light to Scene");
    // add controls
    gui = new GUI();
    control = new Control(0.05);
    addControl(control);
    // Add framerate stats
    addStatsObject();
    console.log("Added Stats to scene...");
    document.body.appendChild(renderer.domElement);
    gameLoop(); // render the scene	
    window.addEventListener('resize', onResize, false);
}
function onResize() {
    camera.aspect = CScreen.RATIO;
    //camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    //renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setSize(CScreen.WIDTH, CScreen.HEIGHT);
}
function addControl(controlObject) {
    gui.add(controlObject, 'rotationSpeed', -0.5, 0.5);
    gui.add({ zoom: 100 }, 'zoom', 5, 200).onChange(function (value) {
        camera.fov = value;
        camera.updateProjectionMatrix();
    });
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
    ob_mercury.rotation.y += control.rotationSpeed;
    ob_venus.rotation.y += -0.07;
    ob_earth.rotation.y += 0.020;
    ob_mars.rotation.y += 0.015;
    //  pivot.rotation.z += 0.002;
    pivot.rotation.y = 2 * Math.PI / 3;
    // render using requestAnimationFrame
    requestAnimationFrame(gameLoop);
    // render the scene
    renderer.render(scene, camera);
}
// Setup default renderer
function setupRenderer() {
    renderer = new Renderer();
    renderer.setClearColor(0x070707, 1.0);
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
    camera.position.y = 16;
    camera.position.z = -20.5;
    camera.lookAt(new Vector3(0, 0, 0));
    console.log("Finished setting up Camera...");
}
//# sourceMappingURL=game.js.map