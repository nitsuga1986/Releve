angular.module("TurnosApp").filter('true_false', [function(){
    return function(text) {
        if (text==true) {
            return 'Si';
        }
        if (text==false) {
            return 'No';
        }
        return text;
    }
}]);
