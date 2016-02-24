/// <reference path="_reference.ts"/>

// MAIN GAME FILE

// THREEJS Aliases
import Scene = THREE.Scene;
import Renderer = THREE.WebGLRenderer;
import PerspectiveCamera = THREE.PerspectiveCamera;
import BoxGeometry = THREE.BoxGeometry;
import CubeGeometry = THREE.CubeGeometry;
import PlaneGeometry = THREE.PlaneGeometry;
import SphereGeometry = THREE.SphereGeometry;
import Geometry = THREE.Geometry;
import AxisHelper = THREE.AxisHelper;
import LambertMaterial = THREE.MeshLambertMaterial;
import MeshBasicMaterial = THREE.MeshBasicMaterial;
import Material = THREE.Material;
import MeshPhongMaterial = THREE.MeshPhongMaterial;
import Mesh = THREE.Mesh;
import Object3D = THREE.Object3D;
import SpotLight = THREE.SpotLight;
import PointLight = THREE.PointLight;
import AmbientLight = THREE.AmbientLight;
import Control = objects.Control;
import GUI = dat.GUI;
import Color = THREE.Color;
import Vector3 = THREE.Vector3;
import Face3 = THREE.Face3;
import Point = objects.Point;
import CScreen = config.Screen;
import TextureLoader = THREE.TextureLoader;
import ImageUtils = THREE.ImageUtils;
import CircleGeometry = THREE.CircleGeometry;
import Line = THREE.Line;
import LineBasicMaterial = THREE.LineBasicMaterial;

//Custom Game Objects
import gameObject = objects.gameObject;

var scene: Scene;
var renderer: Renderer;
var camera: PerspectiveCamera;
var axes: AxisHelper;
var cube: Mesh;
var plane: Mesh;
var sun: Mesh;
var ambientLight: AmbientLight;
var spotLight: SpotLight;
var control: Control;
var gui: GUI;
var stats: Stats;
var step: number = 0;
var cubeGeometry: CubeGeometry;
var cubeMaterial: LambertMaterial;
var earth: Mesh;
var mercury: Mesh;
var venus: Mesh;
var mars: Mesh;
var moon: Mesh;
var pointLight:PointLight;
var mbMaterial :MeshBasicMaterial;
var t: number;
var sunTextureLoader:TextureLoader;
var mercuryTextureLoader:TextureLoader;
var marsTextureLoader:TextureLoader;
var earthTextureLoader:TextureLoader;
var moonTextureLoader:TextureLoader;
var venusTextureLoader:TextureLoader;
var g_sun:MeshPhongMaterial;
var g_mercury:MeshPhongMaterial;
var g_venus:MeshPhongMaterial;
var g_earth:MeshPhongMaterial;
var g_moon:MeshPhongMaterial;
var g_mars:MeshPhongMaterial;
var pivot : Object3D;
var orbitMercury: Mesh;
var o_mercury:Geometry;
var o_venus:Geometry;
var o_earth:Geometry;
var o_mars:Geometry;


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
    pointLight = new PointLight( 0xffffff, 1, 100 );
    pointLight.position.set(0,4,0);
    pointLight.intensity = 5;
    pointLight.distance = 100;
    pointLight.castShadow = true;
    pointLight.shadowMapWidth = 2048;
    pointLight.shadowMapHeight = 2048;
    
    scene.add(pointLight);
    
    //Add Planets to the Scene
    
    sunTextureLoader = new TextureLoader();
    sunTextureLoader.load('./images/sunmap.png', function(texture){
        var g = new SphereGeometry(5, 20,20);
        texture.anisotropy = 8;
        var m = new MeshBasicMaterial({map:texture, overdraw:0.5});
        sun = new Mesh(g, m);
        sun.position.y = 4;
        scene.add(sun);
               
    });
    
    
    console.log("Added Sun Primitive to scene...");
    
      
    var t_mercury = ImageUtils.loadTexture('./images/mercurymap.jpg');
    t_mercury.anisotropy = 8;
    g_mercury = new MeshPhongMaterial({map : t_mercury});
    mercury = new gameObject(new SphereGeometry(0.7, 32, 32),
        g_mercury,
        8, 4, 0);
    
    mercury.castShadow = true;
    scene.add(mercury);
    
    console.log("Added Mercury Primitive to sphere object...");
    
   
    
    var t_venus = ImageUtils.loadTexture('./images/venusmap.jpg');
    t_venus.anisotropy = 8;
    g_venus = new MeshPhongMaterial({map : t_venus});
    venus = new gameObject(new SphereGeometry(1, 32, 32),
        g_venus,
        11, 4, 0);
    venus.castShadow = true;
    scene.add(venus);
    
    console.log("Added Venus Primitive to sphere object...");
    
    
    var t_earth = ImageUtils.loadTexture('./images/earthmap.jpg');
    t_earth.anisotropy = 8;
    g_earth = new MeshPhongMaterial({map : t_earth});
    earth = new gameObject(new SphereGeometry(1, 32, 32),
        g_earth,
        14, 4, 0);
    earth.castShadow = true;
    scene.add(earth);
    
    console.log("Added Earth Primitive to sphere object...");
    
    pivot = new Object3D();
    
    scene.add(pivot);
    
    var t_moon = ImageUtils.loadTexture('./images/moonmap.jpg');
    t_moon.anisotropy = 8;
    g_moon = new MeshPhongMaterial({map : t_moon});
    moon = new gameObject(new SphereGeometry(0.3, 32, 32),
        g_moon,
        -1.7, 0, 0);
    pivot.castShadow = true;
    earth.add(moon);
    
    console.log("Added Moon Primitive to sphere object...");
    
    var t_mars = ImageUtils.loadTexture('./images/marsmap.jpg');
    t_mars.anisotropy = 8;
    g_mars = new MeshPhongMaterial({map : t_mars});
    mars = new gameObject(new SphereGeometry(0.5, 32, 32),
        g_mars,
        17, 4, 0);
    mars.castShadow = true;
    scene.add(mars);
    
    console.log("Added Mars Primitive to sphere object...");
    
    //Add Planet's Orbit
    o_mercury = new Geometry();
    
    for (var i = 0; i <= 35; i++) {
    var theta = (i / 35) * Math.PI * 2;
    o_mercury.vertices.push(
        new THREE.Vector3(
            Math.cos(theta) * 17,
            4,
            Math.sin(theta) * 17));            
    }
    
    scene.add(new Line(o_mercury, new LineBasicMaterial({ color: 0xFFFFFF })));
    
    o_venus = new Geometry();
    
    for (var i = 0; i <= 35; i++) {
    var theta = (i / 35) * Math.PI * 2;
    o_venus.vertices.push(
        new THREE.Vector3(
            Math.cos(theta) * 22,
            4,
            Math.sin(theta) * 22));            
    }
    
    scene.add(new Line(o_venus, new LineBasicMaterial({ color: 0xFFFFFF })));
    
    o_earth = new Geometry();
    
    for (var i = 0; i <= 35; i++) {
    var theta = (i / 35) * Math.PI * 2;
    o_earth.vertices.push(
        new THREE.Vector3(
            Math.cos(theta) * 30,
            4,
            Math.sin(theta) * 30));            
    }
    
    scene.add(new Line(o_earth, new LineBasicMaterial({ color: 0xFFFFFF })));
    
    o_mars = new Geometry();
    
    for (var i = 0; i <= 35; i++) {
    var theta = (i / 35) * Math.PI * 2;
    o_mars.vertices.push(
        new THREE.Vector3(
            Math.cos(theta) * 39,
            4,
            Math.sin(theta) * 39));            
    }
    
    scene.add(new Line(o_mars, new LineBasicMaterial({ color: 0xFFFFFF })));
  
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



function addControl(controlObject: Control): void {
    gui.add(controlObject, 'rotationSpeed', -0.5, 0.5);
    gui.add({zoom: 100}, 'zoom', 5, 200).onChange(function(value){
        camera.fov=value;
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
function gameLoop(): void {
    stats.update();


    mercury.position.x = Math.cos(t*0.15)*17;
    mercury.position.z = Math.sin(t*0.15)*17;
    
    venus.position.x = Math.sin(t*0.3)*22;
    venus.position.z = Math.cos(t*0.3)*22;
    
    earth.position.x = Math.sin(t*0.2)*30;
    earth.position.z = Math.cos(t*0.2)*30;
    
    pivot.position.x = Math.sin(t*0.2)*30;
    pivot.position.z = Math.cos(t*0.2)*30;
    
    mars.position.x = Math.sin(t*0.07)*39;
    mars.position.z = Math.cos(t*0.07)*39;

    
    mercury.rotation.y += 0.02;
    venus.rotation.y -= 0.003;
    earth.rotation.y += 0.05;
    pivot.rotation.z -= 0.01;
    mars.rotation.y += 0.01;
  
    t+= Math.PI/180*2;
    
    // render using requestAnimationFrame
    requestAnimationFrame(gameLoop);
	
    // render the scene
    renderer.render(scene, camera);
}

// Setup default renderer
function setupRenderer(): void {
    renderer = new Renderer();
    renderer.setClearColor(0x212121, 1.0);
    renderer.setSize(CScreen.WIDTH, CScreen.HEIGHT);
    //renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    console.log("Finished setting up Renderer...");
}

// Setup main camera for the scene
function setupCamera(): void {
    camera = new PerspectiveCamera(100, config.Screen.RATIO, 0.1, 1000);
    //camera = new PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.x = 0.6;
    camera.position.y = 50;
    camera.position.z = -20.5;
    camera.lookAt(new Vector3(0, 0, 0));
    console.log("Finished setting up Camera...");
}
