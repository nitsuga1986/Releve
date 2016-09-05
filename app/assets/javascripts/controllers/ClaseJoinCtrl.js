angular.module("TurnosApp").controller("ClaseJoinCtrl", ['$scope', '$routeParams', '$location', 'ResourceClase', function($scope, $routeParams, $location, ResourceClase) {
	startLoading();
	$scope.clase = {};

	// Join
	$scope.JoinUser = function() {
		startLoading();
		ResourceClase.join($scope.clase, success, failure).$promise.then(function(data) {
			$('#calendar').calendar(options);
			$('#alert-container').hide().html('<div class="alert alert-success alert-dismissible" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button><strong><i class="fa fa-check-square-o" aria-hidden="true"></i> Inscrpción exitosa! </strong> Ya hemos guardado tu lugar en la clase, te esperamos!</div>').slideDown();
			stopLoading();
		});
	};
	// Unjoin
	$scope.UnJoinUser = function() {
		startLoading();
		ResourceClase.unjoin($scope.clase, success, failure).$promise.then(function(data) {
			$('#calendar').calendar(options);
			$('#alert-container').hide().html('<div class="alert alert-danger alert-dismissible" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button><strong><i class="fa fa-times" aria-hidden="true"></i> Clase cancelada! </strong> Ya hemos cancelado tu inscripción a la clase. Gracias por avisar!</div>').slideDown();
			stopLoading();
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
	// startLoading
	function startLoading() {
		$('#AppContainer').fadeOut();
		$('#ReleveImgNav').hide();
		$('#LoadingImg').show();
	}
	// stopLoading
	function stopLoading() {
		$('#LoadingImg').hide();
		$('#ReleveImgNav').show();
		$('#AppContainer').fadeIn();
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
			$('#toolsBarTitle').text(this.getTitle());
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
				$('#events-modal').modal('show');
			});
		},
		onAfterSlideLoad: function(view) {
			$('ul.list-unstyled > li[data-event-id].setClase').off('click');
			$('ul.list-unstyled > li[data-event-id].setClase').on('click', function(event){
				id = $(this).attr('data-event-id');
				setClaseModal(id);
				$('#events-modal').modal('show');
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
		var mylist = $('#myeventlist').html('');
		var $accordionlist = $('#accordionlist').html('');
		var next_clases_count=0;
		var my_clase_count=0;
		// Each event:
		$.each(events, function(key_event, event) {
			//// Set variables
			// completa?
			if( events[key_event].users.length >=  events[key_event].max_users) {	
				events[key_event].completa = true; events[key_event].class = 'default';
			} else {
				events[key_event].completa = false;}
			// Each user in event:
			$.each(event.users, function(key_user, user) {
				// joined?
				if(user.id == $scope.user_id) { events[key_event].joined = true;
				} else { 						events[key_event].joined = false;}
			});
			// old_clase?
			today = new Date();
			fecha_clase = new Date(event.fecha+" "+event.horario);
			if( fecha_clase > today) {
				// cancelable?
				if( today > new Date(fecha_clase.getTime() - (24 * 60 * 60 * 1000))) {
						events[key_event].cancelable = false;
				}else{	events[key_event].cancelable = true;}
				events[key_event].old_clase = false;
			} else {
				events[key_event].old_clase = true;
				events[key_event].class = 'default';
			}
			//// Print
			if(events[key_event].old_clase == false){
				datePanelid = (dateFormat(event.fecha)).replace(/\//g, '');
				$datePanel = $('#'+datePanelid);
				if( !$datePanel.length ) {
					$accordionlist.append('<div class="panel panel-default accordionlist" id="'+datePanelid+'"><div class="panel-heading"><h4 class="panel-title"><a class="btn-block" href="javascript:;" data-toggle="collapse" data-parent="#accordion" data-target="#collapse'+datePanelid+'"><i class="indicator glyphicon glyphicon-chevron-right pull-right"></i> '+dayNames[(new Date(event.fecha+'T12:00:00Z')).getDay()]+' '+dateFormat(event.fecha)+'</a></h4></div><div id="collapse'+datePanelid+'" class="panel-collapse collapse"><div class="panel-body" id="'+datePanelid+'-body"></div></div></div>');
					next_clases_count+=1;
				}
				$datePanel_body = $('#'+datePanelid+'-body');
				if (next_clases_count<10){
					if(events[key_event].joined == true) {
						// Mis Clases List
						my_clase_count+=1;
						$miclase_btn = $(document.createElement('a')).addClass("eventmylist btn btn-default btn-block setClase").attr('type', 'button')
						.attr('data-event-id', event.id).attr('title', 'Click para cancelar la inscripción')
						.html('<i class="fa fa-check-square text-'+event.class+'" aria-hidden="true"></i> '+event.horario+'hs: '+event.actividad+' con '+event.instructor).appendTo(mylist);
					}
					// Próximas clases List
					if (event.joined!=true){
						$clase_btn = $(document.createElement('a')).addClass("eventlist btn btn-default btn-block setClase").attr('type', 'button')
						.attr('data-event-id', event.id).attr('title', 'Click para anotarse')
						.html('<i class="fa fa-circle text-'+event.class+'" aria-hidden="true"></i> '+event.horario+'hs: '+event.actividad+' con '+event.instructor).appendTo($datePanel_body);}
					else {
						$clase_btn = $(document.createElement('a')).addClass("eventlist btn btn-default btn-block setClase").attr('type', 'button')
						.attr('data-event-id', event.id).attr('title', 'Click para cancelar la inscripción')
						.html('<i class="fa fa-check-square text-'+event.class+'" aria-hidden="true"></i> '+event.horario+'hs: '+event.actividad+' con '+event.instructor).appendTo($datePanel_body);
					}
				}
			}
		});
		function toggleChevron(e) {
			$(e.target)
				.prev('.panel-heading')
				.find("i.indicator")
				.toggleClass('glyphicon-chevron-down glyphicon-chevron-right');
		}
		$('#accordionlist').off('hidden.bs.collapse', toggleChevron).on('hidden.bs.collapse', toggleChevron);
		$('#accordionlist').off('shown.bs.collapse', toggleChevron).on('shown.bs.collapse', toggleChevron);
		// Empty Lists text: 
		if (next_clases_count==0){$(document.createElement('p')).html('No hay clases disponibles en este momento').appendTo($accordionlist);}
		if (my_clase_count==0){$(document.createElement('p')).html('No tienes clases programadas =(').appendTo(mylist);}
		// join_complete(boolean)
		if (($scope.user_primera_clase && my_clase_count>0)||(!$scope.user_primera_clase && my_clase_count>=$scope.user_nro_clases)){$scope.join_complete=true;}else{$scope.join_complete=false;}
		// events => $scope.clases (!!!)
		$scope.clases = events;
	}
	// Calendar start
	var calendar = $('#calendar').calendar(options);
	// First Clase Modal
	if ($scope.user_primera_clase){if($scope.user_confirmed){$('#first-clase-modal').modal('show')}}
	stopLoading();

}]);
