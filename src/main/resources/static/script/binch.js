/**
 * binch.js: Big Number Layered Chooser
 */
(function (binch, $, undefined) {
    //Private Property
    var isHot = true;

    //Public Property
    binch.ingredient = "Bacon Strips";

    //Public Method
    binch.fry = function () {
        var oliveOil;

        addItem("\t\n Butter \n\t");
        addItem(oliveOil);
        console.log("Frying " + binch.ingredient);
    };

    //Private Method
    function addItem(item) {
        if (item !== undefined) {
            console.log("Adding " + $.trim(item));
        }
    }
}(window.binch = window.binch || {}, jQuery));

console.info("binch.js: " + binch.ingredient);