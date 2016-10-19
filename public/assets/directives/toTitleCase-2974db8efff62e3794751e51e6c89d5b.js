angular.module("TurnosApp").directive('toTitleCase',['$parse', function($parse) {
	function toTitleCase(str){return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});}
	return {
		require: 'ngModel',
		link: function(scope, element, attrs, modelCtrl) {
			var capitalize = function(inputValue) {
				if (inputValue === undefined) { inputValue = ''; }
				var capitalized = toTitleCase(inputValue);
				
				if(capitalized !== inputValue) {
					modelCtrl.$setViewValue(capitalized);
					modelCtrl.$render();
				}         
				return capitalized;
			}
			modelCtrl.$parsers.push(capitalize);
			capitalize($parse(attrs.ngModel)(scope)); // capitalize initial value
		}
	};
}]);
