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
            "reservation_date": "2017-06-17",
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

.controller('BookCtrl', function($scope, $http, currentProvider, $state, BookingsService, RemoteDirectory, $ionicModal, $ionicPopup, lodash, $filter, $ionicScrollDelegate) {

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

.controller('SubCategoryCtrl', function($scope, currentProvider, $state, BookingsService, $ionicModal, $ionicPopup, lodash, $filter, $stateParams, $ionicScrollDelegate) {
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

    $scope.openSubgroup = function(subgroup) {
        $state.go('app.book.providers_list', { subgroupInfo: subgroup });
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

.controller("PickBookingTimeCtrl", function($scope, currentProvider, $filter, $stateParams, ionicDatePicker, ionicTimePicker, $location, $state, BookingsService, $ionicModal, $localStorage, $sessionStorage, $ionicPopup, $ionicHistory) {

    $scope.params = $stateParams;

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

    $scope.onTimeSelected = function(selectedTime, events, disabled) {
        console.log('Selected time: ' + selectedTime + ', hasEvents: ' + (events !== undefined && events.length !== 0) + ', disabled: ' + disabled);
    };


    $scope.ipObjFromTimePicker = {
        callback: function(val) { //Mandatory
            console.log('Return value from the timepicker popup is : ' + val, new Date(val));

            if (typeof(val) === 'undefined') {
                console.log('Time not selected');
            } else {
                var selectedTimeFrom = new Date(val * 1000);
                $scope.ipObjFromTimePicker.inputEpochTime = val;
                $scope.reservation.betweenFrom = selectedTimeFrom.getUTCHours() + 'h' + (selectedTimeFrom.getUTCMinutes() ? selectedTimeFrom.getUTCMinutes() + 'm' : '');
                $scope.reservation.betweenTo = $scope.reservation.betweenFrom;

                console.log('Selected epoch is : ', val, 'and the time is ', selectedTimeFrom.getUTCHours(), 'H :', selectedTimeFrom.getUTCMinutes(), 'M');
            }
        },
        inputTime: 50400, //Optional
        format: 24, //Optional
        step: 15, //Optional
        setLabel: 'Choisir' //Optional
    };

    $scope.ipObjToTimePicker = {
        callback: function(val) { //Mandatory
            console.log('Return value from the timepicker popup is : ' + val, new Date(val));
            if (typeof(val) === 'undefined') {

                console.log('Time not selected');

            } else {
                var selectedTimeTo = new Date(val * 1000);
                $scope.ipObjToTimePicker.inputEpochTime = val;
                $scope.reservation.betweenTo = selectedTimeTo.getUTCHours() + 'h' + (selectedTimeTo.getUTCMinutes() ? selectedTimeTo.getUTCMinutes() + 'm' : '');
                console.log('Selected epoch is : ', val, 'and the time is ', selectedTimeTo.getUTCHours(), 'H :', selectedTimeTo.getUTCMinutes(), 'M');
                console.log('Selected epoch is : ', val, 'and the time is ', selectedTimeTo.getUTCHours(), 'H :', selectedTimeTo.getUTCMinutes(), 'M');
            }
        },
        inputTime: 50400, //Optional
        format: 24, //Optional
        step: 15, //Optional
        setLabel: 'Choisir' //Optional
    };




    $scope.ipObjDatePicker = {
        callback: function(val) { //Mandatory
            console.log('Return value from the datepicker popup is : ' + val, new Date(val));
            //var options = {weekday: "long", year: "numeric", month: "long", day: "numeric"}; ,options
            var caldate = new Date(val);
            $scope.reservation.reservation_date = caldate;
            //$scope.showdate =    caldate.toLocaleDateString("ar-EG");
            $scope.showdate = $filter('date')(caldate, 'dd/MM/yyyy');
            $scope.showmonth = $filter('date')(caldate, 'MMMM, yyyy');
            $scope.showday = $filter('date')(caldate, ' EEEE, d');


        },
        disabledDates: [ //Optional
            /*        new Date(2016, 2, 16),
             new Date(2015, 3, 16),
             new Date(2015, 4, 16),
             new Date(2015, 5, 16),
             new Date('Wednesday, August 12, 2015'),
             new Date("08-16-2016"),
             new Date(1439676000000)*/
        ],
        //from: new Date(2012, 1, 1), //Optional
        //to: new Date(2016, 10, 30), //Optional
        inputDate: new Date(), //Optional
        mondayFirst: true, //Optional
        disableWeekdays: [0], //Optional
        closeOnSelect: true, //Optional
        templateType: 'modal', //Optional
        closeLabel: 'Choisir',
        titleLabel: 'Choisissez une date',
        monthsList: ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Aout", "Septembre", "Octobre", "Novembre", "Décembre"],
    };

    $scope.openDatePicker = function() {
        ionicDatePicker.openDatePicker($scope.ipObjDatePicker);
    };

    $scope.openFromTimePicker = function() {
        ionicTimePicker.openTimePicker($scope.ipObjFromTimePicker);
    };
    $scope.openToTimePicker = function() {
        ionicTimePicker.openTimePicker($scope.ipObjToTimePicker);
    };

    $scope.profile = $localStorage.profile;


    $scope.selectTimeRange = function(from, to) {

        $scope.reservation.betweenFrom = from + 'h' + '00' + 'm';
        $scope.reservation.betweenTo = to + 'h' + '00' + 'm';
        // $scope.reservation.betweenTo = selectedTimeTo.getUTCHours() +  'h' + (selectedTimeTo.getUTCMinutes()?selectedTimeTo.getUTCMinutes() +  'm':'') ;

    }

    $filter('date')(Date(), 'dd/MM/yyyy');

    //    $scope.reservation = {
    //        reservation_date: Date(),
    //        betweenFrom: "",
    //        betweenTo: "",
    //
    //    };

    $scope.provider = $stateParams.providerInfo;

    $scope.confirmBooking = function(provider) {
        $state.go('app.book.address', { providerInfo: provider });
    };
})

.controller('BookProviderCtrl', function($scope, currentProvider, BookingsService, $ionicPopup, $state, ionicDatePicker, $stateParams) {

    $scope.provider = $stateParams.providerInfo;

    $scope.continuetoDate = function(provider) {
        $state.go('app.book.addbooking', { providerInfo: provider });
    };
})

.controller('BookAddressCtrl', function($scope, currentProvider, BookingsService, $ionicPopup, $state, ionicDatePicker, $stateParams) {

    $scope.provider = $stateParams.providerInfo;

    $scope.confirmBooking = function(provider) {
        $state.go('app.book.recap', { providerInfo: provider });
    };
})

.controller('BookRecapCtrl', function($scope, currentProvider, BookingsService, $ionicPopup, $state, ionicDatePicker, $stateParams) {

    $scope.provider = $stateParams.providerInfo;

    $scope.confirmBooking = function(provider) {
        console.log("Appointment successfully ");
        $state.go('app.book.home');
    };
})

.controller('ProvidersCtrl', function($scope, currentProvider, $state, $stateParams, BookingsService, $ionicModal, $ionicPopup, lodash, $filter, $ionicScrollDelegate) {
  
    $scope.subcategory = $stateParams.subgroupInfo;
  BookingsService.getAllProviders().then(function(response) {
        $scope.providers = response.data;
    })

    $scope.bookPerService = function(provider) {
        console.log(provider);
        $state.go('app.book.provider', { providerInfo: provider });
    };
})

.controller('SettingsCtrl', function($scope, $ionicModal) {

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

.controller('LegalCtrl', function($scope) {

})
