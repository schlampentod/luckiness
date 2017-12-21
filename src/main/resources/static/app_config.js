app.config(['$translateProvider',function($translateProvider){

    $translateProvider.useStaticFilesLoader({
        prefix: 'resources_',
        suffix: '.json'
    });

    //$translateProvider.translations('en',en_translations);

    //$translateProvider.translations('ua',ua_translations);

    $translateProvider.preferredLanguage('en');

}]);

