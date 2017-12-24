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
        luckyKeyPrivateKeyAsWIF: null,
        luckyKeyWasFound: false
    };

    vm.luckyBinchBarsOffsets = [];
    vm.luckyBarSumValue = "";

    $scope.selectedKnownKey = null;

    var allKeyIsPressed = false;
    $(document).keyup(function (evt) {
        if (evt.keyCode == 65) {
            allKeyIsPressed = false;
        }
    }).keydown(function (evt) {
        if (evt.keyCode == 65) {
            allKeyIsPressed = true;
            // console.log('A')
        }
    });

    $scope.funcXyjank = function () {
        vm.luckyBarSumValue = $scope.selectedKnownKey.knownKeyDecimal;
    };

    $scope.$watch(function () { // по изменению массива расположений баров генерить "Key" и "Address"
        return vm.luckyBinchBarsOffsets;
    }, function (newVal, oldVal) {

        if (allKeyIsPressed) {

            var changeIdxes = findChangedBarIndexes(newVal, oldVal);
            if (changeIdxes.length === 1) {
                var changedIdx = changeIdxes[0];
                var changeDelta = newVal[changedIdx] - oldVal[changedIdx];

                _.forEach(vm.luckyBinchBarsOffsets, function (barOffset, i) {
                    vm.luckyBinchBarsOffsets[i] = vm.luckyBinchBarsOffsets[i] + changeDelta;
                });

                return;
            }
        }

        luckyService.currentChooser.setChooserBarsOffsets(vm.luckyBinchBarsOffsets);
        readBinchStatus();

    }, true);

    $scope.$watch(function () { // наблюдаем и отправляем запросики, и забиваем Address-суличку..
        return vm.luckyBarSumValue;
    }, function (newVal, oldVal) {

        if (vm.luckyBarSumValue !== luckyService.currentChooser.chosenValue.toString(10)) {
            luckyService.currentChooser.setProvidedChosenStringValue(vm.luckyBarSumValue);
            readBinchStatus();
            //return;
        }

        vm.luckyCtrlPma.luckyTotalGeneratedKeys++;

        addressAnalyticsService.checkKeyInBlockChain(newVal).then(function (CheckKeyResultDto) {
            vm.luckyCtrlDerivedKeys.luckyKeyWasFound = ( _.includes(CheckKeyResultDto['checkedKeysMatched'], newVal) && CheckKeyResultDto['checkedKeyFound']);
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
    $scope.changeOffSets = function (event, index) {//изменять на еденицу значение офсетов и соответственно рассположения баров

        if (event.keyCode == 38) {
            if (vm.luckyBinchBarsOffsets[index] <= 999) {
                vm.luckyBinchBarsOffsets[index]++;
                luckyService.currentChooser.setChooserBarsOffsets(vm.luckyBinchBarsOffsets);
                console.log(vm.luckyBinchBarsOffsets[index]);
                readBinchStatus();
            }

        } else if (event.keyCode == 40) {
            if (vm.luckyBinchBarsOffsets[index] >= 1) {
                vm.luckyBinchBarsOffsets[index]--;
                luckyService.currentChooser.setChooserBarsOffsets(vm.luckyBinchBarsOffsets);
                console.log(vm.luckyBinchBarsOffsets[index]);
                readBinchStatus();
            }
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

    function findChangedBarIndexes(newVal, oldVal) {
        var rv = [];

        _.forEach(newVal, function (barOffset, i) {
            if (newVal[i] != oldVal[i]) {
                rv.push(i);
            }
        });

        return rv;
    }

    readBinchStatus();


}]);

