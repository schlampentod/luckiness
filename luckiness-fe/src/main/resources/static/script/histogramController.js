/**
 *
 */
app.controller('histogramController', ['$scope', 'luckyService', 'luckyFactory', '$interval', '$http', '$translate', 'addressAnalyticsService', '$window', 'keyGenerationService', '$timeout', 'luckyConstants', function ($scope, luckyService, luckyFactory, $interval, $http, $translate, addressAnalyticsService, $window, keyGenerationService, $timeout, luckyConstants) {

    var vm = this;

    vm.histogramLabels = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
    vm.histogramLabelsBin = ["0", "1"];

    vm.histogramValues = new Array(10);
    vm.histogramValues.fill(10);

    vm.histogramValuesBin = new Array(2);
    vm.histogramValuesBin.fill(1);

    vm.histoChartOptions = {
        legend: {
            display: false
        },
        animation: {
            duration: 1
        },
        tooltips: {
            enabled: true,
            mode: 'single',
            callbacks: {
                label: function(tooltipItem, data) {
                    var label = vm.histogramLabels[tooltipItem.index];
                    return label;
                }
            }
        }
    };

    vm.histoChartOptionsBin = {
        legend: {
            display: false
        },
        animation: {
            duration: 1
        },
        tooltips: {
            enabled: true,
            mode: 'single',
            callbacks: {
                label: function(tooltipItem, data) {
                    var label = vm.histogramLabelsBin[tooltipItem.index];
                    return label;
                }
            }
        }
    };

    $scope.$on(luckyConstants.KEY_VALUE_CHANGED_EVT, function (event, args) {

        var newKeyVal = args.newChosenKey;

        vm.histogramValues.fill(0);

        for (var i = 0; i < newKeyVal.length; i++) {
            var charAtI = parseInt(newKeyVal.charAt(i));
            vm.histogramValues[charAtI] = vm.histogramValues[charAtI] + 1;
        }

        vm.histogramValuesBin.fill(0);

        var binValStr = bigInt(newKeyVal).toString(2);
        for (var i = 0; i < binValStr.length; i++) {
            var charAtI = parseInt(binValStr.charAt(i));
            vm.histogramValuesBin[charAtI] = vm.histogramValuesBin[charAtI] + 1;
        }

    });

}]);

