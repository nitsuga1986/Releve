angular.module("TurnosApp").controller("ClaseJoinCtrl", ['$scope', '$routeParams', '$location', 'ResourceClase', function($scope, $routeParams, $location, ResourceClase) {
	$scope.clase = {};

	// Join
	$scope.JoinUser = function() {
		ResourceClase.join($scope.clase, success, failure).$promise.then(function(data) {
			$('#calendar').calendar(options);
			$('#alert-container').hide().html('<div class="alert alert-success alert-dismissible" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button><strong><i class="fa fa-check-square-o" aria-hidden="true"></i> Inscrpción exitosa! </strong> Ya hemos guardado tu lugar en la clase, te esperamos!</div>').slideDown();
		});
	};
	// Unjoin
	$scope.UnJoinUser = function() {
		ResourceClase.unjoin($scope.clase, success, failure).$promise.then(function(data) {
			$('#calendar').calendar(options);
			$('#alert-container').hide().html('<div class="alert alert-danger alert-dismissible" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button><strong><i class="fa fa-times" aria-hidden="true"></i> Clase cancelada! </strong> Ya hemos cancelado tu inscripción a la clase. Gracias por avisar!</div>').slideDown();
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
				$('#events-modal').modal('toggle');
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
	
	// eventsLoader
	function eventsLoader(events) {
		function dateFormat(date) {date = date.split('-'); date = date[2]+'/'+date[1]; return date;}
		var list = $('#eventlist').html('');
		var mylist = $('#myeventlist').html('');
		var next_clases_count=0;
		var my_clase_count=0;
		// Each event:
		$.each(events, function(key_event, event) {
			// completa?
			if( events[key_event].users.length >=  events[key_event].max_users) {	
				events[key_event].completa = true; events[key_event].class = 'default';
			} else {
				events[key_event].completa = false;}
			// Each user in event:
			$.each(event.users, function(key_user, user) {
				// joined?
				if(user.id == $scope.user_id) {	
					events[key_event].joined = true;
					my_clase_count+=1;
					// Mis Clases List
					$(document.createElement('a')).addClass("eventmylist btn btn-default setClase").attr('type', 'button')
					.attr('data-event-id', event.id)
					.html('<i title="Anotado!" class="fa fa-check-square text-'+event.class+'" aria-hidden="true"></i> '+dateFormat(event.fecha)+' '+event.horario+'hs: '+event.actividad).appendTo(mylist);
				} else {
					events[key_event].joined = false;
				}
			});
			// old_clase?
			today = new Date();
			fecha_clase = new Date(event.fecha);
			if( fecha_clase > today) {	
				events[key_event].old_clase = false;
				next_clases_count+=1;
				if (next_clases_count<10){
					// Próximas clases List
					if (event.joined!=true){
					$(document.createElement('a')).addClass("eventlist btn btn-default setClase").attr('type', 'button')
					.attr('data-event-id', event.id)
					.html('<i title="Click para anotarse" class="fa fa-circle text-'+event.class+'" aria-hidden="true"></i> '+dateFormat(event.fecha)+' '+event.horario+'hs: '+event.actividad).appendTo(list);}
					else {
					$(document.createElement('a')).addClass("eventlist btn btn-default setClase").attr('type', 'button')
					.attr('data-event-id', event.id)
					.html('<i title="Anotado!" class="fa fa-check-square text-'+event.class+'" aria-hidden="true"></i> '+dateFormat(event.fecha)+' '+event.horario+'hs: '+event.actividad).appendTo(list);}
					
				}
			} else {
				events[key_event].old_clase = true;
				events[key_event].class = 'default';
			}
		});
		if (next_clases_count==0){$(document.createElement('p')).html('No hay clases disponibles en este momento').appendTo(list);}
		if (my_clase_count==0){$(document.createElement('p')).html('No tienes clases programadas =(').appendTo(mylist);}
		if (my_clase_count>0 && $scope.user_primera_clase){$scope.join_complete=true;}else{$scope.join_complete=false;}
		$scope.clases = events;
	}
	
	// Calendar
	var calendar = $('#calendar').calendar(options);
	
	// First Clase Modal
	if ($scope.user_primera_clase){$('#first-clase-modal').modal('toggle')}


}]);















