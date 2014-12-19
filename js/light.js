var dirLight, pointLight,ambient,light ;

function defineLight()
{
	ambient = new THREE.AmbientLight( 0xffffff );
	ambient.color.setHSL( 0.56, 0.53, 0.19 );
	scene.add(ambient);

    textureFlare0 = THREE.ImageUtils.loadTexture( "../href/textures/lensflare0_alpha.png" );
 	textureFlare2 = THREE.ImageUtils.loadTexture( "../href/textures/lensflare2.png" );
 	textureFlare3 = THREE.ImageUtils.loadTexture( "../href/textures/lensflare3.png" );

	addLight( 0.08, 0.8, 0.5, 0, 0, 0 );

	pointLight = new THREE.PointLight(0xffffff,1,200);
	pointLight.position.set(6,6,6);

	scene.add(pointLight);

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

function addLight( h, s, l, x, y, z )
{
	light = new THREE.PointLight( 0xffffff, 1.5, 4500 );
	light.color.setHSL( h, s, l );
	light.position.set( x, y, z );
	scene.add( light );

	var flareColor = new THREE.Color( 0xffffff );
	flareColor.setHSL( h, s, l + 0.5 );

	var lensFlare = new THREE.LensFlare( textureFlare0, 400, 0.0, THREE.AdditiveBlending, flareColor );

	lensFlare.add( textureFlare2, 512, 0.0, THREE.AdditiveBlending );

	lensFlare.position.copy( light.position );

	scene.add( lensFlare );
}
