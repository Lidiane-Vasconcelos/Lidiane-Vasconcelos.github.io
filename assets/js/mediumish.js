jQuery(document).ready(function($){var offset=1250;var duration=800;jQuery(window).scroll(function(){if(jQuery(this).scrollTop()>offset){jQuery('.back-to-top').fadeIn(duration)}else{jQuery('.back-to-top').fadeOut(duration)}});jQuery('.back-to-top').click(function(event){event.preventDefault();jQuery('html, body').animate({scrollTop:0},duration);return!1})
$(document).scroll(function(){var y=$(this).scrollTop();if(y>280){$('.alertbar').fadeIn()}else{$('.alertbar').fadeOut()}});$('a.smoothscroll[href*="#"]').not('[href="#"]').not('[href="#0"]').click(function(event){if(location.pathname.replace(/^\//,'')==this.pathname.replace(/^\//,'')&&location.hostname==this.hostname){var target=$(this.hash);target=target.length?target:$('[name='+this.hash.slice(1)+']');if(target.length){event.preventDefault();$('html, body').animate({scrollTop:target.offset().top},1000,function(){var $target=$(target);$target.focus();if($target.is(":focus")){return!1}else{$target.attr('tabindex','-1');$target.focus()}})}}});var didScroll;var lastScrollTop=0;var delta=5;var navbarHeight=$('nav').outerHeight();$(window).scroll(function(event){didScroll=!0});setInterval(function(){if(didScroll){hasScrolled();didScroll=!1}},250);function hasScrolled(){var st=$(this).scrollTop();var brandrow=$('.brandrow').css("height");if(Math.abs(lastScrollTop-st)<=delta)
return;if(st>lastScrollTop&&st>navbarHeight){$('nav').removeClass('nav-down').addClass('nav-up');$('.nav-up').css('top',-$('nav').outerHeight()+'px')}else{if(st+$(window).height()<$(document).height()){$('nav').removeClass('nav-up').addClass('nav-down');$('.nav-up, .nav-down').css('top','0px')}}
lastScrollTop=st}
$('.site-content').css('margin-top',$('header').outerHeight()+'px')})

/*
	disqusLoader.js v1.0
	A JavaScript plugin for lazy-loading Disqus comments widget.
	-
	By Osvaldas Valutis, www.osvaldas.info
	Available for use under the MIT License
*/

;( function( window, document, index )
{
	'use strict';

	var extendObj = function( defaults, options )
		{
			var prop, extended = {};
			for( prop in defaults )
				if( Object.prototype.hasOwnProperty.call( defaults, prop ))
					extended[ prop ] = defaults[ prop ];

			for( prop in options )
				if( Object.prototype.hasOwnProperty.call( options, prop ))
					extended[ prop ] = options[ prop ];

			return extended;
		},
		getOffset = function( el )
		{
			var rect = el.getBoundingClientRect();
			return { top: rect.top + document.body.scrollTop, left: rect.left + document.body.scrollLeft };
		},
		loadScript = function( url, callback )
		{
			var script	 = document.createElement( 'script' );
			script.src	 = url;
			script.async = true;
			script.setAttribute( 'data-timestamp', +new Date());
			script.addEventListener( 'load', function()
			{
				if( typeof callback === 'function' )
					callback();
			});
			( document.head || document.body ).appendChild( script );
		},
		throttle		= function(a,b){var c,d;return function(){var e=this,f=arguments,g=+new Date;c&&g<c+a?(clearTimeout(d),d=setTimeout(function(){c=g,b.apply(e,f)},a)):(c=g,b.apply(e,f))}},

		throttleTO		= false,
		laziness		= false,
		disqusConfig	= false,
		scriptUrl		= false,

		scriptStatus	= 'unloaded',
		instance		= false,

		init = function()
		{
			if( !instance || !document.body.contains( instance ) || instance.disqusLoaderStatus == 'loaded' )
				return true;

			var winST	= window.pageYOffset,
				offset	= getOffset( instance ).top;

			// if the element is too far below || too far above
			if( offset - winST > window.innerHeight * laziness || winST - offset - instance.offsetHeight - ( window.innerHeight * laziness ) > 0 )
				return true;

			var tmp = document.getElementById( 'disqus_thread' );
			if( tmp ) tmp.removeAttribute( 'id' );
			instance.setAttribute( 'id', 'disqus_thread' );
			instance.disqusLoaderStatus = 'loaded';

			if( scriptStatus == 'loaded' )
			{
				DISQUS.reset({ reload: true, config: disqusConfig });
			}
			else // unloaded | loading
			{
				window.disqus_config = disqusConfig;
				if( scriptStatus == 'unloaded' )
				{
					scriptStatus = 'loading';
					loadScript( scriptUrl, function()
					{
						scriptStatus = 'loaded';
					});
				}
			}
		};

	window.addEventListener( 'scroll', throttle( throttleTO, init ));
	window.addEventListener( 'resize', throttle( throttleTO, init ));

	window.disqusLoader = function( element, options )
	{
		options = extendObj(
		{
			laziness:		1,
			throttle:		250,
			scriptUrl:		false,
			disqusConfig:	false,

		}, options );

		laziness		= options.laziness + 1;
		throttleTO		= options.throttle;
		disqusConfig	= options.disqusConfig;
		scriptUrl		= scriptUrl === false ? options.scriptUrl : scriptUrl; // set it only once

		if( typeof element === 'string' )				instance = document.querySelector( element );
		else if( typeof element.length === 'number' )	instance = element[ 0 ];
		else											instance = element;

		if (instance) instance.disqusLoaderStatus = 'unloaded';

		init();
	};

}( window, document, 0 ));
