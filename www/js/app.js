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
    'ngStorage'
]).provider('MyAppConfiguration', function () {
  // default values
  var values = {
    username: 'World'
  };
  return {
    set: function (constants) { // 1
      angular.extend(values, constants);
    },
    $get: function () { // 2
      return values;
    }
  };
})


// Enable native scrolls for Android platform only,
// as you see, we're disabling jsScrolling to achieve this.
.config(function ($ionicConfigProvider,ionicTimePickerProvider) {

        //$ionicConfigProvider.views.maxCache(5);

        // note that you can also chain configs
       // $ionicConfigProvider.backButton.text('<<').icon('ion-chevron-left');
  if (ionic.Platform.isAndroid()) {
    //$ionicConfigProvider.scrolling.jsScrolling(false);
  }
  var timePickerObj = {
    inputTime: (((new Date()).getHours() * 60 * 60) + ((new Date()).getMinutes() * 60)),
    format: 24,
    step: 15,
    setLabel: 'Choisir',
    closeLabel: 'Annuler'
  };
  ionicTimePickerProvider.configTimePicker(timePickerObj);
  $ionicConfigProvider.backButton.text('').icon('ion-ios9-arrow-left');

})
/*.factory('Application', function ($window) {

  isInitialRun = function () {
    var value = $window.localStorage["initialRun"] || "true";
    return value == "true";
      return {

        setInitialRun = function (initial) {
        $window.localStorage["initialRun"] = (initial ? "true" : "false");
      }

    };
})*/
.run(function($ionicPlatform, $rootScope, $ionicHistory, $timeout, $ionicConfig, $localStorage, $sessionStorage,$state,$window) {

  function isViewedByBrowser() {
    return (window.cordova || window.PhoneGap || window.phonegap) && /^file:\/{3}[^\/]/i.test(window.location.href) && /ios|iphone|ipod|ipad|android/i.test(navigator.userAgent);
  }
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(false);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }

/*    if ( isViewedByBrowser() ) {
      console.log("Running on Browser!");
    } else {
      console.log("Not running on PhoneGap!");
    }*/

    //ionic.Platform.isFullScreen = true;

  });
/*  var isFirstRun = $window.localStorage["initialRun"] || "true";
  if (isFirstRun){

  }

  $window.localStorage["initialRun"] = (isFirstRun ? "true" : "false");*/

  // This fixes transitions for transparent background views
  $rootScope.$on("$stateChangeStart", function(event, toState, toParams, fromState, fromParams){
    if(toState.name.indexOf('auth.welcome') > -1)
    {
      // set transitions to android to avoid weird visual effect in the walkthrough transitions
      $timeout(function(){
        console.log("setting transition to android and disabling swipe back");

        $ionicConfig.views.transition('android');
        $ionicConfig.views.swipeBackEnabled(false);
        if(ionic.Platform.isIOS())
        {
          //$ionicConfig.views.swipeBackEnabled(true);
          //console.log("enabling swipe back and restoring transition to platform default", $ionicConfig.views.transition());
        }
      }, 0);
    }
  });
  $rootScope.$on("$stateChangeSuccess", function(event, toState, toParams, fromState, fromParams){
    if(toState.name.indexOf('app.booking') > -1)
    {
      // Restore platform default transition. We are just hardcoding android transitions to auth views.
      $ionicConfig.views.transition('platform');
      // If it's ios, then enable swipe back again


    }
  });
  var state = "app.book.home";  // whatever, the main page of your app
 if ($window.localStorage.initialRun==="true"){
   state = "app.profile.home";
   $window.localStorage.initialRun = "false";

 }else
 {
   state = "app.book.select";
 }

  $state.go(state);

/*  if (Application.isInitialRun()) {
    Application.setInitialRun(false);
    state = "app.profile";
  }

  $state.go(state);*/



  $rootScope.$watch(function() {
        $rootScope.storagevalue = Date();
        return angular.toJson($localStorage);

    }, function() {
        //$rootScope.updateContactOnServer();
    });

})

.config(function($stateProvider, $urlRouterProvider) {


  //SIDE MENU ROUTES
  //
  $stateProvider.state('app', {
    url: "/app",
    abstract: true,
    templateUrl: "views/app/side-menu.html",
    controller: 'AppCtrl'
  })


.state('app.profile', {
        abstract: true,
        url: "/profile",
        views: {
          'menuContent': {
            templateUrl: "views/app/profile/profile.html"
          }
          //url: '/profile/:userId',
        }

      })

      .state('app.profile.home', {
        url: '/profile-home',
        views: {
          'profile-home': {
            templateUrl: "views/app/profile/profile-home.html",
            controller: "ProfileCtrl"
          }
        }
      })


      .state('app.book', {
        url: "/book",
        abstract: true,
        views: {
          'menuContent': {
            templateUrl: "views/app/book/book.html"
          }
        }
      })

      .state('app.book.home', {
        url: "/book_home",
        views: {
          'book-home': {
            templateUrl: "views/app/book/book-home.html",
            controller: 'BookCtrl'
          }
        }
      })
      .state('app.book.select', {
        url: "/book_select",
        views: {
          'book-select': {
            templateUrl: "views/app/book/book-select.html",
            controller: 'BookSelectCtrl'
          }
        }
      })
      .state('app.book.provider', {
        url: "/book_provider/:title/:firstname/:lastname/:contact_email/:contact_mobilenb/:contact_web_site_url",
        views: {
          'book-home': {
            templateUrl: "views/app/book/book-provider.html",
            controller: 'BookProviderCtrl'
          }
        }
      })
      .state('app.book.addbooking', {
        url: "/book_addbooking/:title/:firstname/:lastname/:contact_email/:contact_mobilenb/:contact_web_site_url",
        views: {
          'book-home': {
            templateUrl: "views/app/book/addbooking.html",
            controller: 'PickBookingTimeCtrl',
            params: {
              obj: null
            }
          }
        }
      })
      .state('app.bookings', {
        url: "/bookings",
        abstract: true,
        views: {
          'menuContent': {
            templateUrl: "views/app/book/bookings.html"
          }
        }
      })
      .state('app.bookings.home', {
        url: "/bookings-home",
        views: {
          'bookings-home': {
            templateUrl: "views/app/book/bookings-home.html",
            controller: "BookingsController"
           // ,controller: "test"
          }
        }
      })

      .state('app.settings', {
        url: "/settings",
        abstract: true,
        views: {
          'menuContent': {
            templateUrl: "views/app/settings/settings.html"
          }
        }
      })
      .state('app.settings.home', {
        url: "/settings-home",
        views: {
          'settings-home': {
            templateUrl: "views/app/settings/settings-home.html",
            controller: 'SettingsCtrl'
          }
        }
      })

      .state('app.legal.legal-notice', {
        url: '/legal-notice',
        views: {
          'profile-home': {
            templateUrl: "views/app/legal/legal-notice.html",
            controller: "LegalCtrl"
          }
        }
      })
  
  .state('app.shop', {
    url: "/shop",
    abstract: true,
    views: {
      'menuContent': {
        templateUrl: "views/app/shop/shop.html"
      }
    }
  })

  .state('app.shop.home', {
    url: "/",
    views: {
      'shop-home': {
        templateUrl: "views/app/shop/shop-home.html",
        controller: 'ShopCtrl'
      }
    }
  })

  .state('app.shop.popular', {
    url: "/popular",
    views: {
      'shop-popular': {
        templateUrl: "views/app/shop/shop-popular.html",
        controller: 'ShopCtrl'
      }
    }
  })

  .state('app.shop.sale', {
    url: "/sale",
    views: {
      'shop-sale': {
        templateUrl: "views/app/shop/shop-sale.html",
        controller: 'ShopCtrl'
      }
    }
  })


  .state('app.cart', {
    url: "/cart",
    views: {
      'menuContent': {
        templateUrl: "views/app/shop/cart.html",
        controller: 'ShoppingCartCtrl'
      }
    }
  })

  .state('app.shipping-address', {
    url: "/shipping-address",
    views: {
      'menuContent': {
        templateUrl: "views/app/shop/shipping-address.html",
        controller: "CheckoutCtrl"
      }
    }
  })

  .state('app.checkout', {
    url: "/checkout",
    views: {
      'menuContent': {
        templateUrl: "views/app/shop/checkout.html",
        controller: "CheckoutCtrl"
      }
    }
  })

  .state('app.product-detail', {
    url: "/product/:productId",
    views: {
      'menuContent': {
        templateUrl: "views/app/shop/product-detail.html",
        controller: 'ProductCtrl'
      }
    }
  })


  //AUTH ROUTES
  .state('auth', {
    url: "/auth",
    templateUrl: "views/auth/auth.html",
    controller: "AuthCtrl",
    abstract: true
  })

  .state('auth.welcome', {
    url: '/welcome',
    templateUrl: "views/auth/welcome.html",
    controller: 'WelcomeCtrl',
    resolve: {
      show_hidden_actions: function(){
        return false;
      }
    }
  })

  .state('auth.login', {
    url: '/login',
    templateUrl: "views/auth/login.html",
    controller: 'LogInCtrl'
  })

  .state('auth.signup', {
    url: '/signup',
    templateUrl: "views/auth/signup.html",
    controller: 'SignUpCtrl'
  })

  .state('auth.forgot-password', {
    url: '/forgot-password',
    templateUrl: "views/auth/forgot-password.html",
    controller: 'ForgotPasswordCtrl'
  })
  //$urlRouterProvider.otherwise('/auth/welcome');
  // .state('facebook-sign-in', {
  //   url: "/facebook-sign-in",
  //   templateUrl: "views/auth/facebook-sign-in.html",
  //   controller: 'WelcomeCtrl'
  // })
  //
  // .state('dont-have-facebook', {
  //   url: "/dont-have-facebook",
  //   templateUrl: "views/auth/dont-have-facebook.html",
  //   controller: 'WelcomeCtrl'
  // })
  //
  // .state('create-account', {
  //   url: "/create-account",
  //   templateUrl: "views/auth/create-account.html",
  //   controller: 'CreateAccountCtrl'
  // })
  //
  // .state('welcome-back', {
  //   url: "/welcome-back",
  //   templateUrl: "views/auth/welcome-back.html",
  //   controller: 'WelcomeBackCtrl'
  // })
;

  // if none of the above states are matched, use this as the fallback



    //$urlRouterProvider.otherwise('/profile-home');

  // $urlRouterProvider.otherwise('/app/feed');
})

;
