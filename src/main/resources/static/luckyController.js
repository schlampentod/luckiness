/**
 *
 */

app.controller('luckyController', ['$scope', 'luckyService', 'luckyFactory', '$interval','$http', function ($scope, luckyService, luckyFactory, $interval, $http) {
    var vm = this;

    vm.luckyCtrlPma = {
        luckyTotalGeneratedKeys: 0,
        luckyBatchGenerationInterval: null
    };

    vm.luckyCtrlDerivedKeys = {
        luckyKeyPublicAddress: null
    };

    vm.luckyBinchBarsOffsets = [];

    populateBarOffsets();

    vm.luckyBarSumValue = luckyService.currentChooser.chosenValue.toString(10);

    vm.luckyProvidedExactValue = "";

    $scope.$watch(function () {//по изменению массива расположений баров генерить "Key" и "Address"
            return vm.luckyBinchBarsOffsets;
    }, function (newVal, oldVal) {
        luckyService.currentChooser.setChooserBarsOffsets(vm.luckyBinchBarsOffsets);
        vm.luckyBarSumValue = luckyService.currentChooser.chosenValue.toString(10);
    }, true);

    $scope.$watch(function () {//наблюдаем и отправляем запросики, и забиваем Address-суличку..
        return vm.luckyBarSumValue;
    }, function (newVal, oldVal) {
        vm.luckyCtrlPma.luckyTotalGeneratedKeys++;
        luckyService.checkKeyInBlockChain(newVal);
        var promise = $http.get('http://localhost:8080/rest/v1/lucky/addresses/'+vm.luckyBarSumValue);
        promise.then(function (response) {
            vm.luckyCtrlDerivedKeys.luckyKeyPublicAddress=response.data.publicAddressAsHex;
        });
    });

    $scope.$watch(function () {//по изменению текстового поля генерить масив баров
        return vm.luckyProvidedExactValue;
    }, function (newVal, oldVal) {
        var parsedOffsets = luckyService.currentChooser.setProvidedChosenStringValue(vm.luckyProvidedExactValue);
        luckyService.currentChooser.generateKeysOfValue(parsedOffsets);
        populateBarOffsets();
    });

    $scope.getkeys = function (event) {
        var one = bigInt("1");
        var bigValue = bigInt(vm.luckyProvidedExactValue);
        if (event.keyCode == 38) {
            bigValue = bigValue.add(one);
            vm.luckyProvidedExactValue = bigValue.toString();
        }
        if (event.keyCode == 40) {
            bigValue = bigValue.subtract(one);
            vm.luckyProvidedExactValue = bigValue.toString();
        }
    };

    vm.onParseProvidedValueClick = function () {//по клику сгениреть масив расположений баров на хтмл
        var parsedOffsets = luckyService.currentChooser.setProvidedChosenStringValue(vm.luckyProvidedExactValue);
        luckyService.currentChooser.generateKeysOfValue(parsedOffsets);
        populateBarOffsets();
    };

    vm.onGenerateMinClick = function () {
        luckyService.currentChooser.generateMinValue();
        populateBarOffsets();
        vm.luckyBarSumValue = luckyService.currentChooser.chosenValue.toString(10);
    };

    vm.onGenerateMaxClick = function () {
        luckyService.currentChooser.generateMaxValue();
        populateBarOffsets();
        vm.luckyBarSumValue = luckyService.currentChooser.chosenValue.toString(10);
    };

    vm.onGenerateRandomClick = function () {
        generateRandomOffsets();
    };

    vm.onStartRandomBatchClick = function () {
        if (vm.luckyCtrlPma.luckyBatchGenerationInterval) {
            $interval.cancel(vm.luckyCtrlPma.luckyBatchGenerationInterval);
            vm.luckyCtrlPma.luckyBatchGenerationInterval = null;
        } else {
            vm.luckyCtrlPma.luckyBatchGenerationInterval = $interval(function () {
                generateRandomOffsets();
            }, 20);
        }
    };

    //
    //
    //

    function generateRandomOffsets() {
        luckyService.currentChooser.generateRandomBarOffsets();
        populateBarOffsets();
        vm.luckyBarSumValue = luckyService.currentChooser.chosenValue.toString(10);
    }

    function populateBarOffsets() {
        vm.luckyBinchBarsOffsets = [];
        _.forEach(luckyService.currentChooser.binchBars, function (bb, i) {
            vm.luckyBinchBarsOffsets.push(bb.binchBarOffsetPx);
        });
    }

}]);

