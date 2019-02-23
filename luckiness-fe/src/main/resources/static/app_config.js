/**
 *
 */
app.config(['$translateProvider', function ($translateProvider) {

    $translateProvider.useStaticFilesLoader({
        prefix: 'resources_',
        suffix: '.json'
    });

    //$translateProvider.translations('en',en_translations);

    //$translateProvider.translations('ua',ua_translations);

    $translateProvider.preferredLanguage('en');

}]);

/**
 *
 */
app.config(['ChartJsProvider', function (ChartJsProvider) {
    // Configure all charts
    ChartJsProvider.setOptions({
        chartColors: ['#FF5252', '#FF8A80'],
        responsive: false
    });
    // Configure all line charts
    ChartJsProvider.setOptions('line', {
        showLines: false
    });
}]);