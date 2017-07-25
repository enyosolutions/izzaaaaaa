angular.module('izza.app.controllers', ['ui.rCalendar'])

.controller('AppCtrl', function($scope, AuthService) {

    //this will represent our logged user
    var user = {
        about: "J'aime quand mes ongles sont parfaitement manucurés.",
        name: "Elisa Rookie",
        picture: "https://s3.amazonaws.com/uifaces/faces/twitter/brynn/128.jpg",
        _id: 0,
        followers: 345,
        following: 58
    };

    //save our logged user on the localStorage
    AuthService.saveUser(user);
    $scope.loggedUser = user;
})


.controller('ProfileCtrl', function($scope, currentProvider, $stateParams, $localStorage, $sessionStorage, $ionicHistory, $state, $ionicScrollDelegate) {

    $localStorage = $localStorage.$default({
        profile: {}
    });
    $scope.$storage = $localStorage.profile;
    console.log($scope.$storage);
    $scope.logOut = function() {
        $scope.myPopup = $state.go('auth.login');
    }
    $scope.gotoLegal = function() {
        $state.go("app.legal.legal-notice");
    };
})

.controller('BookingsController', function($scope, currentProvider, BookingsService, $ionicPopup, $ionicModal, $state, $ionicHistory, $localStorage, $sessionStorage) {

    $scope.profile = $localStorage.profile;
    $scope.isSelected = true;
    //Turns the booking into status:completed
    $scope.switchCompleted = function(param, res_id) {
        $scope.isSelected = param;
        $scope.currentID = res_id;
        console.log(param);
        BookingsService.updateBookingCompleted(res_id, param);

    };

    //Turns the booking into status:canceled

    $scope.cancelBooking = function(res_id) {


        $scope.showAlertReserveOK = function() {
            var alertPopup = $ionicPopup.confirm({
                title: 'Annulation',
                template: 'Attention vous allez annuler votre réservation.'
            });

            alertPopup.then(function(res) {

                if (res) {
                    $scope.currentID = res_id;
                    console.log("cancelling booking id: " + res_id);
                    BookingsService.cancelBooking(res_id).then(function(res) {


                        console.log("returns: " + res);
                        $scope.doRefresh();
                    });

                } else {
                    var errorPrompt = $ionicPopup.alert({
                        title: 'Annulation',
                        template: 'La réservation na pas pu être annulée.'
                    });

                    errorPrompt.then(function(res) {


                        console.log("cancelling booking id: " + res_id);
                    });

                }

            });
        };

        $scope.showAlertReserveOK();

    };


    $scope.doRefresh = function() {

        console.log("Refreshing reservations.");
        //getReservations
        if ($scope.profile) {
            if ($scope.profile.profile.email) {
                if ($scope.profile.profile.email !== "") {
                    profileok = true;
                    var bs = BookingsService;
                    var key = $scope.profile.profile.email;
                    //var key = "izza@invicti.eu";
                    bs.getReservations(key).then(function(reservations) {
                        $scope.reservations = reservations;
                        $scope.resToJSON = JSON.stringify(reservations);
                        console.log("got reservations from api server.");

                        $scope.$broadcast('scroll.refreshComplete');

                    });

                }
            } else {
                console.log("could not get reservations from api server: no email in profile.");
            }
        }
    };


//    $scope.doRefresh();

    /*
    PLACEHOLDER VALUE FOR RESERVATIONS (FRONT END DEV AND TESTING ONLY)
    */

    $scope.reservations = [];

    $scope.reservations[0] = {
        "providerInfo": {
            "firstname": "Isabelle",
            "lastname": "Bono",
        },
        "reservationInfo": {
            "res_id": "1234567789091yeee",
            "status": "Confirmé",
            "date": "2017-06-17",
            "reservationFrom": "10:30",
            "reservationTo": "11:00",
        },
        "serviceInfo": [{
            "description": "coiffure",
            "cur": "eur",
            "price": "30"
        }, {
            "description": "chignon",
            "cur": "eur",
            "price": "20"
        }]
    };

})

.controller('BookCtrl', function($scope, $http, currentProvider, $state, BookingsService, RemoteDirectory, $ionicModal, $ionicPopup, lodash, $filter, $ionicScrollDelegate, $localStorage) {

    $scope.groups = [];
//
//    $scope.groups[0] = {
//        name: 'Coiffure',
//        img: 'img/services/coiffure.jpg',
//        items: ['Brushing', 'Chignon', 'Coupe', 'Décoloration/Coloration', 'Défrisage', 'Lissage brésilien']
//    };
//
//    $scope.groups[1] = {
//        name: 'Onglerie',
//        img: 'img/services/onglerie.jpg',
//        items: ['Pose de vernis simple (Mains)', 'Pose vernis semi permanent (Mains)', 'Pose gel avec capsule (Mains)', 'Extension au gel/chablon (Mains)', 'Nail art (Mains)',
//            'Pose de vernis simple (Pieds)', 'Pose vernis semi permanent (Pieds)', 'Pose gel avec capsule (Pieds)', 'Extension au gel/chablon  (Pieds)', 'Nail art  (Pieds)'
//        ]
//    };
//
//    $scope.groups[2] = {
//        name: 'Maquillage',
//        img: 'img/services/maquillage.jpg',
//        items: ['Maquillage jour', 'Maquillage soir']
//    };
//
//    var url = RemoteDirectory.getAPISrvURL() + '/api/categories';
//    console.log(url);
//    $http.get(url).
//    then(function(response) {
//            $scope.groups = response.data;
//    });
    
    
    BookingsService.getCategories().then(function(response) {
        $scope.groups = response.data;
    })
    $scope.openGroup = function(group) {
        $scope.myPopup = $state.go('app.book.category', { groupInfo: group });
    }

    var myPopup;
    $scope.showFiltersPopup = function() {
        $scope.filter = {};
        myPopup = $ionicPopup.show({
            cssClass: 'filter-popup',
            templateUrl: 'views/app/book/partials/filters_popup.html',
            scope: $scope,
        });
        myPopup.then(function(res) {
            if (res) {
                console.log('Filters applied', res);
                myPopup.close();
            } else {
                console.log('Popup closed');
                myPopup.close();
            }
        });
    };
    $scope.closePopup = function() {
        myPopup.close();
    }
    $scope.applyFilter = function() {
        myPopup.close();
    }
})

.controller('SubCategoryCtrl', function($scope, currentProvider, $state, BookingsService, $ionicModal, $ionicPopup, lodash, $filter, $stateParams, $ionicScrollDelegate, $localStorage) {
    $scope.group = $stateParams.groupInfo;
    $scope.subgroups = $scope.group.subcategories;

//    $scope.subgroups[0] = {
//        name: 'Coupe',
//        img: 'img/subgroups/coupe.jpg'
//    };
//    $scope.subgroups[1] = {
//        name: 'Tresses',
//        img: 'img/subgroups/tresses.jpg'
//    };
//    $scope.subgroups[2] = {
//        name: 'Brushing',
//        img: 'img/subgroups/brushing.jpg'
//    };
    $scope.toggleGroup = function(group) {
        if ($scope.isGroupShown(group)) {
            $scope.shownGroup = null;
        } else {
            $scope.shownGroup = group;
        }
    };
    $scope.isGroupShown = function(group) {
        return $scope.shownGroup === group;
    };
    
    $scope.openSubgroup = function(service) {
        $state.go('app.book.providers_list', { serviceInfo: service });
    }
//    
//    var myPopup;
//    $scope.showFiltersPopup = function() {
//        $scope.filter = {};
//        myPopup = $ionicPopup.show({
//            cssClass: 'filter-popup',
//            templateUrl: 'views/app/book/partials/filters_popup.html',
//            scope: $scope,
//        });
//        myPopup.then(function(res) {
//            if (res) {
//                console.log('Filters applied', res);
//                myPopup.close();
//            } else {
//                console.log('Popup closed');
//                myPopup.close();
//            }
//        });
//    };
//    $scope.closePopup = function() {
//        myPopup.close();
//    }
//    $scope.applyFilter = function() {
//        myPopup.close();
//    }
})

.controller('ProvidersCtrl', function($scope, currentProvider, $state, $stateParams, BookingsService, $ionicModal, $ionicPopup, lodash, $filter, $ionicScrollDelegate, $localStorage) {
  
    $scope.subcategory = $stateParams.subgroupInfo;
    $scope.reservation = {
        service: "596c3201380d8c716c5d7d53",
        customer: "596c9836380d8c716c5d7d6d",
        date: Date(),
        hour: "",
        status: "In Progress",
        address: "",
        note: "",
        token: $localStorage.token
    };
  console.log($scope.reservation);
  BookingsService.getAllProviders().then(function(response) {
        $scope.providers = response.data;
    })

    $scope.bookPerService = function(provider) {
        console.log(provider);
        $state.go('app.book.provider', { providerInfo: provider, reservationInfo: $scope.reservation});
    };
})

.controller('BookProviderCtrl', function($scope, currentProvider, BookingsService, $ionicPopup, $state, ionicDatePicker, $stateParams, $localStorage) {

    $scope.provider = $stateParams.providerInfo;
    $scope.reservation = $stateParams.reservationInfo;
//    $scope.reservation.provider = $scope.provider.firstname + " " + $scope.provider.lastname;
    console.log($scope.reservation);
    $scope.continuetoDate = function(provider) {
        $state.go('app.book.addbooking', { providerInfo: provider, reservationInfo: $scope.reservation });
    };
})

.controller("PickBookingTimeCtrl", function($scope, currentProvider, $filter, $stateParams, ionicDatePicker, ionicTimePicker, $location, $state, BookingsService, $ionicModal, $localStorage, $sessionStorage, $ionicPopup, $ionicHistory, $localStorage) {

    $scope.params = $stateParams;
    $scope.reservation = $stateParams.reservationInfo;
  
    var caldate = new Date();
    $scope.showdate = $filter('date')(caldate, 'dd/MM/yyyy');
    $scope.showmonth = $filter('date')(caldate, 'MMMM, yyyy');
    $scope.showday = $filter('date')(caldate, ' EEEE, d');
    //        $scope.showday = "";
    //        $scope.showmonth = "Choisir la date";

    $scope.pickedServices = $scope.provider;

    //range function for the timepicker
    $scope.range = function(min, max, step) {
        step = step || 1;
        var input = [];
        for (var i = min; i <= max; i += step) {
            input.push(i);
        }
        return input;
    };
    $scope.ipObjDatePicker = {
        callback: function(val) { //Mandatory
            var caldate = new Date(val);
            console.log('Return value from the datepicker popup is : ' + caldate);
            $scope.reservation.date = caldate;
            console.log($scope.reservation);
            $scope.showdate = $filter('date')(caldate, 'dd/MM/yyyy');
            $scope.showmonth = $filter('date')(caldate, 'MMMM, yyyy');
            $scope.showday = $filter('date')(caldate, ' EEEE, d');
        },
        //from: new Date(2012, 1, 1), //Optional
        //to: new Date(2016, 10, 30), //Optional
        inputDate: new Date(), //Optional
        mondayFirst: true, //Optional
        disableWeekdays: [0], //Optional
        closeOnSelect: true, //Optional
        templateType: 'modal', //Optional
        closeLabel: 'Choisir',
        titleLabel: 'Choisissez une date',
        weeksList: ["D", "L", "M", "M", "J", "V", "S"],
        monthsList: ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Aout", "Septembre", "Octobre", "Novembre", "Décembre"],
    };

    $scope.openDatePicker = function() {
        ionicDatePicker.openDatePicker($scope.ipObjDatePicker);
    };

    $scope.profile = $localStorage.profile;

    $scope.selectTimeRange = function(from, to) {

        $scope.reservation.hour = from + 'h' + '00';
        $scope.reservation.betweenTo = to + 'h' + '00';

    }

    $filter('date')(Date(), 'dd/MM/yyyy');
    $scope.provider = $stateParams.providerInfo;

    $scope.confirmBooking = function(provider) {
        $state.go('app.book.address', { providerInfo: provider, reservationInfo: $scope.reservation });
    };
})

.controller('BookAddressCtrl', function($scope, currentProvider, BookingsService, $ionicPopup, $state, ionicDatePicker, $stateParams, $localStorage) {

    $scope.provider = $stateParams.providerInfo;
    $scope.reservation = $stateParams.reservationInfo;
    

    $scope.confirmBooking = function(provider) {
        $state.go('app.book.recap', { providerInfo: provider, reservationInfo: $scope.reservation });
    };
})

.controller('BookRecapCtrl', function($scope, currentProvider, BookingsService, $ionicPopup, $state, ionicDatePicker, $stateParams, $localStorage, $ionicModal) {

    $scope.provider = $stateParams.providerInfo;
    $scope.reservation = $stateParams.reservationInfo;
    $scope.reservation_send = {
        service: $scope.reservation.service,
        date: $scope.reservation.date,
        hour: $scope.reservation.hour,
    };
    console.log("Appointment successfully");
    console.log($scope.reservation);
    
    $ionicModal.fromTemplateUrl('views/app/book/partials/cards-list.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.cards_list_modal = modal;
    });

    $scope.showCards = function() {
        $scope.cards_list_modal.show();
    };  
    
/////// STRIPE RESPONSE HANDLER ////// 
    var stripeResponseHandler = function(status, response) {
            $ionicLoading.hide();
            $scope.isCreditCardUpdating = false;
            // Grab the form:
            if (response.error) { // Problem!
                // Show the errors on the form:
                //$form.find('.payment-errors').text(response.error.message);
                //$form.find('.submit').prop('disabled', false); // Re-enable submission
                var key;
                if (response.error.type) {
                    key = 'STRIPE_' + response.error.type;
                }
                if (response.error.code) {
                    key = response.error.code ? ('STRIPE_' + response.error.code +
                        (response.error.decline_code ? '_' + response.error.decline_code : '')) : response.error.code;
                }

                $scope.paymentFormNotif = $translate(key);
                $ionicPopup.alert({
                    title: "Erreur",
                    template: $scope.paymentFormNotif,
                    okType: 'button-energized',
                    "okText": 'Ok',
                    "cancelText": 'Annuler'
                });
            } else { // Token was created!

                // Get the token ID:
                var token = response.id;

                // Insert the token ID into the form so it gets submitted to the server:
                $scope.paymentToken = token;

                $scope.reservation = {};
                $scope.reservation.status = "pending";
                $scope.reservation.userId = $rootScope.user._id;
                $scope.reservation.userEmail = $rootScope.user.email;
                $scope.reservation.token = token;

                $scope.paymentFormNotif = "";
                $ionicLoading.show({
                    template: '<ion-spinner icon="dots"></ion-spinner>',
                    duration: 10000,
                    hideOnStateChange: true
                });
                var card = new UserCardService({
                    token: token,
                    userId: $rootScope.user._id,
                    email: $rootScope.user.email,
                    currency: 'eur'
                });
                card.$save().then(function(res) {
                        $scope.creditCardModal.hide();
                        $ionicLoading.hide();
                        UserService.Refresh();
                        $scope.userCards = UserCardService.query({
                            userId: $rootScope.user._id + ""
                        });
                    },
                    function(err) {
                        $ionicLoading.hide();
                        var key;
                        if (err && err.data && err.data.error && err.data.error.code) {
                            key = 'STRIPE_' + err.data.error.code;
                        } else {
                            key = 'error_card_adding_failed';
                        }
                        $ionicPopup.alert({
                            title: "Erreur",
                            template: $translate(err.code || "error_card_adding_failed"),
                            okType: 'button-energized',
                            "okText": 'Ok',
                            "cancelText": 'Annuler'
                        });

                        $scope.creditCardModal.hide();
                    }
                );
            }
        };
///////       END         ////// 
    $scope.confirmBooking = function(provider) {
        BookingsService.createReservation($scope.reservation_send);
        //$state.go('app.book.home');
        //Stripe.card.createToken(document.getElementById("payment-form"), stripeResponseHandler);
        
    };
})

.controller('LegalCtrl', function($scope, $ionicModal) {
    //$ionicConfigProvider.backButton.previousTitleText() = false;
    $ionicModal.fromTemplateUrl('views/app/legal/terms-of-service.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.terms_of_service_modal = modal;
    });

    $ionicModal.fromTemplateUrl('views/app/legal/privacy-policy.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.privacy_policy_modal = modal;
    });

    $scope.showTerms = function() {
        $scope.terms_of_service_modal.show();
    };

    $scope.showPrivacyPolicy = function() {
        $scope.privacy_policy_modal.show();
    };
})
