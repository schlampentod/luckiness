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



    vm.GoStack = function (arg) {
        debugger;
        if(arg=="<-"){
            if(vm.Pozition <=vm.Stack.length){
                var fuckinSheetVariable=vm.Pozition-1;
                vm.Pozition=vm.Pozition-1;

                //fuckinSheetVariable=fuckinSheetVariable-2;

                vm.input_1 = vm.Stack[fuckinSheetVariable].valInput_1;
                vm.input_2 = vm.Stack[fuckinSheetVariable].valInput_2;
                vm.Znak_memory = vm.Stack[fuckinSheetVariable].valZnak_memory;
                debugger;
            }

        }
        else if(arg=="->"){
            if(vm.Pozition < vm.Stack.length){
                vm.Pozition++;
                //alert(Stack[Pozition]);
                vm.input_1 = vm.Stack[vm.Pozition].valInput_1;
                vm.input_2 = vm.Stack[vm.Pozition].valInput_2;
                vm.Znak_memory = vm.Stack[vm.Pozition].valZnak_memory;
            }

        };
    };
    vm.DelStackAfter = function () {
        debugger;
        vm.Stack.splice(vm.Pozition, vm.Stack.length-vm.Pozition);
    };

    vm.Stack =[];
    vm.Pozition = vm.Stack.length;


    $scope.$watch(function () {
        return vm.Stack.length;
    }, function (newVal, oldVal) {
        vm.Pozition = vm.Stack.length;
    });

    vm.Push = function(data) {
        //debugger;
        vm.Stack[vm.Stack.length]=data;
        // увеличение размера хранилища
    };



}]);

