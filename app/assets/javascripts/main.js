jQuery(function($) {
	"use strict";
	// Author Code Here

	var owlPricing;
	var ratio = 2;

	// Window Scroll
	function onScroll() {
		if ($(window).scrollTop() > 50) {
			$('nav.original').css('opacity', '0');
			$('nav.navbar-fixed-top').css('opacity', '1');
		} else {
			$('nav.original').css('opacity', '1');
			$('nav.navbar-fixed-top').css('opacity', '0');
		}
	}

	window.addEventListener('scroll', onScroll, false);

	// Window Resize
	$(window).resize(function() {
		$('header').height($(window).height());
	});

	function centerModal() {
		$(this).css('display', 'block');
		var $dialog = $(this).find(".modal-dialog"),
			offset = ($(window).height() - $dialog.height()) / 2,
			bottomMargin = parseInt($dialog.css('marginBottom'), 10);

		// Make sure you don't hide the top part of the modal w/ a negative margin
		// if it's longer than the screen height, and keep the margin equal to 
		// the bottom margin of the modal
		if (offset < bottomMargin) offset = bottomMargin;
		$dialog.css("margin-top", offset);
	}

	$('.modal').on('show.bs.modal', centerModal);

	$('.modal-popup .close-link').click(function(event){
		event.preventDefault();
		$('#modal1').modal('hide');
	});

	$(window).on("resize", function() {
		$('.modal:visible').each(centerModal);
	});

	// Window Load
	$(window).load(function() {

		// Header Init
		if ($(window).height() > $(window).width()) {
			var ratio = $('.parallax').width() / $('.parallax').height();
			$('.parallax img').css('height', ($(window).height()) + 'px');
			$('.parallax img').css('width', $('.parallax').height() * ratio + 'px');
		}

		$('header').height($(window).height() + 80);
		$('header > .container').height($('header').height());
		
		
		
		$('section .cut').each(function() {
			if ($(this).hasClass('cut-top'))
				$(this).css('border-right-width', $(this).parent().width() + "px");
			else if ($(this).hasClass('cut-bottom'))
				$(this).css('border-left-width', $(this).parent().width() + "px");
		});

		// Sliders Init
		$('.owl-schedule').owlCarousel({
			singleItem: true,
			pagination: true
		});
		$('.owl-testimonials').owlCarousel({
			singleItem: true,
			pagination: true
		});
		$('.owl-twitter').owlCarousel({
			singleItem: true,
			pagination: true
		});
		$("#gallery-carrousel").owlCarousel({
			autoPlay: 3000, //Set AutoPlay to 3 seconds
			items : 2,
			itemsDesktop : [1199,2],
			itemsDesktopSmall : [979,2]
		});
		// Navbar Init
		$('nav').addClass('original').clone().insertAfter('nav').addClass('navbar-fixed-top').css('position', 'fixed').css('top', '0').css('margin-top', '0').removeClass('original');
		$('nav.navbar-fixed-top .navbar-brand img').attr('src', $('nav.navbar-fixed-top .navbar-brand img').data("active-url"));
		// Onepage Nav
		$('.navbar.navbar-fixed-top .navbar-nav').onePageNav({
			currentClass: 'active',
			changeHash: false,
			scrollSpeed: 400,
			filter: ':not(.btn)'
		});

		// Preloader
		$('.intro-tables, .parallax, header').css('opacity', '0');
		$('.preloader').addClass('animated fadeOut').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function() {
			$('.preloader').hide();
			$('.parallax, header').addClass('animated fadeIn').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function() {
				$('.intro-tables').addClass('animated fadeInUp').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function() {
					$('#intro > .container').addClass('run-animation').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend');
				});
			});
		});
		//callback handler for form submit
		$("form#pricing").submit(function(event){
			event.preventDefault();
			var $inputs = $('form#pricing :input');
			var postData = {};$inputs.each(function() {postData[this.name] = $(this).val();});postData=JSON.stringify(postData);
			var formURL = $(this).attr("action");
			$.ajax(
			{
				type: "POST",
				url : formURL,
				contentType: "application/json",
				dataType: "json",
				data : postData,
				success:function(data, textStatus, jqXHR) {$('#formerror').hide();$('#formsuccess').slideDown();},
				error: function(jqXHR, textStatus, errorThrown) {$('#formsuccess').hide();$('#formerror').slideDown();grecaptcha.reset();}
			});
		});
	});


});


