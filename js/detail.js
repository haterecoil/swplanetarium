/*

			DETAIL.JS
Content :

	1 : Slideshow constructor (homemade vanilla JS slideshow)
	2 : Material design like button animation
	3 : Template Engine ( thanks http://krasimirtsonev.com/blog/article/Javascript-template-engine-in-just-20-line)
	4 : Templates
	5 : Init functions

*/

/*
	Slideshow class
*/
var MatSlide = function(){
};

/*
	init()
		attach navigation events to arrows

*/
MatSlide.prototype.init = function(){

	//next slide event 
	var nextArrows = document.querySelectorAll('.slideshow-control-next');
	for(var i=0;i<nextArrows.length;i++){
		nextArrows[i].addEventListener('click',this.nextSlide,false);
	}

	//prev slide event
	var prevArrows = document.querySelectorAll('.slideshow-control-prev');
	for(var i=0;i<prevArrows.length;i++){
		prevArrows[i].addEventListener('click',this.prevSlide,false);
	}

}
/*
	nextSlide event 
		get nextSibling of clicked element
		swap classes
*/
MatSlide.prototype.nextSlide = function(){

	//"this" context refers to clicked element's DOM !!!
	var slideshow = this.parentElement.parentElement;
	var slideNodes = slideshow.childNodes;
	var currSlide = null;
	var nextSlide = null;

	//escape possible "\n" node
	for ( var i = 0; i < slideNodes.length; i++){
		if ( slideNodes[i].nodeName == "DIV"){
			if ( hasClass(slideNodes[i], "current")){
				currSlide = slideNodes[i];
			}
		}
	}
	if ( currSlide.nextSibling){
		nextSlide = currSlide.nextSibling;
		currSlide.className = "slide";
		nextSlide.className += " current shadow";	
		nextSlide.style.left = 0;
		setTimeout(function(){
			nextSlide.classname = "slide current";
		}, 1200);
		if ( !nextSlide.nextSibling){
			this.style.color = "#eee"
		}	
	}

	this.previousSibling.style.color = "inherit";
}

/*
	prevSlide event 
		get prevSibling of clicked element
		swap classes
*/
MatSlide.prototype.prevSlide = function(){

	//"this" context refers to clicked element's DOM !!!

	var slideshow = this.parentElement.parentElement;
	var slideNodes = slideshow.childNodes;
	var currSlide = null;
	var prevSlide = null;

	//escape possible "\n" node
	for ( var i = 0; i < slideNodes.length; i++){
		if ( slideNodes[i].nodeName == "DIV"){
			if ( hasClass(slideNodes[i], "current")){
				currSlide = slideNodes[i];
			}
		}
	}
	if ( currSlide.previousSibling.previousSibling){
		prevSlide = currSlide.previousSibling;
		currSlide.className = "slide shadow";
		currSlide.style.left = "200%"
		setTimeout(function(){
			currSlide.className = "slide";
		}, 1200);
		if ( prevSlide.previousSibling.previousSibling == undefined){
			this.style.color = "#eee";
		}
		prevSlide.className += " current";	
	}

	this.nextSibling.style.color = "inherit"
}

/*
	MATERIAL DESIGN STYLE BUTTON ANIMATION
*/

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
		$(this).parent().addClass('animated');
	});
}

/*
	TEMPLATE ENGINE
*/
function hasClass(element, cls) {
    return (' ' + element.className + ' ').indexOf(' ' + cls + ' ') > -1;
}

var TemplateEngine = function(html, options) {
    var re = /<%([^%>]+)?%>/g, reExp = /(^( )?(if|for|else|switch|case|break|{|}))(.*)?/g, code = 'var r=[];\n', cursor = 0;
    var add = function(line, js) {
        js? (code += line.match(reExp) ? line + '\n' : 'r.push(' + line + ');\n') :
            (code += line != '' ? 'r.push("' + line.replace(/"/g, '\\"') + '");\n' : '');
        return add;
    }
    while(match = re.exec(html)) {
        add(html.slice(cursor, match.index))(match[1], true);
        cursor = match.index + match[0].length;
    }
    add(html.substr(cursor, html.length - cursor));
    code += 'return r.join("");';
    return new Function(code.replace(/[\r\t\n]/g, '')).apply(options);
}
/*
======================
						TEMPLATES
				1 : Society
				2 : Insights / Physics 
				3 : Movies

	Each template is organized like this :

	class Template
		this.metadata = data for a specific Planet
		this.template = DOM template to be interpreted by TemplateEngine

		prototype.init = 
			load template in DOM;
			start animations;
			attach event listeners;
			draw charts
======================
*/


/* =======================
	
	SOCIETY TEMPLATE

=======================  */ 

var Society = function(metadata){
	this.metadata = metadata;
	this.template = 
		'<div class="infopanel-third-hz">'+
			'<div class="header">'+
				'<div class="name">'+
					'<div class="galaxy-button">'+
						'<img src="./href/img/galaxy.png" alt="retour home page" title="galaxie">'+
					'</div>'+
					'<div class="exit-button">&#9587;</div>'+
					'<p>societe</p>'+
					'</br>'+
				'</div>'+
			'</div>'+
			'<div class="infopanel-third-hz-society">'+
				'<div class="infopanel-half-tt"> '+
					'<div class="text-society">'+
						'<%this.abstract%>'+
						'</br>'+
						'<h3><span>La capitale est </span><%this.capital%></h3>'+
					'</div>'+
				'</div>'+
			'</div>'+
		'</div>'+
		'<div class="infopanel-third-hz place">'+
			'<div class="infopanel-half-vt societe">'+
				'<div class="infopanel-twothird-hz" id="info-">'+
					'<h1>Nombres de langages parlés</h1>' +
					'<canvas id="radar-languages"></canvas>'+
				'</div>'+
				'<div class="infopanel-third-hz">'+
					'<ul>'+
						'<%for(var index in this.places) {%>'+ 
				    		'<li><%this.places[index]%></li>'+
				    	'<%}%>'+
			   		'</ul>'+
				'</div>'+
			'</div>'+
			'<div class="infopanel-half-vt societe">'+
				'<h1>Population</h1>' +
				'<canvas id="pie-species"></canvas>'+
			'</div>'+
		'</div>'+
		'<div class="infopanel-third-hz-society">'+
			'<div class="infopanel-half-tt"> '+
				'<h1>Nombre d\'habitants</h1>' +
				'<canvas id="bar-inhabitants"></canvas>'+
			'</div>'+			
		'</div>';
}

Society.prototype.init = function(){
	var self = this;
	document.querySelector(".infopanel").innerHTML = TemplateEngine(self.template, self.metadata);
	document.querySelector(".exit-button").addEventListener('click', function(){
		$('.infopanel > div').fadeOut("normal");
		setTimeout(function(){init()}, 600);	
	});

	//eventListener for homepage link
	document.querySelector(".galaxy-button").addEventListener('click', function(){
		$('.infopanel > div').fadeOut("normal");
		setTimeout(function(){window.location.href="./index.html"}, 600);
	});

	//make elements appear
	$(".infopanel > div").fadeIn("fast", function(){});

	var ctx,
		newChart;
	//#radar-language radar chart for number of languauges
	ctx = document.getElementById("radar-languages").getContext("2d");
	chart = new Chart(ctx).Radar(radarLanguages());
	//#pie-species pie chart for number of inhabiting species
	ctx = document.getElementById("pie-species").getContext("2d");
	chart = new Chart(ctx).Pie(pieSpecies(self.metadata.name));	
	// //#bar-inhabitants radar chart for number of inhabitants
	ctx = document.getElementById("bar-inhabitants").getContext("2d");
	chart = new Chart(ctx).Bar(barInhabitants);
}


/* =======================
	
	PHYSICS TEMPLATE

=======================  */ 

var Insights = function(metadata){
	this.metadata = metadata;
	this.template = 
		'<div class="infopanel-third-hz">'+
			'<div class="header">'+
				'<div class="name">'+
					'<div class="galaxy-button">'+
						'<img src="./href/img/galaxy.png" alt="retour home page" title="galaxie">'+
					'</div>'+
					'<div class="exit-button">&#9587;</div>'+
					'<p>La planète</p>'+
					'</br>'+
				'</div>'+
			'</div>'+
			'<div class="infopanel-third-hz-society">'+
				'<div class="infopanel-half-tt"> '+
					'<div class="text-society">'+
						'<%this.abstract%>'+
						'</br>'+
					'</div>'+
				'</div>'+
			'</div>'+
		'</div>'+
		'<div class="infopanel-twothird-hz">'+
			'<div class="infopanel-half-vt">'+
				'<div class="infopanel-half-hz" id="info-">'+
					'<canvas id="radar-satellites"></canvas>'+
				'</div>'+
				'<div class="infopanel-half-hz">'+
					'<canvas id="bars-surface"></canvas>'+
				'</div>'+
			'</div>'+
			'<div class="infopanel-half-vt">'+
				'<div class="infopanel-half-hz">'+
					'<canvas id="polar-distance"></canvas>'+
				'</div>'+
				'<div class="infopanel-half-hz">'+
					'<canvas id="polar-diameter"></canvas>'+
				'</div>'+			
			'</div>'+
		'</div>';
}

Insights.prototype.init = function(){
	var self = this;
	document.querySelector(".infopanel").innerHTML = TemplateEngine(self.template, self.metadata);
	document.querySelector(".exit-button").addEventListener('click', function(){
		$('.infopanel > div').fadeOut("normal");
		setTimeout(function(){init()}, 600);
	})

	//eventListener for homepage link
	document.querySelector(".galaxy-button").addEventListener('click', function(){
		$('.infopanel > div').fadeOut("normal");
		setTimeout(function(){window.location.href="./index.html"}, 600);
	})

	var ctx,
		newChart;

	// radar chart for numebr of sattelites
	ctx = document.getElementById("radar-satellites").getContext("2d");
	chart = new Chart(ctx).Radar(radarSatellites);
	// bar chart for immerged surface
	ctx = document.getElementById("bars-surface").getContext("2d");
	chart = new Chart(ctx).Bar(barsSurface);
	// Polar chart for distance from core
	ctx = document.getElementById("polar-distance").getContext("2d");
	chart = new Chart(ctx).PolarArea(polarDistance(self.metadata.name));
	// polar chart for diameter
	ctx = document.getElementById("polar-diameter").getContext("2d");
	chart = new Chart(ctx).PolarArea(polarDiameter(self.metadata.name));
}

/* =======================
	
	MOVIE TEMPLATE

=======================  */ 

var Movies = function(metadata){
	this.metadata = metadata;
	this.template = 
		'<div class="infopanel-third-hz">'+
			'<div class="header">'+
				'<div class="name">'+
					'<div class="galaxy-button">'+
						'<img src="./href/img/galaxy.png" alt="retour home page" title="galaxie">'+
					'</div>'+
					'<div class="exit-button">&#9587;</div>'+
					'<p>Behind The Scenes</p>'+
					'</br>'+
				'</div>'+
			'</div>'+
			'<div class="infopanel-third-hz-society">'+
				'<div class="infopanel-half-tt"> '+
					'<div class="text-society">'+
						'<%this.behind%>'+
						'</br>'+
						'<h3></h3>'+
					'</div>'+
				'</div>'+
			'</div>'+
		'</div>'+
		'<div class="infopanel-third-hz">'+
			'<div class="infopanel-half-vt societe">'+
				'<div class="infopanel-twothird-hz" id="info-">'+
					'<h1>Nombres de langages parlés</h1>' +
					'<canvas id="radar-languages"></canvas>'+
				'</div>'+
				'<div class="infopanel-third-hz">'+
				'</div>'+
			'</div>'+
			'<div class="infopanel-half-vt">'+
				'<h1>Épisodes</h1>' +
					'<ul class="list-episodes">'+
						'<li>1</li>'+
						'<li>2</li>'+
						'<li>3</li>'+
						'<li>4</li>'+
						'<li>5</li>'+
						'<li>6</li>'+
						'<li>7</li>'+
					'</ul>'+
			'</div>'+
		'</div>'+
		'<div class="infopanel-third-hz-society">'+
			'<div class="infopanel-half-tt"> '+
				'<h1>Nombre d\'habitants</h1>' +
				'<canvas id="bar-inhabitants"></canvas>'+
			'</div>'+			
		'</div>';
}

Movies.prototype.init = function(){
	var self = this;
	document.querySelector(".infopanel").innerHTML = TemplateEngine(self.template, self.metadata);
	document.querySelector(".exit-button").addEventListener('click', function(){
		$('.infopanel > div').fadeOut("normal");
		setTimeout(function(){init()}, 600);
	})

	//eventListener for homepage link
	document.querySelector(".galaxy-button").addEventListener('click', function(){
		$('.infopanel > div').fadeOut("normal");
		setTimeout(function(){window.location.href="./index.html"}, 600);
	})

	//color episodes
	var episodes = getDataFromPlanet(self.metadata.name, "Films");
	var ul = document.querySelector(".list-episodes");
	for ( var i = 0; i < ul.length; i++){
		for ( var j = 0; j < episodes.length; j++){
			if ( parseInt(ul.childNodes[i].innerHTML()) == episodes[j] ){
				ul.childNodes[i].setAttr("class", "episode-appearance")
			}
		}
	}
	debugger;
}


/* =======================
	
	HOME PAGE TEMPLATE

=======================  */ 

var Home = function(metadata){
	this.metadata = metadata;
	this.template = 
		'<div class="name">'+
			'<div class="galaxy-button">'+
				'<img src="./href/img/galaxy.png" alt="retour home page" title="galaxie">'+
			'</div>'+
			'<p><%this.name%></p>'+
		'</div>'+
		'<div class="infopanel-half-hz">'+
			'<div class="infopanel-half-vt">'+
				'<div class="floating-wrapper-plus" id="button-society">'+
					'<div class="floating-wrapper">'+
						'<a href="javascript:void(0)" class="button floating danger ripple" id="button-society">+</a>' +
					'</div>' +
				'</div>' +
	
				'<div class="slideshow">'+
					'<div class="slideshow-controls">'+
						'<div class="slideshow-control-prev">&#10094;</div>'+
						'<div class="slideshow-control-next">&#10095;</div>'+
					'</div>'+
					'<div class="slide current">'+
						'<h1>Société</h1>'+
							'<div class="slide-inner">'+
								'<canvas id="pie-species"></canvas>'+
							'</div>'+
					'</div>'+
					'<div class="slide">'+
							'<h1>Société</h1>'+
							'<div class="slide-inner">'+
								'<canvas id="bar-inhabitants"></canvas>'+
							'</div>'+
					'</div>'+
				'</div>'+
			'</div>'+
			'<div class="infopanel-half-vt">'+
				'<div class="floating-wrapper-plus" id="button-physics">'+
					'<div class="floating-wrapper">'+
						'<a href="javascript:void(0)" class="button floating danger ripple" id="button-insights">+</a>' +
					'</div>' +
				'</div>' +
				'<div class="slideshow">'+
					'<div class="slideshow-controls">'+
						'<div class="slideshow-control-prev">&#10094;</div>'+
						'<div class="slideshow-control-next">&#10095;</div>'+
					'</div>'+
					'<div class="slide current">'+
						'<h1>Physique</h1>'+
						'<div class="slide-inner">'+
							'<canvas id="polar-distance"></canvas>'+
						'</div>'+
					'</div>'+
					'<div class="slide">'+
							'<h1>Physique</h1>'+
							'<div class="slide-inner">'+
								'<canvas id="polar-diameter"></canvas>'+
							'</div>'+
					'</div>'+
				'</div>'+
			'</div>'+
		'</div>'+
		'<div class="infopanel-half-hz">'+
			'<div class="infopanel-half-tt"> '+
				'<div class="floating-wrapper-plus" id="button-movies">'+
					'<div class="floating-wrapper">'+
						'<a href="javascript:void(0)" class="button floating danger ripple" id="button-movies">+</a>' +
					'</div>' +
				'</div>' +
				'<h1>Histoire</h1>'+
				'<p><%this.history%></p>'+
			'</div>'+
		'</div>';
}

Home.prototype.init = function(){
	var self = this;

	// insert template in DOM
	document.querySelector(".infopanel").innerHTML = TemplateEngine(self.template, self.metadata);
	var ctx,
		newChart,
		data;

	//eventListener for homepage link
	document.querySelector(".galaxy-button").addEventListener('click', function(){
		$('.infopanel > div').fadeOut("normal");
		setTimeout(function(){window.location.href="./index.html"}, 600);
	});

	//attach ripple animation
	$('.ripple').materialripple();
	//set up event listeners for buttons
	document.getElementById("button-society").addEventListener('click', function(){
		setTimeout(function(){
			var society = new Society(self.metadata);
			society.init();
		}, 700);
	});
	document.getElementById("button-insights").addEventListener('click', function(){
		setTimeout(function(){
			var insights = new Insights(self.metadata);
			insights.init();
		}, 700);
	});	
	document.getElementById("button-movies").addEventListener('click', function(){
		setTimeout(function(){
			var movies = new Movies(self.metadata);
			movies.init();
		}, 700);
	});

	//draw charts
	ctx = document.getElementById("pie-species").getContext("2d");
	chart = new Chart(ctx).Pie(pieSpecies(self.metadata.name));	

	ctx = document.getElementById("bar-inhabitants").getContext("2d");
	chart = new Chart(ctx).Bar(barInhabitants);

	ctx = document.getElementById("polar-distance").getContext("2d");
	chart = new Chart(ctx).PolarArea(polarDistance(self.metadata.name));

	ctx = document.getElementById("polar-diameter").getContext("2d");
	chart = new Chart(ctx).PolarArea(polarDiameter(self.metadata.name));	

	// ctx = document.getElementById("polar-diameter").getContext("2d");
	// chart = new Chart(ctx).Radial(polarDiameter(self.metadata.name));

	//setup slideshows
	var mSlide = new MatSlide;
	mSlide.init();
}

function getPlanetFromUrl(){
	var url = document.URL;
	//if no params : reload page with a Param (and I love Naboo)
	if (url.indexOf('&') < 0){
		window.location.href = "./detail.html?&Naboo";
	}

	var planete = url.slice(url.indexOf("&")+1, url.length),
		metadata;

	for (var i = 0; i < planetsMetadata.length; i++){
		if ( planetsMetadata[i].name == planete) { metadata = planetsMetadata[i] }
	}
	return metadata
}

//initialize 
//load parameter "planet" from URL, and get linked data
function init(){
	var metadata = getPlanetFromUrl();
	var home = new Home(metadata);
	home.init();
}

init();
