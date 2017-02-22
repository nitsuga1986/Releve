angular.module("TurnosApp").controller("EventStatsCtrl",['$scope', '$location', 'ResourceEvent', '$filter','NgTableParams', '$timeout', function($scope, $location, ResourceEvent, $filter, NgTableParams, $timeout) {




	//ResourceEvent.stats({ stat: 'asistencias' }).$promise.then(function(data) {$scope.asistencias = JSON.stringify(data)});
	ResourceEvent.stats({ stat: 'ingresos' }).$promise.then(function(data) {
		$scope.labels = data.labels;
		$scope.data = data.stats;
		$scope.barChartOptions = {
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
								ctx.fillText('$'+dataset.data[i], model.x, model.y - 5);
							}
						}
					});
				}
			}
		};
	});
	
	
	

	
	
	
	
	
	
	
	
	
	
stopLoading();}]);














