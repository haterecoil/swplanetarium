var scene, camera, renderer,bouton,index,center,
	textureFlare0,textureFlare1,textureFlare3, material,
	particles, geometry, materials = [], parameters,i,h,color,
	planetes  = [],
	mouse     = new THREE.Vector2(),
	statutRot = true,
	WIDTH  	  = window.innerWidth,
	HEIGHT    = window.innerHeight,
	container = document.getElementById('container');
var clock = new THREE.Clock();
var loader = new THREE.ColladaLoader();
var mount = 20000;
var loaded = false;
var plan;
var canvas;
var indexZoom;

var Planete = function(planeteJSON,index)
{
    this.x = 0;
    this.name = planeteJSON.name;
    this.y = planeteJSON.posY;
    this.z = 0;
    this.size = planeteJSON.size;
    this.sens = planeteJSON.sens;
    this.amp = planeteJSON.amp;
    this.speed = planeteJSON.speed;
    this.index = index;
    this.asset_1 = planeteJSON.assetSimple;
};

Planete.prototype.load = function()
{ 
	var self = this;

    loader.load( self.asset_1, function ( collada ) {
        var dae = collada.scene;
        var skin = collada.skins[0];

        dae.position.set(self.x,self.y,self.z);
        dae.scale.set(self.size,self.size,self.size);
        scene.add(dae);

        self.mesh = dae;
        self.mesh.instance = self;
        
    	loaded = true;
    });
}

function createSystem()
{
    for (var i = 0; i < planetesArray.length; i++){
		var planet = new Planete(planetesArray[i],i);
        planetes.push(planet);
        planet.load();
    }
}

function createSun(){

	canvas  = document.createElement('canvas'),
    context = canvas.getContext('2d');

    canvas.width  = 600;
    canvas.height = 600;

    var grd = context.createRadialGradient(canvas.width / 2, canvas.width / 2, 0, canvas.width / 2, canvas.width / 2, canvas.width / 2);
    grd.addColorStop(0.4,'rgba(255,255,255,1)');
    grd.addColorStop(0.6,'rgba(255,174,0,1)');
    grd.addColorStop(0.7,'rgba(255,0,0,0.4)');
    grd.addColorStop(0.8,'rgba(255,0,0,0.0)');
    context.fillStyle = grd;
    context.fillRect(0,0,canvas.width,canvas.width);

    var texture = new THREE.Texture(canvas);
    texture.needsUpdate = true;
        

	geometry = new THREE.PlaneGeometry( 232, 232, 232 )
	material = new THREE.MeshBasicMaterial({map:texture,transparent:true,color:0xffff00});
	console.log(material);
	material.blending = THREE.AdditiveBlending;
	plan = new THREE.Mesh( geometry, material );
	scene.add(plan);

}


function init()
{
	scene = new THREE.Scene();
	scene.fog = new THREE.Fog( 0x000000, 3500, 15000 );
	scene.fog.color.setHSL( 0.51, 0.4, 0.01 );
	
	renderer = new THREE.WebGLRenderer(
		{	
			alpha:true,
			antialias:true
		});
    renderer.setSize(WIDTH, HEIGHT);
    renderer.setClearColor( scene.fog.color, 1 );
    
    container.appendChild(renderer.domElement);

    camera = new THREE.PerspectiveCamera(45, WIDTH / HEIGHT, 1, 10000);
    camera.position.y = 50;
    camera.position.z = 4000;
    scene.add(camera);

	defineLight();

  	loader.options.convertUpAxis = true;
  	createSun();	
  	createSystem();
  	
    center = scene.position;
    //initialisation des controles
    // controls = new THREE.FlyControls( camera, renderer.domElement );
    controls = new THREE.OrbitControls( camera, renderer.domElement );
    // parametres de controle via la souris
	controls.movementSpeed = 500;
	controls.domElement = container;
	controls.rollSpeed = 0.09;
	controls.autoForward = false;
	controls.dragToLook = true;
	controls.maxDistance = 5000;
    controls.minDistance = 100;

	
	renderer.gammaInput = true;
	renderer.gammaOutput = true;

	window.addEventListener('resize', function() {
        renderer.setSize(WIDTH, HEIGHT);
        camera.aspect = WIDTH / HEIGHT;
        camera.updateProjectionMatrix();
    });

    renderer.domElement.addEventListener( 'mousemove', onDocumentMouseMove, false );
	renderer.domElement.addEventListener( 'mousedown', onDocumentMouseDown, false );

	geometry = new THREE.Geometry();

	//on assigne a toute les particules une position via une boucle.
	for(i=0;i<mount; i++){
		var vertex = new THREE.Vector3();
		vertex.x = Math.random()* 4000 - 3000;
		vertex.y = Math.random()*4000 - 3000;
		vertex.z = Math.random()*4000 - 3000;
		geometry.vertices.push(vertex);
	}
	//Tableau contenant differnet code couleur, et la taille des particules;
	parameters = [
		[[1,1,0.5],5],
		[[0.95,1,0.5],4],
		[[0.90,0.3,0.5],3],
		[[0.85,0.3,0.5],2],
		[[0.80,0.3,0.5],1]
	];	
	sprite = THREE.ImageUtils.loadTexture("./href/textures/ball.png");
	
	//on assigne la taille a chaque particule via une boucle.
	for(i=0;i<parameters.length;i++){
		size = parameters[i][1];

		materials[i] = new THREE.PointCloudMaterial({
			size : size,
			map : sprite,
			fog : true,
			transparent : true
		});
		
		particules = new THREE.PointCloud(geometry,materials[i]);
		particules.rotation.x = Math.random()*6;
		particules.rotation.y = Math.random()*6;
		particules.rotation.z = Math.random()*6;

		//puis on ajoute le tout a la scene
		scene.add(particules);
	}
}

function animate()
{
    requestAnimationFrame(animate);
    TWEEN.update();
    controls.update();
    render();
}

function render()
{
	if(loaded)
	{
		if(statutRot)
		{
			var timer = Date.now();
			for (var i = 0; i < planetes.length; i++)
			{
				planetes[i].mesh.position.x = Math.cos(timer * planetes[i].speed * planetes[i].sens) * planetes[i].amp  ;
				planetes[i].mesh.position.z = Math.sin(timer * planetes[i].speed * planetes[i].sens) * planetes[i].amp  ;
				planetes[i].mesh.rotation.y;
			}
		}
		for (var i = 0; i < planetes.length; i++)
		{
			planetes[i].mesh.rotation.y += 0.01;
		}
	}
	plan.lookAt(camera.position);
	camera.lookAt(center);
	renderer.render(scene, camera);
}

function replaceCamera(x,y,z)
{
	new TWEEN.Tween(camera.position)
		.to({x:x,y:y,z:z},Math.random()*1000+1000)
		.easing(TWEEN.Easing.Exponential.InOut)
		.start();

	new TWEEN.Tween(camera.rotation)
		.to({x:0,y:0,z:0},Math.random()*1000+1000)
		.easing(TWEEN.Easing.Exponential.InOut)
		.start();

	new TWEEN.Tween(this)
		.to({},1000*2)
		.onUpdate(render)
		.start();
}

$('.entrerbouton').click(function(){

	$('#loader').fadeOut(700);
	$('#content').fadeIn(700);
});

$('.test').on('click', function()
{
	indexZoom 	= $(this).data('index');
	center = planetes[indexZoom].mesh.position;
	
	showInfo(indexZoom);
 	 
	zoomOnPlanet(indexZoom, 130); 
	$('.circle-container').fadeOut(400);
	$('#container').removeClass('blur');
});

$('.face').on('click', function()
{
	replaceCamera(0,50,500);
});

$('.reset').on('click',function()
{
	$('#close').css('display','none');
	$('.face').css('display','block');
	$('#info').fadeOut(300);
	$('#photo').fadeOut(300);
	$('.item').fadeOut(300);
	
	center = scene.position;
	controls.enabled = true;
	statutRot = true;
	$("#info").fadeOut();
	replaceCamera(0,50,4000);
});

$('.takeoff').on('click', function(){
	var url = './detail.html?&'+planetsMetadata[indexZoom].name;
	window.location.href = url;
})

$(document).keypress(function(e){
	if(e.keyCode==109 && $('.circle-container').css('display') == "none"){
		$('.circle-container').fadeIn(400);
		$('#container').addClass("blur");
	}

	else if(e.keyCode==109 && $('.circle-container').css('display') == "block"){
		$('.circle-container').fadeOut(400);
		$('#container').removeClass("blur");
	}

});

function showInfo(index){
	setTimeout(function() {
     	$("#info").fadeIn(400, 'swing', function(){
     		$('.name').html(planetsMetadata[index].name);
			$('.content > p').html(planetsMetadata[index].abstract);

		});
		$("#photo").fadeIn(500, 'swing', function(){
      		$('.img_desc').attr("src", planetsMetadata[index].image );
		});
	}, 2000);
}

function zoomOnPlanet(i,decalZoom)
{
	center = planetes[i].mesh.position;
 	pas = planetes[i].size + decalZoom;
 	x=planetes[i].mesh.position.x + pas;
 	y=planetes[i].mesh.position.y + pas;
 	z=planetes[i].mesh.position.z + pas;

 	$('#close').css('display','block');
 	$('.face').css('display','none');
 	replaceCamera(x,y,z);
 	statutRot = false;
 	controls.enabled = false;
}

function onDocumentMouseMove( event )
{
	event.preventDefault();

	mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

}

function onDocumentMouseDown( event )
{
	event.preventDefault();

	var vector = new THREE.Vector3( mouse.x, mouse.y, 0.5 );
	vector.unproject(camera);
	var raycaster = new THREE.Raycaster( camera.position, vector.sub( camera.position ).normalize() );

	var temp_planets = [];
	for(var i = 0; i < planetes.length; i++)
		temp_planets.push(planetes[i].mesh);

	var intersects = raycaster.intersectObjects(temp_planets,true);

	if ( intersects.length > 0 )
	{
		indexZoom = intersects[0].object.parent.parent.instance.index;
		zoomOnPlanet(indexZoom,130);
		showInfo(indexZoom);
	}
}
$.fn.materialripple = function(options) {
	var defaults = {
		rippleClass: 'ripple-wrapper'
	}
	$.extend(defaults, options);

	$(this).append('<span class="'+defaults.rippleClass+'"></span>');
	$(this).addClass('has-ripple').css({'position': 'relative', 'overflow': 'hidden'});

	$(this).bind('click', function(e){
		$(this).find('.'+defaults.rippleClass).removeClass('animated');
		var mouseX = e.clientX;
		var mouseY = e.clientY;

		elementWidth = $(this).outerWidth();
		elementHeight = $(this).outerHeight();
		d = Math.max(elementWidth, elementHeight);
		$(this).find('.'+defaults.rippleClass).css({'width': d, 'height': d});

		var rippleX = e.clientX - $(this).offset().left - d/2;
		var rippleY = e.clientY - $(this).offset().top - d/2;

		$(this).find('.'+defaults.rippleClass).css('top', rippleY+'px').css('left', rippleX+'px').addClass('animated');
	});
}

$(function(){
	$('.ripple').materialripple();
});

init();
animate();




