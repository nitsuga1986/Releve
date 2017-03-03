angular.module("TurnosApp").controller("EventStatsCtrl",['$scope', '$location', 'ResourceEvent', '$filter','NgTableParams', '$timeout', function($scope, $location, ResourceEvent, $filter, NgTableParams, $timeout) {


	// Ingresos
	ResourceEvent.stats({ stat: 'ingresos' }).$promise.then(function(data) {
		$scope.labelsIngresos = data.labels;
		$scope.dataIngresos = data.stats;
		$scope.optionsIngresos = {
			animation: {
				onComplete: function () {
					var ctx = this.chart.ctx;
					ctx.font = Chart.helpers.fontString(Chart.defaults.global.defaultFontFamily, 'normal', Chart.defaults.global.defaultFontFamily);
					ctx.fillStyle = "black";
					ctx.textAlign = 'center';
					ctx.textBaseline = 'bottom';
					this.data.datasets.forEach(function (dataset)
					{
						for (var i = 0; i < dataset.data.length; i++) {
							for(var key in dataset._meta)
							{
								var model = dataset._meta[key].data[i]._model;
								if (dataset.data[i]!=0){ctx.fillText('$'+dataset.data[i], model.x, model.y - 5);}
							}
						}
					});
				}
			}
		};
	});
	
	// Clases por Instructor
	ResourceEvent.stats({ stat: 'clases_instructores' }).$promise.then(function(data) {
		$scope.labelsInstructor = data.labels;
		$scope.seriesInstructor = data.series;
		$scope.dataInstructor = data.stats;
		$scope.optionsInstructor = {
			legend: {display: true,}
		};
	});
	

	

	
stopLoading();}]);














