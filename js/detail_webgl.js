var scene,camera,renderer,light,dae,skin,
	canvas_w = window.innerWidth/2,
	canvas_h = window.innerHeight,
	loader   = new THREE.ColladaLoader(),
	loaded   = false;

function initThreeJs()
{
	
	scene = new THREE.Scene();
	scene.fog = new THREE.Fog( 0x000000, 3500, 15000 );
	scene.fog.color.setHSL( 0.51, 0.4, 0.01 );
	camera = new THREE.PerspectiveCamera( 75, canvas_w/canvas_h, 0.1, 1000 );
	camera.position.z = 5;
	
	renderer = new THREE.WebGLRenderer({antialias:true,alpha:true});
	renderer.setSize(canvas_w, canvas_h);
	renderer.gammaInput = true;
	renderer.gammaOutput = true;
	document.getElementById('container').appendChild( renderer.domElement );
	var model = getPlanetFromUrl().asset;
	loadModel(model);
	setLight();
	window.addEventListener('resize', function() {
        var WIDTH = window.innerWidth/2,
            HEIGHT = window.innerHeight;
        renderer.setSize(WIDTH, HEIGHT);
        camera.aspect = WIDTH / HEIGHT;
        camera.updateProjectionMatrix();
	});
}

function loadModel(model)
{
	
	loader.options.convertUpAxis = true;
	loader.load( model, function ( collada ) {
		dae  = collada.scene;
		skin = collada.skins[ 0 ];

		dae.position.set(0,0,0);
		dae.rotation.set(0,0,180);
		dae.scale.set(0.2,0.2,0.2);

		scene.add(dae);
		loaded = true;
	});
}

function setLight()
{
	light = new THREE.PointLight(0xffffff, 300.8,100);
    light.position.set(100,100,0);
    scene.add(light);

    ambient = new THREE.AmbientLight( 0xffffff );
	ambient.color.setHSL( 0.56, 0.53, 0.15 );
	scene.add(ambient);

	hemiLight = new THREE.HemisphereLight( 0xffffff, 0xffffff, 0.6 );
	hemiLight.color.setHSL( 0.6, 1, 0.6 );
	hemiLight.groundColor.setHSL( 0.095, 1, 0.75 );
	hemiLight.position.set( 0, 100, 40 );
	scene.add( hemiLight );

	dirLight = new THREE.DirectionalLight(0xffffff, 0.125);
	dirLight.position.set( 0, -1, 0 ).normalize();
	dirLight.color.setHSL( 0.56, 0.53, 0.29 );

	scene.add( dirLight );

	dirLight = new THREE.DirectionalLight( 0xffffff, 1 );
	dirLight.color.setHSL( 0.1, 1, 0.95 );
	dirLight.position.set( -1, 1.75, 1 );
	dirLight.position.multiplyScalar( 50 );
	scene.add( dirLight );

	dirLight.castShadow = true;

	dirLight.shadowMapWidth = 2048;
	dirLight.shadowMapHeight = 2048;

	var d = 50;

	dirLight.shadowCameraLeft = -d;
	dirLight.shadowCameraRight = d;
	dirLight.shadowCameraTop = d;
	dirLight.shadowCameraBottom = -d;

	dirLight.shadowCameraFar = 3500;
	dirLight.shadowBias = -0.0001;
	dirLight.shadowDarkness = 0.35;
	dirLight.shadowCameraVisible = true;
}

function animate(){
	requestAnimationFrame(animate);
	render();
}

function render() {
	if(loaded)
		dae.rotation.y += 0.01;
	renderer.render(scene, camera);
};

initThreeJs();
animate();
