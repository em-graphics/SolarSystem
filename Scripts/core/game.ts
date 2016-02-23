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
var ob_mercury : Object3D;
var ob_venus : Object3D;
var ob_earth : Object3D;
var ob_mars : Object3D;
var pivot : Object3D;
var test : Object3D;

function init() {
    // Instantiate a new Scene object
    scene = new Scene();

    setupRenderer(); // setup the default renderer
	
    setupCamera(); // setup the camera
	
    // add an axis helper to the scene
    axes = new AxisHelper(20);
    scene.add(axes);
    console.log("Added Axis Helper to scene...");
        
    var pointLight = new THREE.PointLight( 0xff2424, 1, 100 );
  
    //Add Planets to the Scene
   sun = new gameObject(
        new SphereGeometry(5, 32, 32),
        new MeshBasicMaterial({ color: 0xff5e00 }),
        0, 4, 0);
    
    scene.add(sun);
    // Add Point Light on sun
    sun.add(pointLight);
    
    console.log("Added Sun Primitive to scene...");
    
    ob_mercury = new Object3D();
    scene.add(ob_mercury);
    
    mercury = new gameObject(
        new SphereGeometry(0.7, 32  , 32),
        new LambertMaterial({ color: 0xff0000 }),
        8, 4, 0);

    ob_mercury.add(mercury);
    console.log("Added Mercury Primitive to sphere object...");
    
    
    ob_venus = new Object3D();
    scene.add(ob_venus);
    
    venus = new gameObject(
        new SphereGeometry(1, 32  , 32),
        new LambertMaterial({ color: 0xff0000 }),
        11, 4, 0);

    ob_venus.add(venus)
    console.log("Added Venus Primitive to sphere object...");
    
    
    ob_earth = new Object3D();
    scene.add(ob_earth);
    
    earth = new gameObject(
        new SphereGeometry(1, 32  , 32),
        new LambertMaterial({ color: 0xff0000 }),
        14, 4, 0);

    ob_earth.add(earth)
    console.log("Added Earth Primitive to sphere object...");
        
    pivot = new Object3D();
    pivot.position.x = 14;
    pivot.position.y = 4;
    pivot.rotateOnAxis;
    scene.add(pivot);
   
    
    moon = new gameObject(
        new SphereGeometry(5, 32  , 32),
        new LambertMaterial({ color: 0xffe400 }),
        1.7, 0, 0);
    
    pivot.add(moon);
    
    ob_mars = new Object3D();
    scene.add(ob_mars);
    mars = new gameObject(
        new SphereGeometry(0.5, 32  , 32),
        new LambertMaterial({ color: 0xff0000 }),
        17, 4, 0);

    ob_mars.add(mars)
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
function setupRenderer(): void {
    renderer = new Renderer();
    renderer.setClearColor(0x070707, 1.0);
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
    camera.position.y = 16;
    camera.position.z = -20.5;
    camera.lookAt(new Vector3(0, 0, 0));
    console.log("Finished setting up Camera...");
}
