(function ()
{
    'use strict';

    angular
        .module('app.core')
        .directive('msCompare', msCompareDirective);

    /** @ngInject */
    function msCompareDirective()
    {
        return {
            require: "ngModel",
            scope: {
                otherModelValue: "=msCompare"
            },
            link: function(scope, element, attributes, ngModel) {

                scope.$watch("otherModelValue", function(newVal) {
                    //ngModel.$validate();
                    ngModel.$setValidity('password', ngModel.$viewValue == newVal);
                });

                ngModel.$validators.password = function(modelValue) {
                    return modelValue == scope.otherModelValue;
                };
            }
        };
    }
})();