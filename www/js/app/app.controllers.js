angular.module('izza.app.controllers', ['ui.rCalendar'])


.controller('test', function($scope, BookingsService, $localStorage) {


    $scope.profile = $localStorage.profile;

    $scope.doRefresh = function() {

        console.log("Refreshing reservations.");
        //getReservations
        if ($scope.profile) {
            if ($scope.profile.profile.email) {
                if ($scope.profile.profile.email !== "") {
                    profileok = true;
                    BookingsService.getReservations($scope.profile.profile.email).then(function(reservations) {
                        $scope.reservations = reservations;
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

})


.controller('BookSelectCtrl', function($scope, currentProvider, BookingsService, $ionicPopup, $ionicModal, $state, $ionicHistory, $localStorage, $sessionStorage) {



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


        $scope.doRefresh();


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
    /*
  $scope.$on('$ionicView.afterEnter', function() {
    $ionicScrollDelegate.$getByHandle('profile-scroll').resize();
  });

  var userId = $stateParams.userId;

  $scope.myProfile = $scope.loggedUser._id == userId;
  $scope.posts = [];
  $scope.likes = [];
  $scope.user = {};

  PostService.getUserPosts(userId).then(function(data){
    $scope.posts = data;
  });

  PostService.getUserDetails(userId).then(function(data){
    $scope.user = data;
  });

  PostService.getUserLikes(userId).then(function(data){
    $scope.likes = data;
  });

  $scope.getUserLikes = function(userId){
    //we need to do this in order to prevent the back to change
    $ionicHistory.currentView($ionicHistory.backView());
    $ionicHistory.nextViewOptions({ disableAnimate: true });

    $state.go('app.profile.likes', {userId: userId});
  };

  $scope.getUserPosts = function(userId){

    //we need to do this in order to prevent the back to change
    $ionicHistory.currentView($ionicHistory.backView());
    $ionicHistory.nextViewOptions({ disableAnimate: true });

    $state.go('app.profile.posts', {userId: userId});
  };
*/
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
//        $scope.groups[1] = {
//            name: 'Coiffure - Tresses',
//            items: ['Nattes', 'Nattes Collées', 'Vanilles', 'Piqué-laché', 'Locks', 'Fausses locks', 'Crochets']
//        };
//        $scope.groups[2] = {
//            name: 'Coiffure - Tissage et pose perruque',
//            items: ['Tissage Ouvert', 'Tissage Fermé', 'Tissage Invisible (américain)', 'Tissage U part', 'Pose de closure',
//                'Pose de closure élastic band', 'Pose Lace Frontale', 'Pose perruque', 'Retrait tissage'
//            ]
//        };
//        $scope.groups[3] = {
//            name: 'Cils',
//            items: ['Extension de cils pose classique', 'Extension de cils pose mixte', 'Extension de cils pose volume russe',
//                'Remplissage classique', 'Remplissage mixte', 'Remplissage volume russe', 'Dépose extensions et faux cils'
//            ]
//        };


        $scope.groups[1] = {
            name: 'Onglerie',
            img: 'img/services/onglerie.jpg',
            items: ['Pose de vernis simple (Mains)', 'Pose vernis semi permanent (Mains)', 'Pose gel avec capsule (Mains)', 'Extension au gel/chablon (Mains)', 'Nail art (Mains)',
                'Pose de vernis simple (Pieds)', 'Pose vernis semi permanent (Pieds)', 'Pose gel avec capsule (Pieds)', 'Extension au gel/chablon  (Pieds)', 'Nail art  (Pieds)'
            ]
        };

        /*    $scope.groups[5] = {
                name: 'Beauté des pieds',
                items: ['Pose de vernis simple', 'Pose vernis semi permanent','Pose gel avec capsule','Extension au gel (chablon)','Nail art']
            };*/

        $scope.groups[2] = {
            name: 'Maquillage',
            img: 'img/services/maquillage.jpg',
            items: ['Maquillage jour', 'Maquillage soir']
        };

//        $scope.groups[6] = {
//            name: 'Henné',
//            items: ['Tatouage au henné naturel (une main, deux mains, autre partie du corps)', 'Tatouage au Jagua (une main, deux mains, autre partie du corps)', 'Mariage']
//        };

        /*    for (var i=0; i<10; i++) {
                $scope.groups[i] = {
                    name: i,
                    items: []
                };
                for (var j=0; j<3; j++) {
                    $scope.groups[i].items.push(i + '-' + j);
                }
            }*/

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


        /* $scope.values=  [
           {id:1, name:"value1" },
           {id:2, name:"value2" },
           {id:3, name:"value3" }
         ];
         $scope.selectedValues= []; //initial selections
       */


        //cssClass: 'popup-outer comments-view',

        $scope.bookPerService = function(provider) {
            // $scope.details_modal.show();
            $scope.selectedProvider = _.cloneDeep(provider);
            currentProvider.setcurrentProvider(provider);
            currentProvider.setbufferProvider(provider);


            //debug;
            //var nb_skillset = $scope.selectedProvider.skillsandprice.length;

            /*        _.dropWhile($scope.selectedProvider.skillsandprice, function(o) {
                        return (o.price > 0);
                    });
                    var copArray = $scope.selectedProvider.skillsandprice;
                    _.pullAllWith(copArray, [{ 'price': 0 }], _.isEqual);
                    console.log(copArray);

                    */

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

            $scope.myPopup = $ionicPopup.show({
                cssClass: 'add-to-cart-popup',
                templateUrl: 'views/app/book/partials/book_by_skills_popup.html',
                title: 'Réserver',
                scope: $scope,
                buttons: [
                    { text: '', type: 'close-popup ion-ios-close-outline' },

                    {
                        text: 'Réserver',
                        onTap: function(e) {
                            /*$state.go('app.book.addbooking',{provider_data:provider,
                                        title:provider.title,
                                        firstname:provider.firstname,
                                        lastname:provider.lastname,
                                        contact_email:provider.contact_email,
                                        contact_mobilenb:provider.contact_mobilenb,
                                        contact_web_site_url:provider.web_site_url
                                    }
                                );*/ //provider.contact_email
                            currentProvider.setbufferProvider($scope.workProvider);
                            return currentProvider.bufferProvider;
                        }
                    }
                ]
            });
            $scope.myPopup.then(function(provider) {
                if (provider) {
                    /*                $state.go('app.book.addbooking',{provider_data:provider,
                                            bookedskills:provider.skillsandprice,
                                            title:provider.title,
                                            firstname:provider.firstname,
                                            lastname:provider.lastname,
                                            contact_email:provider.contact_email,
                                            contact_mobilenb:provider.contact_mobilenb,
                                            contact_web_site_url:provider.web_site_url
                                        }*/
                    $state.go('app.book.addbooking', { obj: provider }, { reload: true }


                    ); //provider.contact_email

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




        /* $ionicModal.fromTemplateUrl('details-modal.html', {
             scope: $scope,
             animation: 'slide-in-up'
         }).then(function (modal) {
             $scope.details_modal = modal;
         });

         $scope.$on('$destroy', function() {
             $scope.details_modal.remove();
         });
         // Execute action on hide modal
         $scope.$on('modal.hidden', function() {
             // Execute action
         });
         // Execute action on remove modal
         $scope.$on('modal.removed', function() {
             // Execute action
         });

         $scope.showDetails=function(category) {
             $scope.details_modal.show();


         };

         $scope.hideDetails = function() {
             $scope.details_modal.hide();
         };*/
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
//          { "_id": "57a11e138a09ca76256595f7", "email": "poss@fodor.net", "password": "274cbfdd1d2c445fe6fc314b3f55f283b7f3dfcd04084a17a6b2a689ebad5f1173dc54540d4214aad7d02ed163f2e0c8e0e2780ff104928491eb829491c73d3b3c48894fc5c7d10b99fceae6be7618d35967842d46c2dc2eb1f98240abe72901480a1edf7ab1a7585c3638fbbe0dc70a200700370a0faf2e5a32385a45b9d7c3", "passwordSalt": "8e599ceddcded99f03b2c0bae63441a0d575f36ead3ef4c0cdd5550c3bd26bd1", "createdAt": "2016-08-02T22:26:27.741Z", "active": true, "__v": 0 }, { "_id": "57a120e8ee086c3d27ad5990", "email": "lmontes@fodor.net", "password": "db0930e21256917c7e14a052f3bce9dba880e19a5ed135e2f7c2f642b61f9e9e5e07e4a63e7bf574b53e0bc71ad599a1227f0618711bc854c12d06e76f1c5da4fbe032c509bdc47c965f66adc9eb12ad661180eb01c8b29368774d8cdb197d0b062c57e4695682ef04a50a0584dcaa7bb070202bf37f6fb8aeace41484e1dd5f", "passwordSalt": "31dc9c03f6ab8d7f9176306882ea876856cf7736ee9192b7e6a9d330d34db645", "createdAt": "2016-08-02T22:38:32.025Z", "active": true, "__v": 0 }, { "_id": "57b4aba1a7cbd3872dbb707f", "email": "ornelatsopnang@yahoo.fr", "password": "3c023d3d7e705df5641ba63d70bc2a586465f59f25efb970adebc4847320e2f1c898640828479e3bd103789694e040638b5ba9b52c75bc3c5efa6bb08150100958441c517b1fbaabe5f70e23c78afbf3aab029db25ce690bfa71aa1cf653350a18118a23377f4a2ade4bdfb8878e3b91fdaf06cbcc56cdb56a3af62f638efd3e", "passwordSalt": "6cb621a3c8379af19172477527e3b56f96fa9fd00d32c1fbe4021deadcd4f794", "createdAt": "2016-08-17T18:23:29.268Z", "active": true, "__v": 0 }, { "_id": "57b4b000a7cbd3872dbb7080", "email": "lucie_boukoro@yahoo.fr", "password": "a92c89803108143e2c9df2615e2eb5edac0d686a3a05caea6188671f9a6183c7aff9efe75ba7420561f0b1634ed5ab176bb227589158e1133b6f0a063b5e4b9c837e75b407bd389b443cc740e6ab7b7ca31becfaea5725c41ff497ed185f163984051a633faca4ffd0b305638c31fb4a4e68ad7033ccb23c8730f51f836a7b4b", "passwordSalt": "6e3333142581eb3edeca2ccd27eecba081f84165f743bfa62a63758a5fc66ad3", "createdAt": "2016-08-17T18:42:08.590Z", "active": true, "__v": 0 }, { "_id": "57d6f8d985b1a0b06481603b", "email": "lbn@izza.co", "password": "d0a882effbae0bba1e6d98940b686a96b0ac7700bf37cd5350f04dc07c9b4320d247bd49ae1e213d90656e23daf694387c8e6fe1a27f86ff92c7a7d4889320f0adacb343d6517ca2e88345c173f08b746e201a483a28c811552da6089f35871a9d31d9dd4610de90233f2dc84c85ab3695534aa8d90e51a9d9be5a931faeb2ae", "passwordSalt": "81228393f14c1caa4cc2c780ae770551dba99536c1581972a8df0b43f1f82762", "createdAt": "2016-09-12T18:50:01.750Z", "active": true, "__v": 0 }, { "_id": "57dad46e85b1a0b06481603c", "email": "ms.tekian@agence-pleinlesyeux.com", "password": "b6e3d2067039cbb7037fcb04cd80f42b435e6e112785905561d9f5aba82222d5380376a96525353c978d20dbe7857068240887d4ab3e9be2a243ffff183e9e801952213f063ee8ebe3ee3d2149b45ef27e6e9e68fc6feb7ad85850763e1fe007cca4d84e5cdb156991d5456a7f4d012e88505f7ffcd9b334ea2c599fc486ade7", "passwordSalt": "d036af8ebf504a18e21468fbfa1692bd32cf09a73a71924eb4ac7b21c588c36e", "createdAt": "2016-09-15T17:03:42.499Z", "active": true, "__v": 0 }, { "_id": "58c69b1821d2c6bf54db7d54", "email": "felixwattez@gmail.com", "password": "e02f7b028b90e36b242937b287f9db264cafdfda286910eb630aec8b4c5a660eda1dde98953b9804bb708302147225ba13fb2fc19178ac7d4be6cecd714eeae0f8e2a98f8ca7873697f738d1433f7583ef2a3e0c12b95762bd1f43136e6264167dfe1a5cc8fadc25296af2fe635114056f9eaf457b1b87cc89c4429efd669c93", "passwordSalt": "93efda7420bf320800d9cd944a702106c1f6b93026a85335c288f09bacf8eaf4", "createdAt": "2017-03-13T13:14:00.657Z", "active": true, "__v": 0 }, { "_id": "58d2531f343b11fc4ac4c959", "email": "lbn@izza.cl", "password": "4e23bc80328421bc0f9bcb579896af6d6cf439725785b1e497263a7a165a8cc44149ff10fa5c5c1f288f36577b28ab97848865a9325fb41305c20c40c0b24b211b983dc2c045a6db86b23bd7efc2cd06dcf8b67e8ce5ac414994f8304681cd51863bc980756098fc1845e97bb4dd12f619c6a6d64603297e1438e33c8e0799f5", "passwordSalt": "ea238ccf0881e647201bdbe15edcf6ea0fa1eab546918396c06585d5bed4ed37", "createdAt": "2017-03-22T10:34:07.749Z", "active": true, "__v": 0 }, { "_id": "58e2191e343b11fc4ac4c961", "email": "toto@gmail.com", "password": "633c85220b18af67879b6430ca7ab0af62126e2d9ed78f86a81bb3d8d3b01c9d05150fdc8798c23b5d38d048ff871d6b66ad1dc285f88a6ab4a328329827962bae7d204f63d852bbe21ec0876dbc50927ffe468985c68a26406b3bdca7bfc940ebb18ce95eaa48d373a536f41fcb3cda28aee1ae823deb4ad0953cf36d544b5b", "passwordSalt": "00799253f4dde1e70cb360e1231e920b6ea9e96d638a25e787f6366518c64e74", "createdAt": "2017-04-03T09:42:54.333Z", "active": true, "__v": 0 }, 
        { "_id": "577dd5ea732f1d4514857850", "email": "pass@izza.co", "password": "00a8a64cc344fc614a6b5ac610e58d69289e1aefe36e081cb9d734c810bcfa07a84a1f4396115fb36b893895da4d0fa02aea889135d77ed5777c5fa9e6ce89395b1f59cbec9b36ad7c5bf3dea67c4bea4f6281cd536250c5af8cb624fbb99ad8e93dac42ba23731af6dfc879afb02b7fe80ebd58f40a2eaf3bbcc6e0c877cea3", "passwordSalt": "873e5f698f689fe457dd12a6c729bf3631cb0e9df13deb91ba0ab4a469cc0ac1", "createdAt": "2016-07-07T04:09:14.803Z", "active": true, "__v": 0, "firstname": "Isabelle", "lastname": "Bono", "title": "Mme", "contact_email": null, "profile": "Je suis la meilleure maquilleuse.", "avatar": "img/providers/louise1.jpg", "contact_mobilenb": "0707070707", "contact_zip": "75008", "contact_city": "Paris", "contact_country": "France", "qualification1": "Coiffure", "qualification2": "", "qualification3": "Maquillage", "qualification4": "", "contact_postalcode": null, "web_site_url": null, "skillset": ["Décoloration/Coloration", "Locks"], "skillsandprice": [{ "selected": false, "cur": "eur", "price": 10, "description": "Brushing" }, { "selected": false, "cur": "eur", "price": "30", "description": "Chignon" }, { "selected": false, "cur": "eur", "price": "70", "description": "Coupe" }, { "selected": false, "cur": "eur", "price": "60", "description": "Décoloration/Coloration" }, { "selected": false, "cur": "eur", "price": "90", "description": "Défrisage" }, { "selected": false, "cur": "eur", "price": "200", "description": "Lissage brésilien" }, { "selected": false, "cur": "eur", "price": 0, "description": "Nattes" }, { "selected": false, "cur": "eur", "price": 0, "description": "Nattes collées" }, { "selected": false, "cur": "eur", "price": 0, "description": "Vanilles" }, { "selected": false, "cur": "eur", "price": 0, "description": "Piqué-laché" }, { "selected": false, "cur": "eur", "price": 0, "description": "Locks" }, { "selected": false, "cur": "eur", "price": 0, "description": "Fausses locks" }, { "selected": false, "cur": "eur", "price": 0, "description": "Crochets" }, { "selected": false, "cur": "eur", "price": 0, "description": "Tissage Ouvert" }, { "selected": false, "cur": "eur", "price": 0, "description": "Tissage Fermé" }, { "selected": false, "cur": "eur", "price": 0, "description": "Tissage Invisible (américain)" }, { "selected": false, "cur": "eur", "price": 0, "description": "Tissage U part" }, { "selected": false, "cur": "eur", "price": 0, "description": "Pose de closure" }, { "selected": false, "cur": "eur", "price": 0, "description": "Pose de closure élastic band" }, { "selected": false, "cur": "eur", "price": 0, "description": "Pose Lace Frontale" }, { "selected": false, "cur": "eur", "price": 0, "description": "Pose perruque" }, { "selected": false, "cur": "eur", "price": 0, "description": "Retrait tissage" }, { "selected": false, "cur": "eur", "price": 0, "description": "Extension de cils pose classique" }, { "selected": false, "cur": "eur", "price": 0, "description": "Extension de cils pose mixte" }, { "selected": false, "cur": "eur", "price": 0, "description": "Extension de cils pose volume russe" }, { "selected": false, "cur": "eur", "price": 0, "description": "Remplissage classique" }, { "selected": false, "cur": "eur", "price": 0, "description": "Remplissage mixte" }, { "selected": false, "cur": "eur", "price": 0, "description": "Remplissage volume russe" }, { "selected": false, "cur": "eur", "price": 0, "description": "Dépose extensions et faux cils" }, { "selected": false, "cur": "eur", "price": 0, "description": "Manucure –pédicure simple" }, { "selected": false, "cur": "eur", "price": 0, "description": "Manucure – pédicure semi permanent" }, { "selected": false, "cur": "eur", "price": 0, "description": "Pose de vernis simple (Mains)" }, { "selected": false, "cur": "eur", "price": 0, "description": "Pose vernis semi permanent (Mains)" }, { "selected": false, "cur": "eur", "price": 0, "description": "Pose gel avec capsule (Mains)" }, { "selected": false, "cur": "eur", "price": 0, "description": "Extension au gel (chablon) (Mains)" }, { "selected": false, "cur": "eur", "price": 0, "description": "Nail art (Mains)" }, { "selected": false, "cur": "eur", "price": 0, "description": "Pose de vernis simple (Pieds)" }, { "selected": false, "cur": "eur", "price": 0, "description": "Pose vernis semi permanent (Pieds)" }, { "selected": false, "cur": "eur", "price": 0, "description": "Pose gel avec capsule (Pieds)" }, { "selected": false, "cur": "eur", "price": 0, "description": "Extension au gel (chablon) (Pieds)" }, { "selected": false, "cur": "eur", "price": 0, "description": "Nail art (Pieds)" }, { "selected": false, "cur": "eur", "price": 0, "description": "Maquillage jour" }, { "selected": false, "cur": "eur", "price": 0, "description": "Maquillage soir" }, { "selected": false, "cur": "eur", "price": 0, "description": "Tatouage au henné naturel" }, { "selected": false, "cur": "eur", "price": 0, "description": "Tatouage au Jagua" }, { "selected": false, "cur": "eur", "price": 0, "description": "Mariage" }] }, 
        { "_id": "579fd059f3c546e12374ae21", "email": "riki.tinoza@hotmail.com", "password": "3c65084611c3807fbe46e71ebf40c4334e09d1de47ebdc05db9208dbb613d17a1b08a27ec07c2c3bf2f75f8d04ede83a36891f367d091a73e7a1fb8244fdc230c2c69d2982c7da16b8cbcdcf134019f196e07cdc2e614a6318d7afc15cc76623c79b2949fa6d9571af98f94b0b48ebcd6a83ce6f8fb536b55547cfe142d3d39a", "passwordSalt": "24286062b41efc5618cec8ffb2831dd937e0c484508c319f10682aefe5cccd4e", "createdAt": "2016-08-01T22:42:33.317Z", "active": true, "__v": 0, "firstname": "Riki", "lastname": null, "title": "Mr.", "contact_email": null, "profile": null, "avatar": "img/providers/joana1.jpg",  "contact_mobilenb": null, "contact_zip": null, "contact_city": null, "contact_country": null, "qualification1": null, "qualification2": null, "qualification3": null, "qualification4": null, "contact_postalcode": null, "web_site_url": null, "skillset": null, "skillsandprice": [{ "description": "Brushing", "price": 10, "cur": "eur", "selected": false }, { "description": "Chignon", "price": 0, "cur": "eur", "selected": false }, { "description": "Coupe", "price": 0, "cur": "eur", "selected": false }, { "description": "Décoloration/Coloration", "price": 0, "cur": "eur", "selected": false }, { "description": "Défrisage", "price": 0, "cur": "eur", "selected": false }, { "description": "Lissage brésilien", "price": 0, "cur": "eur", "selected": false }, { "description": "Nattes", "price": 0, "cur": "eur", "selected": false }, { "description": "Nattes collées", "price": 0, "cur": "eur", "selected": false }, { "description": "Vanilles", "price": 0, "cur": "eur", "selected": false }, { "description": "Piqué-laché", "price": 0, "cur": "eur", "selected": false }, { "description": "Locks", "price": 0, "cur": "eur", "selected": false }, { "description": "Fausses locks", "price": 0, "cur": "eur", "selected": false }, { "description": "Crochets", "price": 0, "cur": "eur", "selected": false }, { "description": "Tissage Ouvert", "price": 0, "cur": "eur", "selected": false }, { "description": "Tissage Fermé", "price": 0, "cur": "eur", "selected": false }, { "description": "Tissage Invisible (américain)", "price": 0, "cur": "eur", "selected": false }, { "description": "Tissage U part", "price": 0, "cur": "eur", "selected": false }, { "description": "Pose de closure", "price": 0, "cur": "eur", "selected": false }, { "description": "Pose de closure élastic band", "price": 0, "cur": "eur", "selected": false }, { "description": "Pose Lace Frontale", "price": 0, "cur": "eur", "selected": false }, { "description": "Pose perruque", "price": 0, "cur": "eur", "selected": false }, { "description": "Retrait tissage", "price": 0, "cur": "eur", "selected": false }, { "description": "Extension de cils pose classique", "price": 0, "cur": "eur", "selected": false }, { "description": "Extension de cils pose mixte", "price": 0, "cur": "eur", "selected": false }, { "description": "Extension de cils pose volume russe", "price": 0, "cur": "eur", "selected": false }, { "description": "Remplissage classique", "price": 0, "cur": "eur", "selected": false }, { "description": "Remplissage mixte", "price": 0, "cur": "eur", "selected": false }, { "description": "Remplissage volume russe", "price": 0, "cur": "eur", "selected": false }, { "description": "Dépose extensions et faux cils", "price": 0, "cur": "eur", "selected": false }, { "description": "Manucure –pédicure simple", "price": 0, "cur": "eur", "selected": false }, { "description": "Manucure – pédicure semi permanent", "price": 0, "cur": "eur", "selected": false }, { "description": "Pose de vernis simple (Mains)", "price": 0, "cur": "eur", "selected": false }, { "description": "Pose vernis semi permanent (Mains)", "price": 0, "cur": "eur", "selected": false }, { "description": "Pose gel avec capsule (Mains)", "price": 0, "cur": "eur", "selected": false }, { "description": "Extension au gel (chablon) (Mains)", "price": 0, "cur": "eur", "selected": false }, { "description": "Nail art (Mains)", "price": 0, "cur": "eur", "selected": false }, { "description": "Pose de vernis simple (Pieds)", "price": 0, "cur": "eur", "selected": false }, { "description": "Pose vernis semi permanent (Pieds)", "price": 0, "cur": "eur", "selected": false }, { "description": "Pose gel avec capsule (Pieds)", "price": 0, "cur": "eur", "selected": false }, { "description": "Extension au gel (chablon) (Pieds)", "price": 0, "cur": "eur", "selected": false }, { "description": "Nail art (Pieds)", "price": 0, "cur": "eur", "selected": false }, { "description": "Maquillage jour", "price": 0, "cur": "eur", "selected": false }, { "description": "Maquillage soir", "price": 0, "cur": "eur", "selected": false }, { "description": "Tatouage au henné naturel", "price": 0, "cur": "eur", "selected": false }, { "description": "Tatouage au Jagua", "price": 0, "cur": "eur", "selected": false }, { "description": "Mariage", "price": 0, "cur": "eur", "selected": false }] }, 
        { "_id": "57a1207a07bd30ec25c6d567", "email": "paquita@fodor.net", "password": "d7478d50b2c4923c0b87e9d46045bedb77e5b7f93972f16959472ba81044c145bcc9d13f28e9e8b9202e5a291fae22bc33bab89b6724e2c19db582081b6c5ce715ad5c11a55fee919af33b075c1234195cb74957f6fa45f0ca7581bcc66dd26afdf70e7088f8bd881ed009f0ddd5ea14a41612ac0c645494181b3afb2b7742c3", "passwordSalt": "49c765a3f6eaf6c1dcbc1fd4c291ae6d8c4c5da0374ddeb466c602fe1178d389", "createdAt": "2016-08-02T22:36:42.016Z", "active": true, "__v": 0, "firstname": "Nicole", "lastname": "Setton", "title": "Mme", "contact_email": null, "profile": null, "avatar": "img/providers/nicole1.jpg", "contact_mobilenb": "+33555555555", "contact_zip": "75008", "contact_city": "Paris", "contact_country": "France", "qualification1": "Coiffure", "qualification2": "Pedicure/Manucure", "qualification3": "Maquillage", "qualification4": "", "contact_postalcode": null, "web_site_url": null, "skillset": null, "skillsandprice": [{ "description": "Brushing", "price": "80", "cur": "eur", "selected": false }, { "description": "Chignon", "price": 0, "cur": "eur", "selected": false }, { "description": "Coupe", "price": 0, "cur": "eur", "selected": false }, { "description": "Décoloration/Coloration", "price": 0, "cur": "eur", "selected": false }, { "description": "Défrisage", "price": 0, "cur": "eur", "selected": false }, { "description": "Lissage brésilien", "price": 0, "cur": "eur", "selected": false }, { "description": "Nattes", "price": 0, "cur": "eur", "selected": false }, { "description": "Nattes collées", "price": 0, "cur": "eur", "selected": false }, { "description": "Vanilles", "price": 0, "cur": "eur", "selected": false }, { "description": "Piqué-laché", "price": 0, "cur": "eur", "selected": false }, { "description": "Locks", "price": 0, "cur": "eur", "selected": false }, { "description": "Fausses locks", "price": 0, "cur": "eur", "selected": false }, { "description": "Crochets", "price": 0, "cur": "eur", "selected": false }, { "description": "Tissage Ouvert", "price": 0, "cur": "eur", "selected": false }, { "description": "Tissage Fermé", "price": 0, "cur": "eur", "selected": false }, { "description": "Tissage Invisible (américain)", "price": 0, "cur": "eur", "selected": false }, { "description": "Tissage U part", "price": 0, "cur": "eur", "selected": false }, { "description": "Pose de closure", "price": 0, "cur": "eur", "selected": false }, { "description": "Pose de closure élastic band", "price": 0, "cur": "eur", "selected": false }, { "description": "Pose Lace Frontale", "price": 0, "cur": "eur", "selected": false }, { "description": "Pose perruque", "price": 0, "cur": "eur", "selected": false }, { "description": "Retrait tissage", "price": 0, "cur": "eur", "selected": false }, { "description": "Extension de cils pose classique", "price": 0, "cur": "eur", "selected": false }, { "description": "Extension de cils pose mixte", "price": 0, "cur": "eur", "selected": false }, { "description": "Extension de cils pose volume russe", "price": 0, "cur": "eur", "selected": false }, { "description": "Remplissage classique", "price": 0, "cur": "eur", "selected": false }, { "description": "Remplissage mixte", "price": 0, "cur": "eur", "selected": false }, { "description": "Remplissage volume russe", "price": 0, "cur": "eur", "selected": false }, { "description": "Dépose extensions et faux cils", "price": 0, "cur": "eur", "selected": false }, { "description": "Manucure –pédicure simple", "price": 0, "cur": "eur", "selected": false }, { "description": "Manucure – pédicure semi permanent", "price": 0, "cur": "eur", "selected": false }, { "description": "Pose de vernis simple (Mains)", "price": 0, "cur": "eur", "selected": false }, { "description": "Pose vernis semi permanent (Mains)", "price": 0, "cur": "eur", "selected": false }, { "description": "Pose gel avec capsule (Mains)", "price": 0, "cur": "eur", "selected": false }, { "description": "Extension au gel (chablon) (Mains)", "price": 0, "cur": "eur", "selected": false }, { "description": "Nail art (Mains)", "price": 0, "cur": "eur", "selected": false }, { "description": "Pose de vernis simple (Pieds)", "price": 0, "cur": "eur", "selected": false }, { "description": "Pose vernis semi permanent (Pieds)", "price": 0, "cur": "eur", "selected": false }, { "description": "Pose gel avec capsule (Pieds)", "price": 0, "cur": "eur", "selected": false }, { "description": "Extension au gel (chablon) (Pieds)", "price": 0, "cur": "eur", "selected": false }, { "description": "Nail art (Pieds)", "price": 0, "cur": "eur", "selected": false }, { "description": "Maquillage jour", "price": 0, "cur": "eur", "selected": false }, { "description": "Maquillage soir", "price": 0, "cur": "eur", "selected": false }, { "description": "Tatouage au henné naturel", "price": 0, "cur": "eur", "selected": false }, { "description": "Tatouage au Jagua", "price": 0, "cur": "eur", "selected": false }, { "description": "Mariage", "price": 0, "cur": "eur", "selected": false }] },
        { "_id": "57b3ad25a7cbd3872dbb707d", "email": "maimouna.diakhate59100@gmail.com", "password": "df78ab68f898070b496fec3b2cb617c374008f024177d986a0b65e3dcc139d0ab9f9dc12479ac7e2754836d923ff50ec3f2edef349794ef9f3b6378b11a7df9db32811ba7a1912bb7b12e9db5875f8461d4a9079134258b1cf475328efb4adc0e31cb42fc4d5c587ff15bbd014d6b44b7ef201dd93339836f2d90fec35b58545", "passwordSalt": "dd0b15294394f7dbc724a3eee00caa398c0a745835a3bb3953a1a78072a94844", "createdAt": "2016-08-17T00:17:41.875Z", "active": true, "__v": 0, "firstname": "Maimouna", "lastname": "Diaite", "title": "Mlle", "contact_email": null, "profile": null, "contact_mobilenb": "0651354796", "contact_zip": "59100", "contact_city": "Roubaix", "contact_country": "France", "qualification1": "Coiffure", "qualification2": "", "qualification3": "", "qualification4": "", "contact_postalcode": null, "web_site_url": null, "skillset": null, "skillsandprice": [{ "description": "Brushing", "price": 10, "cur": "eur", "selected": false }, { "description": "Chignon", "price": 0, "cur": "eur", "selected": false }, { "description": "Coupe", "price": 0, "cur": "eur", "selected": false }, { "description": "Décoloration/Coloration", "price": 0, "cur": "eur", "selected": false }, { "description": "Défrisage", "price": 0, "cur": "eur", "selected": false }, { "description": "Lissage brésilien", "price": 0, "cur": "eur", "selected": false }, { "description": "Nattes", "price": 0, "cur": "eur", "selected": false }, { "description": "Nattes collées", "price": 0, "cur": "eur", "selected": false }, { "description": "Vanilles", "price": 0, "cur": "eur", "selected": false }, { "description": "Piqué-laché", "price": 0, "cur": "eur", "selected": false }, { "description": "Locks", "price": 0, "cur": "eur", "selected": false }, { "description": "Fausses locks", "price": 0, "cur": "eur", "selected": false }, { "description": "Crochets", "price": 0, "cur": "eur", "selected": false }, { "description": "Tissage Ouvert", "price": 0, "cur": "eur", "selected": false }, { "description": "Tissage Fermé", "price": 0, "cur": "eur", "selected": false }, { "description": "Tissage Invisible (américain)", "price": 0, "cur": "eur", "selected": false }, { "description": "Tissage U part", "price": 0, "cur": "eur", "selected": false }, { "description": "Pose de closure", "price": 0, "cur": "eur", "selected": false }, { "description": "Pose de closure élastic band", "price": 0, "cur": "eur", "selected": false }, { "description": "Pose Lace Frontale", "price": 0, "cur": "eur", "selected": false }, { "description": "Pose perruque", "price": 0, "cur": "eur", "selected": false }, { "description": "Retrait tissage", "price": 0, "cur": "eur", "selected": false }, { "description": "Extension de cils pose classique", "price": 0, "cur": "eur", "selected": false }, { "description": "Extension de cils pose mixte", "price": 0, "cur": "eur", "selected": false }, { "description": "Extension de cils pose volume russe", "price": 0, "cur": "eur", "selected": false }, { "description": "Remplissage classique", "price": 0, "cur": "eur", "selected": false }, { "description": "Remplissage mixte", "price": 0, "cur": "eur", "selected": false }, { "description": "Remplissage volume russe", "price": 0, "cur": "eur", "selected": false }, { "description": "Dépose extensions et faux cils", "price": 0, "cur": "eur", "selected": false }, { "description": "Manucure –pédicure simple", "price": 0, "cur": "eur", "selected": false }, { "description": "Manucure – pédicure semi permanent", "price": 0, "cur": "eur", "selected": false }, { "description": "Pose de vernis simple (Mains)", "price": 0, "cur": "eur", "selected": false }, { "description": "Pose vernis semi permanent (Mains)", "price": 0, "cur": "eur", "selected": false }, { "description": "Pose gel avec capsule (Mains)", "price": 0, "cur": "eur", "selected": false }, { "description": "Extension au gel (chablon) (Mains)", "price": 0, "cur": "eur", "selected": false }, { "description": "Nail art (Mains)", "price": 0, "cur": "eur", "selected": false }, { "description": "Pose de vernis simple (Pieds)", "price": 0, "cur": "eur", "selected": false }, { "description": "Pose vernis semi permanent (Pieds)", "price": 0, "cur": "eur", "selected": false }, { "description": "Pose gel avec capsule (Pieds)", "price": 0, "cur": "eur", "selected": false }, { "description": "Extension au gel (chablon) (Pieds)", "price": 0, "cur": "eur", "selected": false }, { "description": "Nail art (Pieds)", "price": 0, "cur": "eur", "selected": false }, { "description": "Maquillage jour", "price": 0, "cur": "eur", "selected": false }, { "description": "Maquillage soir", "price": 0, "cur": "eur", "selected": false }, { "description": "Tatouage au henné naturel", "price": 0, "cur": "eur", "selected": false }, { "description": "Tatouage au Jagua", "price": 0, "cur": "eur", "selected": false }, { "description": "Mariage", "price": 0, "cur": "eur", "selected": false }] }, 
        { "_id": "57b5ff20a7cbd3872dbb7081", "email": "lia@invicti.eu", "password": "631d15eaa050f8120cccb0037761250dfce81dc43a7afc43b52d25847e42ad457e9804be6eaf99a16d0de9f3d727d0e951603ceaef0229def23851741e01004efe4023d161dd595f484bb1dd7ae8708de985123f6eb6b8dfa1f4d895c5d6f935ea4a77342819e151de9c2744d4895ed042569a55a2855860e18b1758e1794f66", "passwordSalt": "cb9acad4df3cf8c9112366219ef9bac28b6358d67c1d0d49ef5b36e9ce5c7ec2", "createdAt": "2016-08-18T18:32:00.546Z", "active": true, "__v": 0, "firstname": "Lia", "lastname": "Tenen", "title": null, "contact_email": null, "profile": null, "contact_mobilenb": "0807070707", "contact_zip": null, "contact_city": null, "contact_country": null, "qualification1": "", "qualification2": "", "qualification3": "", "qualification4": "", "contact_postalcode": null, "web_site_url": null, "skillset": null, "skillsandprice": [{ "description": "Brushing", "price": "30", "cur": "eur", "selected": false }, { "description": "Chignon", "price": "40", "cur": "eur", "selected": false }, { "description": "Coupe", "price": 0, "cur": "eur", "selected": false }, { "description": "Décoloration/Coloration", "price": 0, "cur": "eur", "selected": false }, { "description": "Défrisage", "price": 0, "cur": "eur", "selected": false }, { "description": "Lissage brésilien", "price": 0, "cur": "eur", "selected": false }, { "description": "Nattes", "price": 0, "cur": "eur", "selected": false }, { "description": "Nattes collées", "price": 0, "cur": "eur", "selected": false }, { "description": "Vanilles", "price": 0, "cur": "eur", "selected": false }, { "description": "Piqué-laché", "price": 0, "cur": "eur", "selected": false }, { "description": "Locks", "price": 0, "cur": "eur", "selected": false }, { "description": "Fausses locks", "price": 0, "cur": "eur", "selected": false }, { "description": "Crochets", "price": 0, "cur": "eur", "selected": false }, { "description": "Tissage Ouvert", "price": 0, "cur": "eur", "selected": false }, { "description": "Tissage Fermé", "price": 0, "cur": "eur", "selected": false }, { "description": "Tissage Invisible (américain)", "price": 0, "cur": "eur", "selected": false }, { "description": "Tissage U part", "price": 0, "cur": "eur", "selected": false }, { "description": "Pose de closure", "price": 0, "cur": "eur", "selected": false }, { "description": "Pose de closure élastic band", "price": 0, "cur": "eur", "selected": false }, { "description": "Pose Lace Frontale", "price": 0, "cur": "eur", "selected": false }, { "description": "Pose perruque", "price": 0, "cur": "eur", "selected": false }, { "description": "Retrait tissage", "price": 0, "cur": "eur", "selected": false }, { "description": "Extension de cils pose classique", "price": 0, "cur": "eur", "selected": false }, { "description": "Extension de cils pose mixte", "price": 0, "cur": "eur", "selected": false }, { "description": "Extension de cils pose volume russe", "price": 0, "cur": "eur", "selected": false }, { "description": "Remplissage classique", "price": 0, "cur": "eur", "selected": false }, { "description": "Remplissage mixte", "price": 0, "cur": "eur", "selected": false }, { "description": "Remplissage volume russe", "price": 0, "cur": "eur", "selected": false }, { "description": "Dépose extensions et faux cils", "price": 0, "cur": "eur", "selected": false }, { "description": "Manucure –pédicure simple", "price": 0, "cur": "eur", "selected": false }, { "description": "Manucure – pédicure semi permanent", "price": 0, "cur": "eur", "selected": false }, { "description": "Pose de vernis simple (Mains)", "price": 0, "cur": "eur", "selected": false }, { "description": "Pose vernis semi permanent (Mains)", "price": 0, "cur": "eur", "selected": false }, { "description": "Pose gel avec capsule (Mains)", "price": 0, "cur": "eur", "selected": false }, { "description": "Extension au gel (chablon) (Mains)", "price": 0, "cur": "eur", "selected": false }, { "description": "Nail art (Mains)", "price": 0, "cur": "eur", "selected": false }, { "description": "Pose de vernis simple (Pieds)", "price": 0, "cur": "eur", "selected": false }, { "description": "Pose vernis semi permanent (Pieds)", "price": 0, "cur": "eur", "selected": false }, { "description": "Pose gel avec capsule (Pieds)", "price": 0, "cur": "eur", "selected": false }, { "description": "Extension au gel (chablon) (Pieds)", "price": 0, "cur": "eur", "selected": false }, { "description": "Nail art (Pieds)", "price": 0, "cur": "eur", "selected": false }, { "description": "Maquillage jour", "price": 0, "cur": "eur", "selected": false }, { "description": "Maquillage soir", "price": 0, "cur": "eur", "selected": false }, { "description": "Tatouage au henné naturel", "price": 0, "cur": "eur", "selected": false }, { "description": "Tatouage au Jagua", "price": 0, "cur": "eur", "selected": false }, { "description": "Mariage", "price": 0, "cur": "eur", "selected": false }] }, 
        { "_id": "57b46801a7cbd3872dbb707e", "email": "amy_d75@hotmail.fr", "password": "b5f09dbb5dcc98b7712f161e335a50fd305ae756332ca774774d7a99188d885a0999750681becba84266cb48db4e2bbeb496d913184ebaeaa5c6fda7ef32c4f92dcc90ee4203e5a1887802271fca41f0b7984ebbccf0e6dcad6292f687e2dbc968c337cab409414345aef673cded5e8384a1243fb74855190bffc881237e1c07", "passwordSalt": "3c39eb97ec2e9c3888571a167634039c02f76392080d0f026f696566f78030b7", "createdAt": "2016-08-17T13:34:57.109Z", "active": true, "__v": 0, "firstname": "Amy", "lastname": "Diallo", "title": "Mlle", "contact_email": null, "profile": "Maquilleuses coiffeuse pour vos divers événements !", "contact_mobilenb": "0782776781", "contact_zip": "75020", "contact_city": "Paris", "contact_country": "France", "qualification1": "Coiffure", "qualification2": "", "qualification3": "Maquillage", "qualification4": "", "contact_postalcode": null, "web_site_url": "http://haybeauty.wixsite.com/haybeauty", "skillset": null, "skillsandprice": [{ "description": "Brushing", "price": 10, "cur": "eur", "selected": false }, { "description": "Chignon", "price": 0, "cur": "eur", "selected": false }, { "description": "Coupe", "price": 0, "cur": "eur", "selected": false }, { "description": "Décoloration/Coloration", "price": 0, "cur": "eur", "selected": false }, { "description": "Défrisage", "price": 0, "cur": "eur", "selected": false }, { "description": "Lissage brésilien", "price": 0, "cur": "eur", "selected": false }, { "description": "Nattes", "price": 0, "cur": "eur", "selected": false }, { "description": "Nattes collées", "price": 0, "cur": "eur", "selected": false }, { "description": "Vanilles", "price": 0, "cur": "eur", "selected": false }, { "description": "Piqué-laché", "price": 0, "cur": "eur", "selected": false }, { "description": "Locks", "price": 0, "cur": "eur", "selected": false }, { "description": "Fausses locks", "price": 0, "cur": "eur", "selected": false }, { "description": "Crochets", "price": 0, "cur": "eur", "selected": false }, { "description": "Tissage Ouvert", "price": 0, "cur": "eur", "selected": false }, { "description": "Tissage Fermé", "price": 0, "cur": "eur", "selected": false }, { "description": "Tissage Invisible (américain)", "price": 0, "cur": "eur", "selected": false }, { "description": "Tissage U part", "price": 0, "cur": "eur", "selected": false }, { "description": "Pose de closure", "price": 0, "cur": "eur", "selected": false }, { "description": "Pose de closure élastic band", "price": 0, "cur": "eur", "selected": false }, { "description": "Pose Lace Frontale", "price": 0, "cur": "eur", "selected": false }, { "description": "Pose perruque", "price": 0, "cur": "eur", "selected": false }, { "description": "Retrait tissage", "price": 0, "cur": "eur", "selected": false }, { "description": "Extension de cils pose classique", "price": 0, "cur": "eur", "selected": false }, { "description": "Extension de cils pose mixte", "price": 0, "cur": "eur", "selected": false }, { "description": "Extension de cils pose volume russe", "price": 0, "cur": "eur", "selected": false }, { "description": "Remplissage classique", "price": 0, "cur": "eur", "selected": false }, { "description": "Remplissage mixte", "price": 0, "cur": "eur", "selected": false }, { "description": "Remplissage volume russe", "price": 0, "cur": "eur", "selected": false }, { "description": "Dépose extensions et faux cils", "price": 0, "cur": "eur", "selected": false }, { "description": "Manucure –pédicure simple", "price": 0, "cur": "eur", "selected": false }, { "description": "Manucure – pédicure semi permanent", "price": 0, "cur": "eur", "selected": false }, { "description": "Pose de vernis simple (Mains)", "price": 0, "cur": "eur", "selected": false }, { "description": "Pose vernis semi permanent (Mains)", "price": 0, "cur": "eur", "selected": false }, { "description": "Pose gel avec capsule (Mains)", "price": 0, "cur": "eur", "selected": false }, { "description": "Extension au gel (chablon) (Mains)", "price": 0, "cur": "eur", "selected": false }, { "description": "Nail art (Mains)", "price": 0, "cur": "eur", "selected": false }, { "description": "Pose de vernis simple (Pieds)", "price": 0, "cur": "eur", "selected": false }, { "description": "Pose vernis semi permanent (Pieds)", "price": 0, "cur": "eur", "selected": false }, { "description": "Pose gel avec capsule (Pieds)", "price": 0, "cur": "eur", "selected": false }, { "description": "Extension au gel (chablon) (Pieds)", "price": 0, "cur": "eur", "selected": false }, { "description": "Nail art (Pieds)", "price": 0, "cur": "eur", "selected": false }, { "description": "Maquillage jour", "price": 50, "cur": "eur", "selected": false }, { "description": "Maquillage soir", "price": 0, "cur": "eur", "selected": false }, { "description": "Tatouage au henné naturel", "price": 0, "cur": "eur", "selected": false }, { "description": "Tatouage au Jagua", "price": 0, "cur": "eur", "selected": false }, { "description": "Mariage", "price": 0, "cur": "eur", "selected": false }] }, 
        { "_id": "57bbb1cc85b1a0b06481603a", "email": "ines@invicti.eu", "password": "c8c723e17c9f13ea39343642665b21a11ea09915f2e85b91c77e94a8c6238138a369c9ba62b992a29902eb74e9217c79464616fa385e90c021e4258740ba8a1edd7eb5deadd5c320c9a8185456dc84a835e7d5642245c4223ae6d71acadd562378399330b86a09abc7953e6cc71d514342eaddb88155897e14698290ebfb049c", "passwordSalt": "6698e24a7ce71df480e667dd50d9acabf297b5579663dffdaed699ad6a154410", "createdAt": "2016-08-23T02:15:40.438Z", "active": true, "__v": 0, "firstname": "Ines", "lastname": "de la Fraise", "title": "Mme", "contact_email": null, "profile": null, "contact_mobilenb": "0708070807", "contact_zip": "75008", "contact_city": "Paris", "contact_country": "France", "qualification1": "Coiffure", "qualification2": "", "qualification3": "", "qualification4": "", "contact_postalcode": null, "web_site_url": "http://cccc.ccc", "skillset": null, "skillsandprice": [{ "selected": false, "cur": "eur", "price": "40", "description": "Brushing" }, { "selected": false, "cur": "eur", "price": 0, "description": "Chignon" }, { "selected": false, "cur": "eur", "price": 0, "description": "Coupe" }, { "selected": false, "cur": "eur", "price": 0, "description": "Décoloration/Coloration" }, { "selected": false, "cur": "eur", "price": 0, "description": "Défrisage" }, { "selected": false, "cur": "eur", "price": 0, "description": "Lissage brésilien" }, { "selected": false, "cur": "eur", "price": 0, "description": "Nattes" }, { "selected": false, "cur": "eur", "price": 0, "description": "Nattes collées" }, { "selected": false, "cur": "eur", "price": 0, "description": "Vanilles" }, { "selected": false, "cur": "eur", "price": 0, "description": "Piqué-laché" }, { "selected": false, "cur": "eur", "price": 0, "description": "Locks" }, { "selected": false, "cur": "eur", "price": 0, "description": "Fausses locks" }, { "selected": false, "cur": "eur", "price": 0, "description": "Crochets" }, { "selected": false, "cur": "eur", "price": 0, "description": "Tissage Ouvert" }, { "selected": false, "cur": "eur", "price": 0, "description": "Tissage Fermé" }, { "selected": false, "cur": "eur", "price": 0, "description": "Tissage Invisible (américain)" }, { "selected": false, "cur": "eur", "price": 0, "description": "Tissage U part" }, { "selected": false, "cur": "eur", "price": 0, "description": "Pose de closure" }, { "selected": false, "cur": "eur", "price": 0, "description": "Pose de closure élastic band" }, { "selected": false, "cur": "eur", "price": 0, "description": "Pose Lace Frontale" }, { "selected": false, "cur": "eur", "price": 0, "description": "Pose perruque" }, { "selected": false, "cur": "eur", "price": 0, "description": "Retrait tissage" }, { "selected": false, "cur": "eur", "price": 0, "description": "Extension de cils pose classique" }, { "selected": false, "cur": "eur", "price": 0, "description": "Extension de cils pose mixte" }, { "selected": false, "cur": "eur", "price": 0, "description": "Extension de cils pose volume russe" }, { "selected": false, "cur": "eur", "price": 0, "description": "Remplissage classique" }, { "selected": false, "cur": "eur", "price": 0, "description": "Remplissage mixte" }, { "selected": false, "cur": "eur", "price": 0, "description": "Remplissage volume russe" }, { "selected": false, "cur": "eur", "price": 0, "description": "Dépose extensions et faux cils" }, { "selected": false, "cur": "eur", "price": 0, "description": "Manucure –pédicure simple" }, { "selected": false, "cur": "eur", "price": 0, "description": "Manucure – pédicure semi permanent" }, { "selected": false, "cur": "eur", "price": 0, "description": "Pose de vernis simple (Mains)" }, { "selected": false, "cur": "eur", "price": 0, "description": "Pose vernis semi permanent (Mains)" }, { "selected": false, "cur": "eur", "price": 0, "description": "Pose gel avec capsule (Mains)" }, { "selected": false, "cur": "eur", "price": 0, "description": "Extension au gel (chablon) (Mains)" }, { "selected": false, "cur": "eur", "price": 0, "description": "Nail art (Mains)" }, { "selected": false, "cur": "eur", "price": 0, "description": "Pose de vernis simple (Pieds)" }, { "selected": false, "cur": "eur", "price": 0, "description": "Pose vernis semi permanent (Pieds)" }, { "selected": false, "cur": "eur", "price": 0, "description": "Pose gel avec capsule (Pieds)" }, { "selected": false, "cur": "eur", "price": 0, "description": "Extension au gel (chablon) (Pieds)" }, { "selected": false, "cur": "eur", "price": 0, "description": "Nail art (Pieds)" }, { "selected": false, "cur": "eur", "price": 0, "description": "Maquillage jour" }, { "selected": false, "cur": "eur", "price": 0, "description": "Maquillage soir" }, { "selected": false, "cur": "eur", "price": 0, "description": "Tatouage au henné naturel" }, { "selected": false, "cur": "eur", "price": 0, "description": "Tatouage au Jagua" }, { "selected": false, "cur": "eur", "price": 0, "description": "Mariage" }], "contact_raison_sociale": "STARTRESS", "contact_siren": "234342343242344", "contact_siret": "3243242342", "contact_codetva": "234324RFDF" }, 
        { "_id": "591c9495343b11fc4ac4c962", "email": "nicolas@fodor.net", "password": "15c265311d47e351637254866cd1d62224921638274224541511f473653548647ec3b8b9162bca211d1226956fceeea6ed8b84c5f278689eca6d16a9e22cadb5035f8e1f34619e392941dfe026fc735bf403e3f2ba1a3de649b402eb1323ffbb01a9a627dccefdcb8aece8816e35e4a9ff9f1ebf0e09529b63d08eaba26e17f1", "passwordSalt": "44a1bfb7bf65d7599a21bbbb97f24112fd6daf2fb2f19fa4140e79406c92cf23", "createdAt": "2017-05-17T18:21:09.896Z", "active": true, "__v": 0, "firstname": null, "lastname": null, "title": null, "contact_email": null, "profile": null, "contact_mobilenb": null, "contact_zip": null, "contact_city": null, "contact_country": null, "qualification1": "", "qualification2": "", "qualification3": "", "qualification4": "", "contact_postalcode": null, "contact_raison_sociale": null, "contact_siren": null, "contact_siret": null, "contact_codetva": null, "web_site_url": null, "skillset": null, "skillsandprice": [{ "description": "Brushing", "price": 0, "cur": "eur", "selected": false }, { "description": "Chignon", "price": 0, "cur": "eur", "selected": false }, { "description": "Coupe", "price": 0, "cur": "eur", "selected": false }, { "description": "Décoloration/Coloration", "price": 0, "cur": "eur", "selected": false }, { "description": "Défrisage", "price": 0, "cur": "eur", "selected": false }, { "description": "Lissage brésilien", "price": 0, "cur": "eur", "selected": false }, { "description": "Nattes", "price": 0, "cur": "eur", "selected": false }, { "description": "Nattes collées", "price": 0, "cur": "eur", "selected": false }, { "description": "Vanilles", "price": 0, "cur": "eur", "selected": false }, { "description": "Piqué-laché", "price": 0, "cur": "eur", "selected": false }, { "description": "Locks", "price": 0, "cur": "eur", "selected": false }, { "description": "Fausses locks", "price": 0, "cur": "eur", "selected": false }, { "description": "Crochets", "price": 0, "cur": "eur", "selected": false }, { "description": "Tissage Ouvert", "price": 0, "cur": "eur", "selected": false }, { "description": "Tissage Fermé", "price": 0, "cur": "eur", "selected": false }, { "description": "Tissage Invisible (américain)", "price": 0, "cur": "eur", "selected": false }, { "description": "Tissage U part", "price": 0, "cur": "eur", "selected": false }, { "description": "Pose de closure", "price": 0, "cur": "eur", "selected": false }, { "description": "Pose de closure élastic band", "price": 0, "cur": "eur", "selected": false }, { "description": "Pose Lace Frontale", "price": 0, "cur": "eur", "selected": false }, { "description": "Pose perruque", "price": 0, "cur": "eur", "selected": false }, { "description": "Retrait tissage", "price": 0, "cur": "eur", "selected": false }, { "description": "Extension de cils pose classique", "price": 0, "cur": "eur", "selected": false }, { "description": "Extension de cils pose mixte", "price": 0, "cur": "eur", "selected": false }, { "description": "Extension de cils pose volume russe", "price": 0, "cur": "eur", "selected": false }, { "description": "Remplissage classique", "price": 0, "cur": "eur", "selected": false }, { "description": "Remplissage mixte", "price": 0, "cur": "eur", "selected": false }, { "description": "Remplissage volume russe", "price": 0, "cur": "eur", "selected": false }, { "description": "Dépose extensions et faux cils", "price": 0, "cur": "eur", "selected": false }, { "description": "Manucure –pédicure simple", "price": 0, "cur": "eur", "selected": false }, { "description": "Manucure – pédicure semi permanent", "price": 0, "cur": "eur", "selected": false }, { "description": "Pose de vernis simple (Mains)", "price": 0, "cur": "eur", "selected": false }, { "description": "Pose vernis semi permanent (Mains)", "price": 0, "cur": "eur", "selected": false }, { "description": "Pose gel avec capsule (Mains)", "price": 0, "cur": "eur", "selected": false }, { "description": "Extension au gel (chablon) (Mains)", "price": 0, "cur": "eur", "selected": false }, { "description": "Nail art (Mains)", "price": 0, "cur": "eur", "selected": false }, { "description": "Pose de vernis simple (Pieds)", "price": 0, "cur": "eur", "selected": false }, { "description": "Pose vernis semi permanent (Pieds)", "price": 0, "cur": "eur", "selected": false }, { "description": "Pose gel avec capsule (Pieds)", "price": 0, "cur": "eur", "selected": false }, { "description": "Extension au gel (chablon) (Pieds)", "price": 0, "cur": "eur", "selected": false }, { "description": "Nail art (Pieds)", "price": 0, "cur": "eur", "selected": false }, { "description": "Maquillage jour", "price": 0, "cur": "eur", "selected": false }, { "description": "Maquillage soir", "price": 0, "cur": "eur", "selected": false }, { "description": "Tatouage au henné naturel", "price": 0, "cur": "eur", "selected": false }, { "description": "Tatouage au Jagua", "price": 0, "cur": "eur", "selected": false }, { "description": "Mariage", "price": 0, "cur": "eur", "selected": false }] }];

        BookingsService.getProviders($scope.filterCategory).then(function(providers) {
            $scope.popular_providers = providers;
        });






    })
    /*

        //Shopping
    .controller('ShopCtrl', function($scope, ShopService) {
      $scope.products = [];
      $scope.popular_products = [];

      ShopService.getProducts().then(function(products){
        $scope.products = products;
      });



      ShopService.getProducts().then(function(products){
        $scope.popular_products = products.slice(0, 2);
      });
    })


    .controller('ShoppingCartCtrl', function($scope, ShopService, $ionicActionSheet, _) {
      $scope.products = ShopService.getCartProducts();

      $scope.removeProductFromCart = function(product) {
        $ionicActionSheet.show({
          destructiveText: 'Remove from cart',
          cancelText: 'Cancel',
          cancel: function() {
            return true;
          },
          destructiveButtonClicked: function() {
            ShopService.removeProductFromCart(product);
            $scope.products = ShopService.getCartProducts();
            return true;
          }
        });
      };

      $scope.getSubtotal = function() {
        return _.reduce($scope.products, function(memo, product){ return memo + product.price; }, 0);
      };


    })
     */


.controller('CheckoutCtrl', function($scope) {
    //$scope.paymentDetails;
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