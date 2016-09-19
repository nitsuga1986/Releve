//= require owl/owl.carousel.min
//= require wow.min
//= require jquery.onepagenav
//= require main


function initMap() {
	var mapDiv = document.getElementById('map');
	var map = new google.maps.Map(mapDiv, {
		center: {lat: -34.608301, lng: -58.387704},
		zoom: 16
	});
	var image = '<%= asset_path 'favicon/favicon-32x32.png' %>';
	var beachMarker = new google.maps.Marker({
		position: {lat: -34.608301, lng: -58.387704},
		map: map,
		icon: image
	});
}
  

