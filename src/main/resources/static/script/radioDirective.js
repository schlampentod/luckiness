app.directive('radioDirective', function ($http) {

    return {
        link: function (scope, element, attrs, ngModel) {

                scope.robi = parseInt(attrs.value);
                //debugger;

        }
    }

});