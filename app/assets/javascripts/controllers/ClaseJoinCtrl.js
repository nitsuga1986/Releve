angular.module("TurnosApp").controller("ClaseJoinCtrl", ['$scope', '$routeParams', '$location', 'ResourceClase', function($scope, $routeParams, $location, ResourceClase) {
	$scope.clase = {};

	// Join
	$scope.JoinUser = function() {
		ResourceClase.join($scope.clase, success, failure).$promise.then(function(data) {
			$('#calendar').calendar(options);
		});
	};
	// Unjoin
	$scope.UnJoinUser = function() {
		ResourceClase.unjoin($scope.clase, success, failure).$promise.then(function(data) {
			$('#calendar').calendar(options);
		});
	};
	// Callback Success
	function success(response) {
		console.log("success", response);
		$location.path("/dashboard/join");
	}
	// Callback Failure
	function failure(response) {
		$scope.submiterror = true;
		window.scrollTo(0, 0);
		console.log("failure", response)
		_.each(response.data, function(errors, key) {
			_.each(errors, function(e) {
				$scope.form[key].$dirty = true;
				$scope.form[key].$setValidity(e, false);
			});
		});
	}
	
	
	var options = {
		events_cache: true,
		events_source: "/api/clases.json",
		view: 'month',
		format12: false,
		tmpl_cache: false,
		onAfterEventsLoad: function(events) {
			if(!events) {return;}
			eventsLoader(events);
		},
		onAfterViewLoad: function(view) {
			// Class active: btn-group-view 
			$('.btn-group-view button').removeClass('active');
			$('button[data-calendar-view="' + view + '"]').addClass('active');
			// Prev-Next buttons
			$('.btn-group button[data-calendar-nav]').each(function() {
				var $this = $(this);
				$this.unbind().click(function() {
					calendar.navigate($this.data('calendar-nav'));
				});
			});
			// Calendar view buttons
			$('.btn-group button[data-calendar-view]').each(function() {
				var $this = $(this);
				$this.unbind().click(function() {
					calendar.view($this.data('calendar-view'));
				});
			});
			// Clase selected => to Modal
			$(document.body).off('click', 'a[data-event-id].setClase').on('click', 'a[data-event-id].setClase', function(){
				id = $(this).attr('data-event-id');
				setClaseModal(id);
				$('#events-modal').modal('toggle')
			});
		},
		onAfterSlideLoad: function(view) {
			$('ul.list-unstyled > li[data-event-id].setClase').off('click');
			$('ul.list-unstyled > li[data-event-id].setClase').on('click', function(event){
				id = $(this).attr('data-event-id');
				setClaseModal(id);
				$('#events-modal').modal('toggle');
				return false;
			});
		},
		classes: {
			months: {
				general: 'label'
			}
		},
		week_numbers_iso_8601: true,
	};

	
	// setClaseModal
	function setClaseModal(id) {
		$.each($scope.clases, function(index) {
			if($scope.clases[index].id == id) {
				$scope.clase = $scope.clases[index];
				$scope.$apply();
				return false;
			}    
		});
	}
	function dateFormat(date) {
		date = date.split('-')
		date = date[2]+'/'+date[1]
		return date

	}
	// eventsLoader
	function eventsLoader(events) {
		var list = $('#eventlist').html('');
		var mylist = $('#myeventlist').html('');
		// All events
		var old_clase_count=0;
		var my_clase_count=0;
		$.each(events, function(key_event, event) {
			// completa?
			if( events[key_event].users.length >=  events[key_event].max_users) {	
				events[key_event].completa = true; events[key_event].class = 'default';
			} else {
				events[key_event].completa = false;}
			// old_clase?
			today = new Date();
			fecha_clase = new Date(event.fecha);
			if( fecha_clase > today) {	events[key_event].old_clase = false;
			} else {					events[key_event].old_clase = true; events[key_event].class = 'default';}
			// Each user in event
			$.each(event.users, function(key_user, user) {
				//Joined
				if(user.id == $scope.user_id) {	events[key_event].joined = true;
				} else {						events[key_event].joined = false;}
			});
			if (events[key_event].old_clase == false){
				old_clase_count+=1;
				if (old_clase_count<10){
					if (event.joined!=true){
					$(document.createElement('a')).addClass("eventlist btn btn-default setClase").attr('type', 'button')
					.attr('data-event-id', event.id)
					.html('<i title="Click para anotarse" class="fa fa-circle text-'+event.class+'" aria-hidden="true"></i> '+dateFormat(event.fecha)+' '+event.horario+'hs: '+event.actividad).appendTo(list);}
					else {
					$(document.createElement('a')).addClass("eventlist btn btn-default setClase").attr('type', 'button')
					.attr('data-event-id', event.id)
					.html('<i title="Anotado!" class="fa fa-check-square text-'+event.class+'" aria-hidden="true"></i> '+dateFormat(event.fecha)+' '+event.horario+'hs: '+event.actividad).appendTo(list);}
					
				}
			} 
			if (events[key_event].joined == true){
				my_clase_count+=1;
				$(document.createElement('a')).addClass("eventmylist btn btn-default setClase").attr('type', 'button')
				.attr('data-event-id', event.id)
				.html('<i title="Anotado!" class="fa fa-check-square text-'+event.class+'" aria-hidden="true"></i> '+dateFormat(event.fecha)+' '+event.horario+'hs: '+event.actividad).appendTo(mylist);
			} 
		});
		if (old_clase_count==0){$(document.createElement('p')).html('No hay clases disponibles en este momento').appendTo(list);}
		if (my_clase_count==0){$(document.createElement('p')).html('No tienes clases programadas =(').appendTo(mylist);}
		$scope.clases = events;
	}
	var calendar = $('#calendar').calendar(options);

}]);















