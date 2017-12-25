/**
 *
 */

app.controller('luckyController', ['$scope', 'luckyService', 'luckyFactory', '$interval', '$http', '$translate', 'addressAnalyticsService', '$window', 'keyGenerationService', '$timeout', function ($scope, luckyService, luckyFactory, $interval, $http, $translate, addressAnalyticsService, $window, keyGenerationService, $timeout) {

    var vm = this;
    $scope.numberOfKeys;

    vm.luckyCtrlPma = {
        luckyTotalGeneratedKeys: 0,
        luckyBatchGenerationInterval: null
    };

    vm.luckyCtrlDerivedKeys = {
        luckyKeyPublicAddress: null,
        luckyKeyPublicAddressBalance: 0,
        luckyKeyPrivateKeyAsWIF: null,
        luckyKeyWasFound: false
    };

    vm.luckyBarsSameOffset = 0;
    vm.luckyBinchBarsOffsets = [];
    vm.luckyBarSumValue = "";

    vm.checkSelectedBars = new Array(luckyService.currentChooser.binchBars.length);
    vm.checkSelectedBars.fill(true);
    $scope.selectedKnownKey = null;

    $scope.isAllBarsToggled = true;
    vm.onAllBarsToggled = function (isAllBarsToggled) {
        vm.checkSelectedBars.fill(isAllBarsToggled);
    };

    $scope.$watch(function () {
        return vm.luckyBarsSameOffset;
    }, function (newVal, oldVal) {

        if (newVal < 0) {
            vm.luckyBarsSameOffset = 0;
        } else if (newVal > 1000) {
            vm.luckyBarsSameOffset = 1000;
        } else if (newVal) {
            _.forEach(vm.luckyBinchBarsOffsets, function (barOffset, i) {
                if (vm.checkSelectedBars[i]) {
                    vm.luckyBinchBarsOffsets[i] = parseInt(newVal);
                }
            })
        }
    });

    $scope.getkeySluckyBarsSameOffset = function (event) {

        var oldValue = parseInt(vm.luckyBarsSameOffset) || 0;

        if (event.keyCode == 38) {
            vm.luckyBarsSameOffset = oldValue + 1;
        } else if (event.keyCode == 40) {
            vm.luckyBarsSameOffset = oldValue - 1;
        }
    };

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

        /*if ("115792089237316195423570985008687907852837564279074904382605163141518161494337" === newVal) {
            //$timeout(function () {
            //vm.luckyBarSumValue = "0";
            generateRandomOffsets();
            return;
            //}, 100);
        } else if ("0" === newVal) {
            //$timeout(function () {
            generateRandomOffsets();
            return;
            //}, 100);
        }*/

        if (vm.luckyBarSumValue !== luckyService.currentChooser.chosenValue.toString(10)) {
            luckyService.currentChooser.setProvidedChosenStringValue(vm.luckyBarSumValue);
            readBinchStatus();
            //return;
        }

        vm.luckyCtrlPma.luckyTotalGeneratedKeys++;

        addressAnalyticsService.resolveBitcoinAddressByKey(vm.luckyBarSumValue).then(function (AddressesResultDto) {
            vm.luckyCtrlDerivedKeys.luckyKeyPublicAddress = AddressesResultDto['publicAddressAsHex'];
            vm.luckyCtrlDerivedKeys.luckyKeyPrivateKeyAsWIF = AddressesResultDto['privateKeyAsWIF'];

            addressAnalyticsService.checkKeyInBlockChain(newVal).then(function (CheckKeyResultDto) {
                vm.luckyCtrlDerivedKeys.luckyKeyWasFound = ( _.includes(CheckKeyResultDto['checkedKeysMatched'], newVal) && CheckKeyResultDto['checkedKeyFound']);

                if (vm.luckyCtrlDerivedKeys.luckyKeyWasFound) {
                    addressAnalyticsService.getAddressBalance(vm.luckyCtrlDerivedKeys.luckyKeyPublicAddress).then(function (balance) {
                        vm.luckyCtrlDerivedKeys.luckyKeyPublicAddressBalance = balance / 100000000;
                        console.info("Balance: of " + vm.luckyCtrlDerivedKeys.luckyKeyPublicAddress + " is " + balance);
                    });
                }

            }, function (errors) {
                console.error(errors);
            });
        });
    });

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
            }, 50);
        }
    };

    //
    //
    //

    function generateRandomOffsets() {
        keyGenerationService.generateRandomBarOffsets(luckyService.currentChooser, vm.checkSelectedBars);
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

