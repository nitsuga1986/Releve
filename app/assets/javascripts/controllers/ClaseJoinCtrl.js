angular.module("TurnosApp").controller("ClaseJoinCtrl", ['$scope', '$routeParams', '$location', 'ResourceClase', function($scope, $routeParams, $location, ResourceClase) {
	$scope.clase = {};

	// Event click. $scope.clases[index] => $scope.clase
	$(document.body).on('click', 'a[data-event-id]', function(){
		id = $(this).attr('data-event-id');
		setClase(id);
	});
	
	// setClase
	function setClase(id) {
		$.each($scope.clases, function(index) {
			if($scope.clases[index].id == id) {
				$scope.clase = $scope.clases[index];
				$scope.$apply() 
				return false;
			}    
		});
	}
	
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
		modal: "#events-modal",
		modal_type: "none",
		format12: false,
		tmpl_cache: false,
		onAfterEventsLoad: function(events) {
			if(!events) {return;}
			var list = $('#eventlist');
			list.html('');
			var count=0;
			$.each(events, function(key_event, event) {
				// Old_class
				today = new Date();
				fecha_clase = new Date(event.fecha);
				if( fecha_clase > today) {	events[key_event].old_class = false;
				} else {						events[key_event].old_class = true;}
				// Each user
				$.each(event.users, function(key_user, user) {
					//Joined
					if(user.id == $scope.user_id) {	events[key_event].joined = true;
					} else {						events[key_event].joined = false;}
				});
				if (events[key_event].old_class == false){
					count+=1;
					if (count<10){
						if (event.joined!=true){
						$(document.createElement('a')).addClass("setClaseOnClick eventlist btn btn-default").attr('type', 'button')
						.attr('data-event-id', event.id).attr('data-toggle', 'modal').attr('data-target', '#events-modal')
						.html('<i title="Click para anotarse" class="fa fa-circle pull-left text-'+event.class+'" aria-hidden="true"></i> '+event.title).appendTo(list);}
						else {
						$(document.createElement('a')).addClass("setClaseOnClick eventlist btn btn-default").attr('type', 'button')
						.attr('data-event-id', event.id).attr('data-toggle', 'modal').attr('data-target', '#events-modal')
						.html('<i title="Anotado!" class="fa fa-check-square pull-left text-'+event.class+'" aria-hidden="true"></i>'+event.title).appendTo(list);}
						
					}
				} 
			});
			if (count==0){$(document.createElement('p')).html('No hay clases disponibles en este momento').appendTo(list);}
			$scope.clases = events;
		},
		onAfterViewLoad: function(view) {
			$('h3.title').html("Turnos <span class='muted'>· "+this.getTitle()+"</span>");
			$('.btn-group button').removeClass('active');
			$('button[data-calendar-view="' + view + '"]').addClass('active');
			// Prev-Next
			$('.btn-group button[data-calendar-nav]').each(function() {
				var $this = $(this);
				$this.unbind().click(function() {
					calendar.navigate($this.data('calendar-nav'));
				});
			});
			// Calendar view
			$('.btn-group button[data-calendar-view]').each(function() {
				var $this = $(this);
				$this.unbind().click(function() {
					calendar.view($this.data('calendar-view'));
				});
			});
		},
		classes: {
			months: {
				general: 'label'
			}
		},
		week_numbers_iso_8601: true,
	};

	var calendar = $('#calendar').calendar(options);

}]);















