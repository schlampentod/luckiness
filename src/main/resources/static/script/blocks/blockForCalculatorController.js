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
        vm.input_1 = pastElem;
        $scope.$emit(luckyConstants.TRY_KEYS_SEQUENCE_EVT, {keysArrayToTry: [pastElem]});
        //vm.input_2=0;
    };

    vm.add = function () {
        vm.Calk_memory_1 = bigInt(vm.getElement());
        vm.Znak_memory = '+';
        vm.pastElement((vm.Calk_memory_1).add(vm.Calk_memory_2));  //вводим в экран значение вычислений
        this.Calk_memory_1 = (vm.Calk_memory_1).add(vm.Calk_memory_2); //сохраняем результат вычислений..

    };
    vm.subtraction = function () {

        vm.Calk_memory_1 = bigInt(vm.getElement());
        if (parseInt(vm.Calk_memory_1) > parseInt(vm.Calk_memory_2)) {
            vm.Znak_memory = '-';
            this.pastElement((vm.Calk_memory_1).minus(vm.Calk_memory_2));
            this.Calk_memory_1 = (vm.Calk_memory_1).minus(vm.Calk_memory_2);
        }
    };
    vm.division = function () {
        var a = (parseFloat(vm.Calk_memory_1) / parseFloat(vm.Calk_memory_2));
        if (a >= 1) {
            vm.Calk_memory_1 = bigInt(vm.getElement());
            vm.Znak_memory = '/';
            this.pastElement((vm.Calk_memory_1).divide(vm.Calk_memory_2));
            this.Calk_memory_1 = (vm.Calk_memory_1).divide(vm.Calk_memory_2);
        }

    };
    vm.multiplication = function () {
        vm.Calk_memory_1 = bigInt(vm.getElement());
        vm.Znak_memory = '*';
        this.pastElement((vm.Calk_memory_1).multiply(vm.Calk_memory_2));
        this.Calk_memory_1 = (vm.Calk_memory_1).multiply(vm.Calk_memory_2);
    };
    vm.zeroing = function () {
        vm.input_1 = null;
        vm.input_2 = null;
        vm.Calk_memory_1 = '';
        vm.Znak_memory = null;
    };

}]);

