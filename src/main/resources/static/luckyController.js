/**
 *
 */

app.controller('luckyController', ['$scope', 'luckyService', 'luckyFactory', '$interval', '$http', '$translate', 'luckyAddressService', function ($scope, luckyService, luckyFactory, $interval, $http, $translate, luckyAddressService) {

    var vm = this;

    vm.luckyCtrlPma = {
        luckyTotalGeneratedKeys: 0,
        luckyBatchGenerationInterval: null
    };

    vm.luckyCtrlDerivedKeys = {
        luckyKeyPublicAddress: null
    };

    vm.luckyBinchBarsOffsets = [];
    vm.luckyBarSumValue = "";
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

        luckyAddressService.checkKeyInBlockChain(newVal).then(function (CheckKeyResultDto) {
            if (CheckKeyResultDto['checkedKeyFound']) {
                alert("Found: " + newVal);
            }
        }, function (errors) {
            console.error(errors);
        });

        luckyAddressService.resolveBitcoinAddressByKey(vm.luckyBarSumValue).then(function (AddressesResultDto) {
            vm.luckyCtrlDerivedKeys.luckyKeyPublicAddress = AddressesResultDto['publicAddressAsHex'];
        });
    });

    $scope.$watch(function () {//по изменению текстового поля генерить масив баров
        return vm.luckyProvidedExactValue;
    }, function (newVal, oldVal) {
        vm.onParseProvidedValueClick();
    });

    $scope.getkeys = function (event) {

        if (event.keyCode == 38) {
            luckyService.currentChooser.incrementChosenValue();
            readBinchStatus();
        } else if (event.keyCode == 40) {
            luckyService.currentChooser.decrementChosenValue();
            readBinchStatus();
        }
    };

    $scope.changeLanguage = function (lang) {
        $translate.use(lang);
    };

    vm.onParseProvidedValueClick = function () {//по клику сгениреть масив расположений баров на хтмл
        var parsedOffsets = luckyService.currentChooser.setProvidedChosenStringValue(vm.luckyProvidedExactValue);
        luckyService.currentChooser.generateKeysOfValue(parsedOffsets);
        readBinchStatus();
    };

    vm.onGenerateMinClick = function () {
        luckyService.currentChooser.generateMinValue();
        readBinchStatus();
    };

    vm.onGenerateMaxClick = function () {
        luckyService.currentChooser.generateMaxValue();
        readBinchStatus();
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
        readBinchStatus();
    }

    function readBinchStatus() {

        vm.luckyBinchBarsOffsets = [];
        _.forEach(luckyService.currentChooser.binchBars, function (bb, i) {
            vm.luckyBinchBarsOffsets.push(bb.binchBarOffsetPx);
        });

        vm.luckyBarSumValue = luckyService.currentChooser.chosenValue.toString(10);
    }

    readBinchStatus();

}]);

