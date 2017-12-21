app.config(['$translateProvider',function($translateProvider){

    var en_translations = {
        "Key" : "Key",
        "totCheck" : "Total checked",
        "Address" : "Address",
        "Start" : "Start",
        "Stop" : "Stop",
        "Parse": "Parse",
        "Min" : "Min",
        "Max" : "Max",
        "Random" : "Random"
    };

    var ua_translations = {
        "Key" : "Ключ",
        "totCheck" : "Усього зареєстровано",
        "Address" : "Address",
        "Start" : "Старт",
        "Stop" : "Стоп",
        "Parse": "Вставить",
        "Min" : "Мінімальний",
        "Max" : "Максимальний",
        "Random" : "Рандом"
    };

    $translateProvider.translations('en',en_translations);

    $translateProvider.translations('ua',ua_translations);

    $translateProvider.preferredLanguage('en');

}]);