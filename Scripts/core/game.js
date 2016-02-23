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
var TextureLoader = THREE.TextureLoader;
var ImageUtils = THREE.ImageUtils;
var RepeatWrapping = THREE.RepeatWrapping;
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
var t;
var sunTextureLoader;
var mercuryTextureLoader;
var marsTextureLoader;
var earthTextureLoader;
var moonTextureLoader;
var venusTextureLoader;
var g_mercury;
var g_venus;
var g_earth;
var g_moon;
var g_mars;
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
    pointLight = new PointLight(0xff2424, 1, 100);
    pointLight.position.set(0, 4, 0);
    pointLight.castShadow = true;
    pointLight.shadowMapWidth = 2048;
    pointLight.shadowMapHeight = 2048;
    scene.add(pointLight);
    //Add Planets to the Scene
    /* sun = new gameObject(
          new SphereGeometry(5, 32, 32),
          new MeshBasicMaterial({ map: TextureLoader.lo }),
          0, 4, 0);
      
      scene.add(sun);
      
      mercury = new gameObject(
          new SphereGeometry(0.7, 32  , 32),
          new LambertMaterial({ color: 0xff0000 }),
          8, 4, 0);
      mercury.castShadow = true;
      scene.add(mercury);
      
      venus = new gameObject(
          new SphereGeometry(1, 32  , 32),
          new LambertMaterial({ color: 0xff0000 }),
          11, 4, 0);
      venus.castShadow = true;
      scene.add(venus);
      
      earth = new gameObject(
          new SphereGeometry(1, 32  , 32),
          new LambertMaterial({ color: 0xff0000 }),
          14, 4, 0);
      earth.castShadow = true;
      scene.add(earth);
      
      moon = new gameObject(
          new SphereGeometry(0.5, 32  , 32),
          new LambertMaterial({ color: 0xffe400 }),
          1.7, 0, 0);
      moon.castShadow = true;
      earth.add(moon);
      
      mars = new gameObject(
          new SphereGeometry(0.5, 32  , 32),
          new LambertMaterial({ color: 0xff0000 }),
          17, 4, 0);
      mars.castShadow = true;
      scene.add(mars);
      */
    sunTextureLoader = new TextureLoader();
    sunTextureLoader.load('./images/sunmap.png', function (texture) {
        var g = new SphereGeometry(5, 20, 20);
        texture.anisotropy = 8;
        var m = new MeshBasicMaterial({ map: texture, overdraw: 0.5 });
        sun = new Mesh(g, m);
        sun.position.y = 4;
        scene.add(sun);
    });
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
    var t_moon = ImageUtils.loadTexture('./images/moonmap.jpg');
    t_moon.anisotropy = 8;
    g_moon = new MeshPhongMaterial({ map: t_moon });
    moon = new gameObject(new SphereGeometry(0.3, 32, 32), g_moon, -1.7, 0, 0);
    moon.castShadow = true;
    earth.add(moon);
    console.log("Added Moon Primitive to sphere object...");
    var t_mars = ImageUtils.loadTexture('./images/marsmap.jpg');
    t_mars.anisotropy = 8;
    g_mars = new MeshPhongMaterial({ map: t_mars });
    mars = new gameObject(new SphereGeometry(0.5, 32, 32), g_mars, 17, 4, 0);
    mars.castShadow = true;
    scene.add(mars);
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
    mercury.position.x = Math.sin(t * 0.1) * 8;
    mercury.position.z = Math.cos(t * 0.1) * 8;
    venus.position.x = Math.sin(t * 0.3) * 11;
    venus.position.z = Math.cos(t * 0.3) * 11;
    earth.position.x = Math.sin(t * 0.5) * 14;
    earth.position.z = Math.cos(t * 0.5) * 14;
    mars.position.x = Math.sin(t * 0.7) * 17;
    mars.position.z = Math.cos(t * 0.7) * 17;
    mercury.rotation.y += 0.02;
    venus.rotation.y -= 0.003;
    earth.rotation.y += 0.05;
    mars.rotation.y += 0.01;
    t += Math.PI / 180 * 2;
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