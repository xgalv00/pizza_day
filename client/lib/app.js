angular.module('pizzaDayApp', ['angular-meteor', 'ui.router', 'ui.bootstrap', 'ngFileUpload', 'ngImgCrop'])
    .config(['$angularMeteorSettings', function ($angularMeteorSettings) {
        $angularMeteorSettings.suppressWarnings = true; // Disables write of warnings to console
    }])
;