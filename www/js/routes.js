angular.module('izza').config(function($stateProvider, $urlRouterProvider) {


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

    .state('app.book.category', {
        url: "/category/{groupInfo:json}",
        views: {
            'book-home': {
                templateUrl: "views/app/book/categories.html",
                controller: 'SubCategoryCtrl',
                params: {
                    providerInfo: null
                }
            }
        }
    })

    .state('app.book.providers_list', {
        url: "/providers/{subgroupInfo:json}",
        views: {
            'book-home': {
                templateUrl: "views/app/book/providers.html",
                controller: 'ProvidersCtrl',
                params: {
                    providerInfo: null
                }
            }
        }
    })

    .state('app.book.provider', {
        url: "/book_provider/{providerInfo:json}",
        views: {
            'book-home': {
                templateUrl: "views/app/book/book-provider.html",
                controller: 'BookProviderCtrl',
                params: {
                    providerInfo: null
                }
            }
        }
    })

    .state('app.book.addbooking', {
        url: "/book_addbooking/{providerInfo:json}",
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

    .state('app.book.address', {
        url: "/book_address/{providerInfo:json}",
        views: {
            'book-home': {
                templateUrl: "views/app/book/book_address.html",
                controller: 'BookAddressCtrl',
                params: {
                    obj: null
                }
            }
        }
    })

    .state('app.book.recap', {
        url: "/book_recap/:title/:firstname/:lastname/:contact_email/:contact_mobilenb/:contact_web_site_url",
        views: {
            'book-home': {
                templateUrl: "views/app/book/book_recap.html",
                controller: 'BookRecapCtrl',
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
                templateUrl: "views/app/bookings/bookings.html"
            }
        }
    })

    .state('app.bookings.home', {
        url: "/bookings-home",
        views: {
            'bookings-home': {
                templateUrl: "views/app/bookings/bookings-home.html",
                controller: "BookingsController"
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

    /////////AUTH ROUTES//////////
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
            show_hidden_actions: function() {
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

    .state('auth.signup_info', {
        url: '/signup_info',
        templateUrl: "views/auth/signup_info.html",
        controller: 'SignUpInfoCtrl'
    })

    .state('auth.forgot-password', {
        url: '/forgot-password',
        templateUrl: "views/auth/forgot-password.html",
        controller: 'ForgotPasswordCtrl'
    })

    // if none of the above states are matched, use this as the fallback

});
