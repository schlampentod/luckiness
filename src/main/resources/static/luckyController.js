/**
 *
 */

app.controller('luckyController', ['$scope', 'luckyService', 'luckyFactory', '$interval', '$http', '$translate', 'addressAnalyticsService', '$window', 'keyGenerationService', function ($scope, luckyService, luckyFactory, $interval, $http, $translate, addressAnalyticsService, $window, keyGenerationService) {

    var vm = this;

    vm.luckyCtrlPma = {
        luckyTotalGeneratedKeys: 0,
        luckyBatchGenerationInterval: null
    };

    vm.luckyCtrlDerivedKeys = {
        luckyKeyPublicAddress: null,
        luckyKeyPrivateKeyAsWIF: null
    };

    vm.luckyBinchBarsOffsets = [];
    vm.luckyBarSumValue = "";

    $scope.selectedMagicKeys = null;

    $scope.funcXyjank = function () {//передать некоторые маленькие ебучие данные, в ебучее текстовое поле
        vm.luckyBarSumValue = $scope.selectedMagicKeys.knownKeyDecimal;//$("#myselect option:selected").text();
    };

    $scope.$watch(function () { // по изменению массива расположений баров генерить "Key" и "Address"
        return vm.luckyBinchBarsOffsets;
    }, function (newVal, oldVal) {
        luckyService.currentChooser.setChooserBarsOffsets(vm.luckyBinchBarsOffsets);
        readBinchStatus();
    }, true);

    $scope.$watch(function () { // наблюдаем и отправляем запросики, и забиваем Address-суличку..
        return vm.luckyBarSumValue;
    }, function (newVal, oldVal) {

        if (vm.luckyBarSumValue !== luckyService.currentChooser.chosenValue.toString(10)) {
            luckyService.currentChooser.setProvidedChosenStringValue(vm.luckyBarSumValue);
            readBinchStatus();
            return;
        }

        vm.luckyCtrlPma.luckyTotalGeneratedKeys++;

        addressAnalyticsService.checkKeyInBlockChain(newVal).then(function (CheckKeyResultDto) {
            if (CheckKeyResultDto['checkedKeyFound']) {
                alert("Found: " + newVal);
            }
        }, function (errors) {
            console.error(errors);
        });

        addressAnalyticsService.resolveBitcoinAddressByKey(vm.luckyBarSumValue).then(function (AddressesResultDto) {
            vm.luckyCtrlDerivedKeys.luckyKeyPublicAddress = AddressesResultDto['publicAddressAsHex'];
            vm.luckyCtrlDerivedKeys.luckyKeyPrivateKeyAsWIF = AddressesResultDto['privateKeyAsWIF'];
        });

    });


    var massOfKeys = [];
    $scope.$watch(function () { // по изменению поля "Key" записывать все его новые значения в массив
        return vm.luckyBarSumValue;
    }, function (newVal, oldVal) {
        massOfKeys[massOfKeys.length] = vm.luckyBarSumValue;
    }, true);

    $scope.getkeys = function (event) {

        if (event.keyCode == 38) {
            keyGenerationService.incrementChosenValue(luckyService.currentChooser);
            readBinchStatus();
        } else if (event.keyCode == 40) {
            keyGenerationService.decrementChosenValue(luckyService.currentChooser);
            readBinchStatus();
        }
    };
    $scope.changeOffSets = function (event, index, obj) {//изменять на еденицу значение офсетов и соответственно рассположения баров


        if (event.keyCode == 38) {
            if (vm.luckyBinchBarsOffsets[index] <= 999) {
                vm.luckyBinchBarsOffsets[index]++;
                luckyService.currentChooser.setChooserBarsOffsets(vm.luckyBinchBarsOffsets);
                readBinchStatus();
            }
            ;

        } else if (event.keyCode == 40) {
            if (vm.luckyBinchBarsOffsets[index] >= 1) {
                vm.luckyBinchBarsOffsets[index]--;
                luckyService.currentChooser.setChooserBarsOffsets(vm.luckyBinchBarsOffsets);
                readBinchStatus();
            }
            ;

        }

    };

    $scope.changeLanguage = function (lang) {
        $translate.use(lang);
    };

    vm.onGenerateMinClick = function () {
        keyGenerationService.generateMinValue(luckyService.currentChooser);
        readBinchStatus();
    };

    vm.onGenerateMaxClick = function () {
        keyGenerationService.generateMaxValue(luckyService.currentChooser);
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

    vm.onOpenListOfKeysClick = function () {
        console.log("список сгенерированных ключей:" + massOfKeys);
        alert("Вывел список в консоль");
        if (massOfKeys.length > 80) {
            alert("пизда как их дохуя.. может реально в файл скидывать?")
        }
    };

    //
    //
    //

    function generateRandomOffsets() {
        keyGenerationService.generateRandomBarOffsets(luckyService.currentChooser);
        readBinchStatus();
    }

    function readBinchStatus() {
        vm.luckyBinchBarsOffsets = luckyService.currentChooser.getBinchBarOffsets();
        vm.luckyBarSumValue = luckyService.currentChooser.chosenValue.toString(10);
    }

    readBinchStatus();


}]);

