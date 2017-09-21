angular.module('underscore', [])
    .factory('_', function() {
        return window._; // assumes underscore has already been loaded on the page
    });

angular.module('izza', [
    'ionic',
    'izza.common.directives',
    'izza.app.controllers',
    'izza.auth.controllers',
    'izza.app.services',
    //'izza.views',
    'underscore',
    'ngLodash',
    'angularMoment',
    'ngIOS9UIWebViewPatch',
    'ionic-datepicker',
    'ionic-timepicker',
    'ngStorage',
    'ngCordova'
]).provider('MyAppConfiguration', function() {
    // default values
    var values = {
        username: 'World'
    };
    return {
        set: function(constants) { // 1
            angular.extend(values, constants);
        },
        $get: function() { // 2
            return values;
        }
    };
})


// Enable native scrolls for Android platform only,
// as you see, we're disabling jsScrolling to achieve this.
.config(function($ionicConfigProvider, ionicTimePickerProvider) {
    if (ionic.Platform.isAndroid()) {}
    var timePickerObj = {
        inputTime: (((new Date()).getHours() * 60 * 60) + ((new Date()).getMinutes() * 60)),
        format: 24,
        step: 15,
        setLabel: 'Choisir',
        closeLabel: 'Annuler'
    };
    ionicTimePickerProvider.configTimePicker(timePickerObj);
    $ionicConfigProvider.backButton.text('').icon('ion-ios9-arrow-left');
    $ionicConfigProvider.backButton.previousTitleText(false);
})

.run(function($ionicPlatform, $rootScope, $ionicHistory, $timeout, $ionicConfig, $localStorage, $sessionStorage, $state, $window) {

    function isViewedByBrowser() {
        return (window.cordova || window.PhoneGap || window.phonegap) && /^file:\/{3}[^\/]/i.test(window.location.href) && /ios|iphone|ipod|ipad|android/i.test(navigator.userAgent);
    }
    $ionicPlatform.ready(function() {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(false);
            cordova.plugins.Keyboard.disableScroll(false);
        }
        if (window.StatusBar) {
            StatusBar.styleDefault();
        }


    });

    // This fixes transitions for transparent background views
    $rootScope.$on("$stateChangeStart", function(event, toState, toParams, fromState, fromParams) {
        if (toState.name.indexOf('auth.welcome') > -1) {
            // set transitions to android to avoid weird visual effect in the walkthrough transitions
            $timeout(function() {
                console.log("setting transition to android and disabling swipe back");

                $ionicConfig.views.transition('android');
                $ionicConfig.views.swipeBackEnabled(false);
                if (ionic.Platform.isIOS()) {
                    //$ionicConfig.views.swipeBackEnabled(true);
                    //console.log("enabling swipe back and restoring transition to platform default", $ionicConfig.views.transition());
                }
            }, 0);
        }
    });


    $rootScope.$on("$stateChangeSuccess", function(event, toState, toParams, fromState, fromParams) {
        if (toState.name.indexOf('app.booking') > -1) {
            // Restore platform default transition. We are just hardcoding android transitions to auth views.
            $ionicConfig.views.transition('platform');
            // If it's ios, then enable swipe back again
        }

        if(!$localStorage.token && toState.name &&
         ["", "auth.login", "auth.signup", "auth.signup_info", "auth.forgot-password"].indexOf(toState.name) === -1 ) {
            console.log("not logged in redirecting");
            $state.go('auth.login');
            return;
        }

    });
    var state = "app.book.home"; // whatever, the main page of your app
    if ($window.localStorage.initialRun === "true") {
        state = "app.profile.home";
        $window.localStorage.initialRun = "false";

    } else {
        state = "app.book.home";
       // state = "auth.login";
    }

    $state.go(state);

    // $rootScope.$watch(function() {
    //     $rootScope.storagevalue = Date();
    //     return angular.toJson($localStorage);

    // }, function() {
    //     //$rootScope.updateContactOnServer();
    // });

});
