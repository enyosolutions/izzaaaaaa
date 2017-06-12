angular.module('izza.app.controllers', ['ui.rCalendar'])


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


        $scope.doRefresh();
        
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
                "serviceInfo": [
                    {
                      "description": "coiffure",
                      "cur": "eur",
                      "price": "30"
                    },
                    {
                      "description": "chignon",
                      "cur": "eur",
                      "price": "20"
                    }
                ]
            }
        };
  
    })
    .controller("PickBookingTimeCtrl", function($scope, currentProvider, PostService, $filter, $stateParams, ionicDatePicker, ionicTimePicker, $location, $state, BookingsService, $ionicModal, $localStorage, $sessionStorage, $ionicPopup, $ionicHistory) {


            $scope.params = $stateParams;

            $scope.showday = "";
            $scope.showmonth = "Choisir la date";

            $scope.pickedServices = $scope.provider;


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
                        // $scope.reservation.betweenTo = selectedTimeTo.getUTCHours() +  'h' + (selectedTimeTo.getUTCMinutes()?selectedTimeTo.getUTCMinutes() +  'm':'') ;
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
                    $scope.showmonth = $filter('date')(caldate, 'MMMM');
                    $scope.showday = $filter('date')(caldate, 'd');


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

            $scope.reservation = {
                reservation_date: Date(),
                betweenFrom: "",
                betweenTo: "",

            };



            $scope.confirmBooking = function() {

                //debugger;


                $scope.showAlertBookError = function() {
                    var alertPopup = $ionicPopup.alert({
                        title: 'Erreur',
                        template: "Votre réservation n'a pas pu être enregistrée. Veuillez reessayer plus tard"
                    });

                    alertPopup.then(function(res) {

                        console.log('Booking error alert.');
                    });
                };

                $scope.showAlertNoProfile = function() {
                    var alertPopup = $ionicPopup.alert({
                        title: 'Confirmation',
                        template: 'Merci de remplir votre profile avant de réserver.'
                    });

                    alertPopup.then(function(res) {
                        $state.go('app.profile.home');
                        console.log('User told to fill profile.');
                    });
                };

                $scope.showAlertReserveOK = function() {
                    var alertPopup = $ionicPopup.alert({
                        title: 'Confirmation',
                        template: 'Le montant total de votre réservation est ' + totalAmount + '€. Vous recevrez un email lorsque ' +
                            'le/la prestataire aura confirmé sa disponibilité au jour et à la plage horaire demandée.'
                    });

                    alertPopup.then(function(res) {
                        BookingsService.createBookingForProvider(bookingInfo).then(function(result) {
                            if (!result.status.message === "success") {
                                //currentProvider.setcurrentProvider( $scope.selectedProvider);

                                $state.go('app.book.home', {}, { reload: true });
                                $scope.showAlertBookError();
                            } else {
                                $state.go('app.book.home', {}, { reload: true });
                                console.log('Reservation posted.');
                            }


                        });

                    });
                };


                $scope.profile = $localStorage.profile;
                //TODO clear currentProvider back to full data.
                var providerAndReservedSkills = currentProvider.bufferProvider;
                //currentProvider.setcurrentProvider($scope.selectedProvider);


                var totalAmount = 0;
                for (var i = providerAndReservedSkills.skillsandprice.length; i--;) {
                    if (!providerAndReservedSkills.skillsandprice[i].selected) {

                        providerAndReservedSkills.skillsandprice.splice(i, 1);
                    } else {
                        var intprice = Number(providerAndReservedSkills.skillsandprice[i].price);
                        totalAmount = totalAmount + intprice;
                    }
                }
                $scope.reservation.status = 'En attente de confirmation';
                var bookingInfo = {
                    providerInfo: providerAndReservedSkills,
                    userInfo: $localStorage.profile,
                    reservationInfo: $scope.reservation,
                    serviceInfo: providerAndReservedSkills.skillsandprice,
                    totalamount: totalAmount

                };
                var profileok = false;
                if (($scope.profile) && $scope.profile.profile) {
                    if ($scope.profile.profile.email) {
                        if ($scope.profile.profile.email !== "") {
                            profileok = true;
                            console.log("profile loaded.");

                            //Profile loaded we ask for credit card info.
                            //And we bill 10% of total.
                            $scope.showAlertReserveOK();


                        }
                    }
                } else {
                    profileok = false;
                    console.log("profile not loaded.");
                    $scope.showAlertNoProfile();
                }

                /*
                if (profileok){
                    BookingsService.createBookingForProvider(bookingInfo);
                    $state.go('app.book.home',{},{reload: true});

                }
                else
                {
                    $state.go('app.profile.home');
                }*/


            };



            $scope.navigateToProviderSchedule = function(provider) {
                //commentsPopup.close();
                //$ionicHistory.currentView($ionicHistory.backView());
                //$ionicHistory.nextViewOptions({ disableAnimate: true,historyRoot: true });
                //$state.go('app.profile.posts', {userId: 123});
                //book_addbooking/:title/:firstname/:lastname/:contact_email/:contact_mobilenb/:contact_web_site_url
                $state.go('app.book.addbooking', {
                    provider_data: provider,
                    title: provider.title,
                    firstname: provider.firstname,
                    lastname: provider.lastname,
                    contact_email: provider.contact_email,
                    contact_mobilenb: provider.contact_mobilenb,
                    contact_web_site_url: provider.web_site_url
                }, { reload: true }); //provider.contact_email


            };

            //$self.openDatePicker();
        }

    )
    .controller('BookProviderCtrl', function($scope, currentProvider, BookingsService, $ionicPopup, $state, ionicDatePicker) {





    })


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


.controller('ProfileCtrl', function($scope, currentProvider, $stateParams, PostService, $localStorage, $sessionStorage, $ionicHistory, $state, $ionicScrollDelegate) {

    $localStorage = $localStorage.$default({
        profile: {}
    });
    $scope.$storage = $localStorage.profile;
    // $scope.$storage = $sessionStorage.$default(/* any defaults here */);
    console.log($scope.$storage);
})


.controller('ProductCtrl', function($scope, $stateParams, ShopService, $ionicPopup, $ionicLoading) {
    var productId = $stateParams.productId;

    ShopService.getProduct(productId).then(function(product) {
        $scope.product = product;
    });

    // show add to cart popup on button click
    $scope.showAddToCartPopup = function(product) {
        $scope.data = {};
        $scope.data.product = product;
        $scope.data.productOption = 1;
        $scope.data.productQuantity = 1;

        var myPopup = $ionicPopup.show({
            cssClass: 'add-to-cart-popup',
            templateUrl: 'views/app/shop/partials/add-to-cart-popup.html',
            title: 'Add to Cart',
            scope: $scope,
            buttons: [
                { text: '', type: 'close-popup ion-ios-close-outline' }, {
                    text: 'Add to cart',
                    onTap: function(e) {
                        return $scope.data;
                    }
                }
            ]
        });
        myPopup.then(function(res) {
            if (res) {
                $ionicLoading.show({ template: '<ion-spinner icon="ios"></ion-spinner><p style="margin: 5px 0 0 0;">Adding to cart</p>', duration: 1000 });
                ShopService.addProductToCart(res.product);
                console.log('Item added to cart!', res);
            } else {
                console.log('Popup closed');
            }
        });
    };
})


.controller('PostCardCtrl', function($scope, PostService, $ionicPopup, $state) {
    var commentsPopup = {};

    $scope.navigateToUserProfile = function(user) {
        commentsPopup.close();
        $state.go('app.profile.posts', { userId: user._id });
    };

    $scope.showComments = function(post) {
        PostService.getPostComments(post)
            .then(function(data) {
                post.comments_list = data;
                commentsPopup = $ionicPopup.show({
                    cssClass: 'popup-outer comments-view',
                    templateUrl: 'views/app/partials/comments.html',
                    scope: angular.extend($scope, { current_post: post }),
                    title: post.comments + ' Comments',
                    buttons: [
                        { text: '', type: 'close-popup ion-ios-close-outline' }
                    ]
                });
            });
    };
})

.controller('FeedCtrl', function($scope, PostService, $ionicPopup, $state) {
    $scope.posts = [];
    $scope.page = 1;
    $scope.totalPages = 1;

    $scope.doRefresh = function() {
        PostService.getFeed(1)
            .then(function(data) {
                $scope.totalPages = data.totalPages;
                $scope.posts = data.posts;

                $scope.$broadcast('scroll.refreshComplete');
            });
    };

    $scope.getNewData = function() {
        //do something to load your new data here
        $scope.$broadcast('scroll.refreshComplete');
    };

    $scope.loadMoreData = function() {
        $scope.page += 1;

        PostService.getFeed($scope.page)
            .then(function(data) {
                //We will update this value in every request because new posts can be created
                $scope.totalPages = data.totalPages;
                $scope.posts = $scope.posts.concat(data.posts);

                $scope.$broadcast('scroll.infiniteScrollComplete');
            });
    };

    $scope.moreDataCanBeLoaded = function() {
        return $scope.totalPages > $scope.page;
    };

    $scope.doRefresh();

})

.controller('BookCtrl', function($scope, currentProvider, $state, BookingsService, $ionicModal, $ionicPopup, lodash, $filter, $ionicScrollDelegate) {
        //List of providers where one can book one


        var iconselected = "ion-android-arrow-";
        var iconunselected = "ion-android-arrow-down";

        $scope.iconAllSelected = iconselected;
        $scope.iconAllUnSelected = iconunselected;

        $scope.iconHairSelected = iconselected;
        $scope.iconHairUnSelected = iconunselected;

        $scope.iconNailsSelected = iconselected;
        $scope.iconNailsUnSelected = iconunselected;

        $scope.iconMakeupSelected = iconselected;
        $scope.iconMakeupSelected = iconunselected;


        $scope.groups = [];

        $scope.groups[0] = {
            name: 'Coiffure',
            img: 'img/services/coiffure.jpg',
            items: ['Brushing', 'Chignon', 'Coupe', 'Décoloration/Coloration', 'Défrisage', 'Lissage brésilien']
        };



        $scope.groups[1] = {
            name: 'Onglerie',
            img: 'img/services/onglerie.jpg',
            items: ['Pose de vernis simple (Mains)', 'Pose vernis semi permanent (Mains)', 'Pose gel avec capsule (Mains)', 'Extension au gel/chablon (Mains)', 'Nail art (Mains)',
                'Pose de vernis simple (Pieds)', 'Pose vernis semi permanent (Pieds)', 'Pose gel avec capsule (Pieds)', 'Extension au gel/chablon  (Pieds)', 'Nail art  (Pieds)'
            ]
        };


        $scope.groups[2] = {
            name: 'Maquillage',
            img: 'img/services/maquillage.jpg',
            items: ['Maquillage jour', 'Maquillage soir']
        };
  

        /*
         * if given group is the selected group, deselect it
         * else, select the given group
         */
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

        $scope.active = 'Recherche';
        $scope.setActive = function(type) {
            $scope.active = type;
        };
        $scope.isActive = function(type) {
            return type === $scope.active;
        };

        $scope.filterCategory = "Toutes";
        $scope.providers = [];
        $scope.popular_providers = [];
        $scope.filteredServices = [];
        $scope.workProvider = [];



        //cssClass: 'popup-outer comments-view',

        $scope.bookPerService = function(provider) {
            // $scope.details_modal.show();
            $scope.selectedProvider = _.cloneDeep(provider);
            currentProvider.setcurrentProvider(provider);
            currentProvider.setbufferProvider(provider);

            //Added selected to skillset entries.


            $scope.workProvider = currentProvider.bufferProvider;
            for (var i = $scope.workProvider.skillsandprice.length; i--;) {
                if ($scope.workProvider.skillsandprice[i].price === 0) {
                    $scope.workProvider.skillsandprice.splice(i, 1);
                }
            }
            for (var i = 0; i < $scope.workProvider.skillsandprice.length; i++) {
                $scope.workProvider.skillsandprice[i].selected = false;
            }
            
            /*
            Go straight to the provider's booking page instead of popup
            */
          
            /*
            $scope.myPopup = $state.go('app.book.provider',{provider_data:provider,
              title:provider.title,
              firstname:provider.firstname,
              lastname:provider.lastname,
              contact_email:provider.contact_email,
              contact_mobilenb:provider.contact_mobilenb,
              contact_web_site_url:provider.web_site_url
            });
            */
          
            $scope.myPopup = $ionicPopup.show({
                cssClass: 'add-to-cart-popup',
                templateUrl: 'views/app/book/partials/book_by_skills_popup.html',
                title: '<img class="title-image" src="img/logo.png" />' ,
                scope: $scope,
                provider: provider,
                buttons: [
                    { text: '', type: 'close-popup ion-ios-close-outline' },

                    {
                        text: 'Suivant',
                        onTap: function(e) {
                            $state.go('app.book.addbooking',{provider_data:provider,
                                        title:provider.title,
                                        firstname:provider.firstname,
                                        lastname:provider.lastname,
                                        contact_email:provider.contact_email,
                                        contact_mobilenb:provider.contact_mobilenb,
                                        contact_web_site_url:provider.web_site_url
                                    }
                                ); //provider.contact_email
                            currentProvider.setbufferProvider($scope.workProvider);
                            return currentProvider.bufferProvider;
                        }
                    }
                ]
            });
            $scope.myPopup.then(function(provider) {
                if (provider) {
                  /*$state.go('app.book.addbooking',{provider_data:provider,
                    bookedskills:provider.skillsandprice,
                    title:provider.title,
                    firstname:provider.firstname,
                    lastname:provider.lastname,
                    contact_email:provider.contact_email,
                    contact_mobilenb:provider.contact_mobilenb,
                    contact_web_site_url:provider.web_site_url
                    }*/
                    $state.go('app.book.addbooking', { obj: provider }, { reload: true }); //provider.contact_email

                    //$ionicLoading.show({ template: '<ion-spinner icon="ios"></ion-spinner><p style="margin: 5px 0 0 0;">Adding to cart</p>', duration: 1000 });
                    //ShopService.addProductToCart(res.product);
                    //console.log('Item added to cart!', res);
                } else {
                    console.log('Popup closed');
                }
            });

        };



        $scope.showDetails = function(provider) {
            // $scope.details_modal.show();
            $scope.selectedProvider = provider;


            for (var i = $scope.selectedProvider.skillsandprice.length; i--;) {
                if ($scope.selectedProvider.skillsandprice[i].price === 0) {
                    $scope.selectedProvider.skillsandprice.splice(i, 1);
                }
            }
            $scope.myPopup = $ionicPopup.show({
                cssClass: 'add-to-cart-popup',
                templateUrl: 'views/app/book/partials/show_skills_popup.html',
                title: 'Services disponibles',
                scope: $scope,
                buttons: [
                    { text: '', type: 'close-popup ion-ios-close-outline' }
                    /*,
                                   {
                                       text: 'Add to cart',
                                       onTap: function(e) {
                                           return $scope.data;
                                       }
                                   }*/
                ]
            });
            $scope.myPopup.then(function(res) {
                if (res) {
                    $ionicLoading.show({ template: '<ion-spinner icon="ios"></ion-spinner><p style="margin: 5px 0 0 0;">Adding to cart</p>', duration: 1000 });
                    //ShopService.addProductToCart(res.product);
                    console.log('Item added to cart!', res);
                } else {
                    console.log('Popup closed');
                }
            });

        };

        //Cleanup the modal when we're done with it!
        $scope.scrollTop = function() {
            $ionicScrollDelegate.scrollTop();
        };
        $scope.updateQuery = function(category) {

            BookingsService.getProviders(category).then(function(providers) {

                $scope.providers = providers;
                $scope.providers = providers;
                if (providers.size === 0) {
                    console.log("no providers");
                } else {
                    $scope.setActive('Résultat');
                    $scope.scrollTop();

                }
            });
        };




        BookingsService.getProviders($scope.filterCategory).then(function(providers) {

            if (providers.error) {
                $scope.providers = {};
            } else {
                $scope.providers = providers;


            }

        });


        $scope.providers = [

        { "_id": "577dd5ea732f1d4514857850", "email": "pass@izza.co", "password": "00a8a64cc344fc614a6b5ac610e58d69289e1aefe36e081cb9d734c810bcfa07a84a1f4396115fb36b893895da4d0fa02aea889135d77ed5777c5fa9e6ce89395b1f59cbec9b36ad7c5bf3dea67c4bea4f6281cd536250c5af8cb624fbb99ad8e93dac42ba23731af6dfc879afb02b7fe80ebd58f40a2eaf3bbcc6e0c877cea3", "passwordSalt": "873e5f698f689fe457dd12a6c729bf3631cb0e9df13deb91ba0ab4a469cc0ac1", "createdAt": "2016-07-07T04:09:14.803Z", "active": true, "__v": 0, "firstname": "Isabelle", "lastname": "Bono", "title": "Mme", "contact_email": null, "profile": "Je suis la meilleure maquilleuse.", "picture": "img/providers/louise1.jpg", "contact_mobilenb": "0707070707", "contact_zip": "75008", "contact_city": "Paris", "contact_country": "France", "qualification1": "Coiffure", "qualification2": "", "qualification3": "Maquillage", "qualification4": "", "contact_postalcode": null, "web_site_url": null, "skillset": ["Décoloration/Coloration", "Locks"], "skillsandprice": [{ "selected": false, "cur": "eur", "price": 10, "description": "Brushing" }, { "selected": false, "cur": "eur", "price": "30", "description": "Chignon" }, { "selected": false, "cur": "eur", "price": "70", "description": "Coupe" }, { "selected": false, "cur": "eur", "price": "60", "description": "Décoloration/Coloration" }, { "selected": false, "cur": "eur", "price": "90", "description": "Défrisage" }, { "selected": false, "cur": "eur", "price": "200", "description": "Lissage brésilien" }, { "selected": false, "cur": "eur", "price": 0, "description": "Nattes" }, { "selected": false, "cur": "eur", "price": 0, "description": "Nattes collées" }, { "selected": false, "cur": "eur", "price": 0, "description": "Vanilles" }, { "selected": false, "cur": "eur", "price": 0, "description": "Piqué-laché" }, { "selected": false, "cur": "eur", "price": 0, "description": "Locks" }, { "selected": false, "cur": "eur", "price": 0, "description": "Fausses locks" }, { "selected": false, "cur": "eur", "price": 0, "description": "Crochets" }, { "selected": false, "cur": "eur", "price": 0, "description": "Tissage Ouvert" }, { "selected": false, "cur": "eur", "price": 0, "description": "Tissage Fermé" }, { "selected": false, "cur": "eur", "price": 0, "description": "Tissage Invisible (américain)" }, { "selected": false, "cur": "eur", "price": 0, "description": "Tissage U part" }, { "selected": false, "cur": "eur", "price": 0, "description": "Pose de closure" }, { "selected": false, "cur": "eur", "price": 0, "description": "Pose de closure élastic band" }, { "selected": false, "cur": "eur", "price": 0, "description": "Pose Lace Frontale" }, { "selected": false, "cur": "eur", "price": 0, "description": "Pose perruque" }, { "selected": false, "cur": "eur", "price": 0, "description": "Retrait tissage" }, { "selected": false, "cur": "eur", "price": 0, "description": "Extension de cils pose classique" }, { "selected": false, "cur": "eur", "price": 0, "description": "Extension de cils pose mixte" }, { "selected": false, "cur": "eur", "price": 0, "description": "Extension de cils pose volume russe" }, { "selected": false, "cur": "eur", "price": 0, "description": "Remplissage classique" }, { "selected": false, "cur": "eur", "price": 0, "description": "Remplissage mixte" }, { "selected": false, "cur": "eur", "price": 0, "description": "Remplissage volume russe" }, { "selected": false, "cur": "eur", "price": 0, "description": "Dépose extensions et faux cils" }, { "selected": false, "cur": "eur", "price": 0, "description": "Manucure –pédicure simple" }, { "selected": false, "cur": "eur", "price": 0, "description": "Manucure – pédicure semi permanent" }, { "selected": false, "cur": "eur", "price": 0, "description": "Pose de vernis simple (Mains)" }, { "selected": false, "cur": "eur", "price": 0, "description": "Pose vernis semi permanent (Mains)" }, { "selected": false, "cur": "eur", "price": 0, "description": "Pose gel avec capsule (Mains)" }, { "selected": false, "cur": "eur", "price": 0, "description": "Extension au gel (chablon) (Mains)" }, { "selected": false, "cur": "eur", "price": 0, "description": "Nail art (Mains)" }, { "selected": false, "cur": "eur", "price": 0, "description": "Pose de vernis simple (Pieds)" }, { "selected": false, "cur": "eur", "price": 0, "description": "Pose vernis semi permanent (Pieds)" }, { "selected": false, "cur": "eur", "price": 0, "description": "Pose gel avec capsule (Pieds)" }, { "selected": false, "cur": "eur", "price": 0, "description": "Extension au gel (chablon) (Pieds)" }, { "selected": false, "cur": "eur", "price": 0, "description": "Nail art (Pieds)" }, { "selected": false, "cur": "eur", "price": 0, "description": "Maquillage jour" }, { "selected": false, "cur": "eur", "price": 0, "description": "Maquillage soir" }, { "selected": false, "cur": "eur", "price": 0, "description": "Tatouage au henné naturel" }, { "selected": false, "cur": "eur", "price": 0, "description": "Tatouage au Jagua" }, { "selected": false, "cur": "eur", "price": 0, "description": "Mariage" }] }, 
        { "_id": "579fd059f3c546e12374ae21", "email": "riki.tinoza@hotmail.com", "password": "3c65084611c3807fbe46e71ebf40c4334e09d1de47ebdc05db9208dbb613d17a1b08a27ec07c2c3bf2f75f8d04ede83a36891f367d091a73e7a1fb8244fdc230c2c69d2982c7da16b8cbcdcf134019f196e07cdc2e614a6318d7afc15cc76623c79b2949fa6d9571af98f94b0b48ebcd6a83ce6f8fb536b55547cfe142d3d39a", "passwordSalt": "24286062b41efc5618cec8ffb2831dd937e0c484508c319f10682aefe5cccd4e", "createdAt": "2016-08-01T22:42:33.317Z", "active": true, "__v": 0, "firstname": "Riki", "lastname": null, "title": "Mr.", "contact_email": null, "profile": null, "picture": "img/providers/joana1.jpg",  "contact_mobilenb": null, "contact_zip": null, "contact_city": null, "contact_country": null, "qualification1": null, "qualification2": null, "qualification3": null, "qualification4": null, "contact_postalcode": null, "web_site_url": null, "skillset": null, "skillsandprice": [{ "description": "Brushing", "price": 10, "cur": "eur", "selected": false }, { "description": "Chignon", "price": 0, "cur": "eur", "selected": false }, { "description": "Coupe", "price": 0, "cur": "eur", "selected": false }, { "description": "Décoloration/Coloration", "price": 0, "cur": "eur", "selected": false }, { "description": "Défrisage", "price": 0, "cur": "eur", "selected": false }, { "description": "Lissage brésilien", "price": 0, "cur": "eur", "selected": false }, { "description": "Nattes", "price": 0, "cur": "eur", "selected": false }, { "description": "Nattes collées", "price": 0, "cur": "eur", "selected": false }, { "description": "Vanilles", "price": 0, "cur": "eur", "selected": false }, { "description": "Piqué-laché", "price": 0, "cur": "eur", "selected": false }, { "description": "Locks", "price": 0, "cur": "eur", "selected": false }, { "description": "Fausses locks", "price": 0, "cur": "eur", "selected": false }, { "description": "Crochets", "price": 0, "cur": "eur", "selected": false }, { "description": "Tissage Ouvert", "price": 0, "cur": "eur", "selected": false }, { "description": "Tissage Fermé", "price": 0, "cur": "eur", "selected": false }, { "description": "Tissage Invisible (américain)", "price": 0, "cur": "eur", "selected": false }, { "description": "Tissage U part", "price": 0, "cur": "eur", "selected": false }, { "description": "Pose de closure", "price": 0, "cur": "eur", "selected": false }, { "description": "Pose de closure élastic band", "price": 0, "cur": "eur", "selected": false }, { "description": "Pose Lace Frontale", "price": 0, "cur": "eur", "selected": false }, { "description": "Pose perruque", "price": 0, "cur": "eur", "selected": false }, { "description": "Retrait tissage", "price": 0, "cur": "eur", "selected": false }, { "description": "Extension de cils pose classique", "price": 0, "cur": "eur", "selected": false }, { "description": "Extension de cils pose mixte", "price": 0, "cur": "eur", "selected": false }, { "description": "Extension de cils pose volume russe", "price": 0, "cur": "eur", "selected": false }, { "description": "Remplissage classique", "price": 0, "cur": "eur", "selected": false }, { "description": "Remplissage mixte", "price": 0, "cur": "eur", "selected": false }, { "description": "Remplissage volume russe", "price": 0, "cur": "eur", "selected": false }, { "description": "Dépose extensions et faux cils", "price": 0, "cur": "eur", "selected": false }, { "description": "Manucure –pédicure simple", "price": 0, "cur": "eur", "selected": false }, { "description": "Manucure – pédicure semi permanent", "price": 0, "cur": "eur", "selected": false }, { "description": "Pose de vernis simple (Mains)", "price": 0, "cur": "eur", "selected": false }, { "description": "Pose vernis semi permanent (Mains)", "price": 0, "cur": "eur", "selected": false }, { "description": "Pose gel avec capsule (Mains)", "price": 0, "cur": "eur", "selected": false }, { "description": "Extension au gel (chablon) (Mains)", "price": 0, "cur": "eur", "selected": false }, { "description": "Nail art (Mains)", "price": 0, "cur": "eur", "selected": false }, { "description": "Pose de vernis simple (Pieds)", "price": 0, "cur": "eur", "selected": false }, { "description": "Pose vernis semi permanent (Pieds)", "price": 0, "cur": "eur", "selected": false }, { "description": "Pose gel avec capsule (Pieds)", "price": 0, "cur": "eur", "selected": false }, { "description": "Extension au gel (chablon) (Pieds)", "price": 0, "cur": "eur", "selected": false }, { "description": "Nail art (Pieds)", "price": 0, "cur": "eur", "selected": false }, { "description": "Maquillage jour", "price": 0, "cur": "eur", "selected": false }, { "description": "Maquillage soir", "price": 0, "cur": "eur", "selected": false }, { "description": "Tatouage au henné naturel", "price": 0, "cur": "eur", "selected": false }, { "description": "Tatouage au Jagua", "price": 0, "cur": "eur", "selected": false }, { "description": "Mariage", "price": 0, "cur": "eur", "selected": false }] }, 
        { "_id": "57a1207a07bd30ec25c6d567", "email": "paquita@fodor.net", "password": "d7478d50b2c4923c0b87e9d46045bedb77e5b7f93972f16959472ba81044c145bcc9d13f28e9e8b9202e5a291fae22bc33bab89b6724e2c19db582081b6c5ce715ad5c11a55fee919af33b075c1234195cb74957f6fa45f0ca7581bcc66dd26afdf70e7088f8bd881ed009f0ddd5ea14a41612ac0c645494181b3afb2b7742c3", "passwordSalt": "49c765a3f6eaf6c1dcbc1fd4c291ae6d8c4c5da0374ddeb466c602fe1178d389", "createdAt": "2016-08-02T22:36:42.016Z", "active": true, "__v": 0, "firstname": "Nicole", "lastname": "Setton", "title": "Mme", "contact_email": null, "profile": null, "picture": "img/providers/nicole1.jpg", "contact_mobilenb": "+33555555555", "contact_zip": "75008", "contact_city": "Paris", "contact_country": "France", "qualification1": "Coiffure", "qualification2": "Pedicure/Manucure", "qualification3": "Maquillage", "qualification4": "", "contact_postalcode": null, "web_site_url": null, "skillset": null, "skillsandprice": [{ "description": "Brushing", "price": "80", "cur": "eur", "selected": false }, { "description": "Chignon", "price": 0, "cur": "eur", "selected": false }, { "description": "Coupe", "price": 0, "cur": "eur", "selected": false }, { "description": "Décoloration/Coloration", "price": 0, "cur": "eur", "selected": false }, { "description": "Défrisage", "price": 0, "cur": "eur", "selected": false }, { "description": "Lissage brésilien", "price": 0, "cur": "eur", "selected": false }, { "description": "Nattes", "price": 0, "cur": "eur", "selected": false }, { "description": "Nattes collées", "price": 0, "cur": "eur", "selected": false }, { "description": "Vanilles", "price": 0, "cur": "eur", "selected": false }, { "description": "Piqué-laché", "price": 0, "cur": "eur", "selected": false }, { "description": "Locks", "price": 0, "cur": "eur", "selected": false }, { "description": "Fausses locks", "price": 0, "cur": "eur", "selected": false }, { "description": "Crochets", "price": 0, "cur": "eur", "selected": false }, { "description": "Tissage Ouvert", "price": 0, "cur": "eur", "selected": false }, { "description": "Tissage Fermé", "price": 0, "cur": "eur", "selected": false }, { "description": "Tissage Invisible (américain)", "price": 0, "cur": "eur", "selected": false }, { "description": "Tissage U part", "price": 0, "cur": "eur", "selected": false }, { "description": "Pose de closure", "price": 0, "cur": "eur", "selected": false }, { "description": "Pose de closure élastic band", "price": 0, "cur": "eur", "selected": false }, { "description": "Pose Lace Frontale", "price": 0, "cur": "eur", "selected": false }, { "description": "Pose perruque", "price": 0, "cur": "eur", "selected": false }, { "description": "Retrait tissage", "price": 0, "cur": "eur", "selected": false }, { "description": "Extension de cils pose classique", "price": 0, "cur": "eur", "selected": false }, { "description": "Extension de cils pose mixte", "price": 0, "cur": "eur", "selected": false }, { "description": "Extension de cils pose volume russe", "price": 0, "cur": "eur", "selected": false }, { "description": "Remplissage classique", "price": 0, "cur": "eur", "selected": false }, { "description": "Remplissage mixte", "price": 0, "cur": "eur", "selected": false }, { "description": "Remplissage volume russe", "price": 0, "cur": "eur", "selected": false }, { "description": "Dépose extensions et faux cils", "price": 0, "cur": "eur", "selected": false }, { "description": "Manucure –pédicure simple", "price": 0, "cur": "eur", "selected": false }, { "description": "Manucure – pédicure semi permanent", "price": 0, "cur": "eur", "selected": false }, { "description": "Pose de vernis simple (Mains)", "price": 0, "cur": "eur", "selected": false }, { "description": "Pose vernis semi permanent (Mains)", "price": 0, "cur": "eur", "selected": false }, { "description": "Pose gel avec capsule (Mains)", "price": 0, "cur": "eur", "selected": false }, { "description": "Extension au gel (chablon) (Mains)", "price": 0, "cur": "eur", "selected": false }, { "description": "Nail art (Mains)", "price": 0, "cur": "eur", "selected": false }, { "description": "Pose de vernis simple (Pieds)", "price": 0, "cur": "eur", "selected": false }, { "description": "Pose vernis semi permanent (Pieds)", "price": 0, "cur": "eur", "selected": false }, { "description": "Pose gel avec capsule (Pieds)", "price": 0, "cur": "eur", "selected": false }, { "description": "Extension au gel (chablon) (Pieds)", "price": 0, "cur": "eur", "selected": false }, { "description": "Nail art (Pieds)", "price": 0, "cur": "eur", "selected": false }, { "description": "Maquillage jour", "price": 0, "cur": "eur", "selected": false }, { "description": "Maquillage soir", "price": 0, "cur": "eur", "selected": false }, { "description": "Tatouage au henné naturel", "price": 0, "cur": "eur", "selected": false }, { "description": "Tatouage au Jagua", "price": 0, "cur": "eur", "selected": false }, { "description": "Mariage", "price": 0, "cur": "eur", "selected": false }] },
        { "_id": "57b3ad25a7cbd3872dbb707d", "email": "maimouna.diakhate59100@gmail.com", "password": "df78ab68f898070b496fec3b2cb617c374008f024177d986a0b65e3dcc139d0ab9f9dc12479ac7e2754836d923ff50ec3f2edef349794ef9f3b6378b11a7df9db32811ba7a1912bb7b12e9db5875f8461d4a9079134258b1cf475328efb4adc0e31cb42fc4d5c587ff15bbd014d6b44b7ef201dd93339836f2d90fec35b58545", "passwordSalt": "dd0b15294394f7dbc724a3eee00caa398c0a745835a3bb3953a1a78072a94844", "createdAt": "2016-08-17T00:17:41.875Z", "active": true, "__v": 0, "firstname": "Maimouna", "lastname": "Diaite", "title": "Mlle", "contact_email": null, "profile": null, "contact_mobilenb": "0651354796", "contact_zip": "59100", "contact_city": "Roubaix", "contact_country": "France", "qualification1": "Coiffure", "qualification2": "", "qualification3": "", "qualification4": "", "contact_postalcode": null, "web_site_url": null, "skillset": null, "skillsandprice": [{ "description": "Brushing", "price": 10, "cur": "eur", "selected": false }, { "description": "Chignon", "price": 0, "cur": "eur", "selected": false }, { "description": "Coupe", "price": 0, "cur": "eur", "selected": false }, { "description": "Décoloration/Coloration", "price": 0, "cur": "eur", "selected": false }, { "description": "Défrisage", "price": 0, "cur": "eur", "selected": false }, { "description": "Lissage brésilien", "price": 0, "cur": "eur", "selected": false }, { "description": "Nattes", "price": 0, "cur": "eur", "selected": false }, { "description": "Nattes collées", "price": 0, "cur": "eur", "selected": false }, { "description": "Vanilles", "price": 0, "cur": "eur", "selected": false }, { "description": "Piqué-laché", "price": 0, "cur": "eur", "selected": false }, { "description": "Locks", "price": 0, "cur": "eur", "selected": false }, { "description": "Fausses locks", "price": 0, "cur": "eur", "selected": false }, { "description": "Crochets", "price": 0, "cur": "eur", "selected": false }, { "description": "Tissage Ouvert", "price": 0, "cur": "eur", "selected": false }, { "description": "Tissage Fermé", "price": 0, "cur": "eur", "selected": false }, { "description": "Tissage Invisible (américain)", "price": 0, "cur": "eur", "selected": false }, { "description": "Tissage U part", "price": 0, "cur": "eur", "selected": false }, { "description": "Pose de closure", "price": 0, "cur": "eur", "selected": false }, { "description": "Pose de closure élastic band", "price": 0, "cur": "eur", "selected": false }, { "description": "Pose Lace Frontale", "price": 0, "cur": "eur", "selected": false }, { "description": "Pose perruque", "price": 0, "cur": "eur", "selected": false }, { "description": "Retrait tissage", "price": 0, "cur": "eur", "selected": false }, { "description": "Extension de cils pose classique", "price": 0, "cur": "eur", "selected": false }, { "description": "Extension de cils pose mixte", "price": 0, "cur": "eur", "selected": false }, { "description": "Extension de cils pose volume russe", "price": 0, "cur": "eur", "selected": false }, { "description": "Remplissage classique", "price": 0, "cur": "eur", "selected": false }, { "description": "Remplissage mixte", "price": 0, "cur": "eur", "selected": false }, { "description": "Remplissage volume russe", "price": 0, "cur": "eur", "selected": false }, { "description": "Dépose extensions et faux cils", "price": 0, "cur": "eur", "selected": false }, { "description": "Manucure –pédicure simple", "price": 0, "cur": "eur", "selected": false }, { "description": "Manucure – pédicure semi permanent", "price": 0, "cur": "eur", "selected": false }, { "description": "Pose de vernis simple (Mains)", "price": 0, "cur": "eur", "selected": false }, { "description": "Pose vernis semi permanent (Mains)", "price": 0, "cur": "eur", "selected": false }, { "description": "Pose gel avec capsule (Mains)", "price": 0, "cur": "eur", "selected": false }, { "description": "Extension au gel (chablon) (Mains)", "price": 0, "cur": "eur", "selected": false }, { "description": "Nail art (Mains)", "price": 0, "cur": "eur", "selected": false }, { "description": "Pose de vernis simple (Pieds)", "price": 0, "cur": "eur", "selected": false }, { "description": "Pose vernis semi permanent (Pieds)", "price": 0, "cur": "eur", "selected": false }, { "description": "Pose gel avec capsule (Pieds)", "price": 0, "cur": "eur", "selected": false }, { "description": "Extension au gel (chablon) (Pieds)", "price": 0, "cur": "eur", "selected": false }, { "description": "Nail art (Pieds)", "price": 0, "cur": "eur", "selected": false }, { "description": "Maquillage jour", "price": 0, "cur": "eur", "selected": false }, { "description": "Maquillage soir", "price": 0, "cur": "eur", "selected": false }, { "description": "Tatouage au henné naturel", "price": 0, "cur": "eur", "selected": false }, { "description": "Tatouage au Jagua", "price": 0, "cur": "eur", "selected": false }, { "description": "Mariage", "price": 0, "cur": "eur", "selected": false }] }];

        BookingsService.getProviders($scope.filterCategory).then(function(providers) {
            $scope.popular_providers = providers;
        });






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