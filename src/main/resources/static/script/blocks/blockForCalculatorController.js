/**
 *
 */
app.controller('blockForCalculatorController', ['$scope', '$window', '$timeout', 'luckyConstants', function ($scope, $window, $timeout, luckyConstants) {

    var vm = this;
    vm.input_1;
    vm.input_2;

    vm.Calk_memory_1 = bigInt();
    vm.Calk_memory_2 = bigInt();

    vm.Znak_memory = null;

    $scope.$watch(function () {
        return vm.input_2
    }, function (newVal, oldVal) {
        vm.Calk_memory_2 = bigInt(vm.input_2);
    });


    vm.getElement = function () {         // узнать/запомнить/возвратить значение записанного поля
        return vm.input_1;
    };
    vm.pastElement = function (pastElem) {//вставить значение в поле
        vm.Push({valInput_1: vm.input_1, valInput_2: vm.input_2, valZnak_memory: vm.Znak_memory});
        vm.input_1 = pastElem;
        vm.currentHistoryIndex = -1;

        $scope.$emit(luckyConstants.TRY_KEYS_SEQUENCE_EVT, {keysArrayToTry: [pastElem]});

    };

    vm.add = function () {

        vm.DelStackAfter();
        vm.Calk_memory_1 = bigInt(vm.getElement());
        vm.Znak_memory = '+';
        vm.pastElement((vm.Calk_memory_1).add(vm.Calk_memory_2));  //вводим в экран значение вычислений
        this.Calk_memory_1 = (vm.Calk_memory_1).add(vm.Calk_memory_2); //сохраняем результат вычислений..
        //debugger;


    };
    vm.subtraction = function () {
        vm.Calk_memory_1 = bigInt(vm.getElement());
        if (parseInt(vm.Calk_memory_1) > parseInt(vm.Calk_memory_2)) {
            vm.DelStackAfter();
            vm.Znak_memory = '-';
            this.pastElement((vm.Calk_memory_1).minus(vm.Calk_memory_2));
            this.Calk_memory_1 = (vm.Calk_memory_1).minus(vm.Calk_memory_2);
        }
    };
    vm.division = function () {
        var a = (parseFloat(vm.Calk_memory_1) / parseFloat(vm.Calk_memory_2));
        if (a >= 1) {
            vm.DelStackAfter();
            vm.Calk_memory_1 = bigInt(vm.getElement());
            vm.Znak_memory = '/';
            this.pastElement((vm.Calk_memory_1).divide(vm.Calk_memory_2));
            this.Calk_memory_1 = (vm.Calk_memory_1).divide(vm.Calk_memory_2);
        }

    };
    vm.multiplication = function () {
        vm.DelStackAfter();
        vm.Calk_memory_1 = bigInt(vm.getElement());
        vm.Znak_memory = '*';
        this.pastElement((vm.Calk_memory_1).multiply(vm.Calk_memory_2));
        this.Calk_memory_1 = (vm.Calk_memory_1).multiply(vm.Calk_memory_2);
    };
    vm.zeroing = function () {
        vm.DelStackAfter();
        vm.input_1 = null;
        vm.input_2 = null;
        vm.Calk_memory_1 = '';
        vm.Znak_memory = null;
    };

    vm.currentHistoryIndex = -1;

    $scope.$watch(function () {
        return vm.currentHistoryIndex;
    }, function (newVal, oldVal) {

        if (newVal === -1) {
            return;
        }

        vm.input_1 = vm.Stack[newVal].valInput_1;
        vm.input_2 = vm.Stack[newVal].valInput_2;
        vm.Znak_memory = vm.Stack[newVal].valZnak_memory;
    });

    // Undo
    vm.navigateHistoryForward = function () {
        if (vm.Stack.length - 1 > vm.currentHistoryIndex) {
            vm.currentHistoryIndex++;
        }
    };

    // Redo
    vm.navigateHistoryBack = function () {
        if (vm.currentHistoryIndex === -1) {
            vm.currentHistoryIndex = vm.Stack.length - 1;
        }
        if (0 < vm.currentHistoryIndex) {
            vm.currentHistoryIndex--;
        }
    };

    vm.DelStackAfter = function () {
        vm.Stack.splice(vm.currentHistoryIndex, vm.Stack.length - vm.currentHistoryIndex);
    };

    vm.Stack = [];

}]);

