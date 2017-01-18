angular.module('izza.app.controllers', [])


.controller('test', function($scope, BookingsService,$localStorage) {


    $scope.profile = $localStorage.profile;

    $scope.doRefresh = function() {

        console.log("Refreshing reservations.");
        //getReservations
        if ($scope.profile){
            if ($scope.profile.profile.email){
                if ($scope.profile.profile.email!==""){
                    profileok = true;
                    BookingsService.getReservations($scope.profile.profile.email).then(function(reservations){
                        $scope.reservations = reservations;
                        console.log("got reservations from api server.");

                        $scope.$broadcast('scroll.refreshComplete');

                    });

                }
            }
            else {
                console.log("could not get reservations from api server: no email in profile.");
            }
        }
    };


    $scope.doRefresh();

        }
)


    .controller('BookSelectCtrl', function($scope, currentProvider, BookingsService,$ionicPopup,$ionicModal, $state, $ionicHistory, $localStorage, $sessionStorage) {



    }
)


      .controller('BookingsController', function($scope, currentProvider, BookingsService,$ionicPopup,$ionicModal, $state, $ionicHistory, $localStorage, $sessionStorage) {

            $scope.profile = $localStorage.profile;
            $scope.isSelected = true;


            $scope.switchCompleted = function(param,res_id) {
                  $scope.isSelected = param;
                  $scope.currentID = res_id;
                    console.log (param);
                    BookingsService.updateBookingCompleted(res_id,param);

              };


            $scope.doRefresh = function() {

            console.log("Refreshing reservations.");
            //getReservations
            if ($scope.profile){
                if ($scope.profile.profile.email){
                    if ($scope.profile.profile.email!==""){
                        profileok = true;
                        var bs = BookingsService;
                        var key = $scope.profile.profile.email;
                        //var key = "izza@invicti.eu";
                        bs.getReservations(key).then(function(reservations){
                            $scope.reservations = reservations;
                            $scope.resToJSON = JSON.stringify(reservations);
                            console.log("got reservations from api server.");

                                $scope.$broadcast('scroll.refreshComplete');

                        });

                    }
                }
                else {
                    console.log("could not get reservations from api server: no email in profile.");
                }
            }
        };


        $scope.doRefresh();


}
)
.controller("PickBookingTimeCtrl", function($scope,currentProvider, PostService, $filter, $stateParams,ionicDatePicker,ionicTimePicker, $location, $state,BookingsService, $ionicModal, $localStorage, $sessionStorage,$ionicPopup, $ionicHistory) {


        $scope.params = $stateParams;

        $scope.pickedServices = $scope.provider;


    $scope.ipObjFromTimePicker= {
        callback: function (val) {      //Mandatory
            console.log('Return value from the timepicker popup is : ' + val, new Date(val));

            if (typeof (val) === 'undefined') {
                console.log('Time not selected');
            } else {
                var selectedTimeFrom = new Date(val * 1000);
                $scope.ipObjFromTimePicker.inputEpochTime = val;
                $scope.reservation.betweenFrom = selectedTimeFrom.getUTCHours() +  'h' + (selectedTimeFrom.getUTCMinutes()?selectedTimeFrom.getUTCMinutes() +  'm':'') ;
                $scope.reservation.betweenTo = $scope.reservation.betweenFrom;

                console.log('Selected epoch is : ', val, 'and the time is ', selectedTimeFrom.getUTCHours(), 'H :', selectedTimeFrom.getUTCMinutes(), 'M');
            }
        },
        inputTime: 50400,   //Optional
        format: 24,         //Optional
        step: 15,           //Optional
        setLabel: 'Choisir'    //Optional
    };

    $scope.ipObjToTimePicker= {
        callback: function (val) {      //Mandatory
            console.log('Return value from the timepicker popup is : ' + val, new Date(val));
            if (typeof (val) === 'undefined') {

                console.log('Time not selected');

            } else {
                var selectedTimeTo = new Date(val * 1000);
                $scope.ipObjToTimePicker.inputEpochTime = val;
                $scope.reservation.betweenTo = selectedTimeTo.getUTCHours() +  'h' + (selectedTimeTo.getUTCMinutes()?selectedTimeTo.getUTCMinutes() +  'm':'') ;
                console.log('Selected epoch is : ', val, 'and the time is ', selectedTimeTo.getUTCHours(), 'H :', selectedTimeTo.getUTCMinutes(), 'M');
                console.log('Selected epoch is : ', val, 'and the time is ', selectedTimeTo.getUTCHours(), 'H :', selectedTimeTo.getUTCMinutes(), 'M');
            }
        },
        inputTime: 50400,   //Optional
        format: 24,         //Optional
        step: 15,           //Optional
        setLabel: 'Choisir'    //Optional
    };




        $scope.ipObjDatePicker = {
            callback: function (val) {  //Mandatory
                console.log('Return value from the datepicker popup is : ' + val, new Date(val));
                //var options = {weekday: "long", year: "numeric", month: "long", day: "numeric"}; ,options
                var caldate = new Date(val);
                $scope.reservation.reservation_date = caldate;
                //$scope.showdate =    caldate.toLocaleDateString("ar-EG");
                $scope.showdate =  $filter('date')(caldate, 'dd/MM/yyyy');


            },
            disabledDates: [            //Optional
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
            inputDate: new Date(),      //Optional
            mondayFirst: true,          //Optional
            disableWeekdays: [0],       //Optional
            closeOnSelect: false,       //Optional
            templateType: 'popup'       //Optional
        };

        $scope.openDatePicker = function(){
            ionicDatePicker.openDatePicker($scope.ipObjDatePicker);
        };

        $scope.openFromTimePicker = function(){
            ionicTimePicker.openTimePicker($scope.ipObjFromTimePicker);
        };
        $scope.openToTimePicker = function(){
            ionicTimePicker.openTimePicker($scope.ipObjToTimePicker);
        };

    $scope.profile = $localStorage.profile;

    $filter('date')(Date(), 'dd/MM/yyyy')

    $scope.reservation ={
        reservation_date:Date(),
        betweenFrom:"",
        betweenTo:"",

    };

    $scope.confirmBooking = function(){

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
                BookingsService.createBookingForProvider(bookingInfo).then (function(result){
                    if (!result.status.message === "success") {
                        //currentProvider.setcurrentProvider( $scope.selectedProvider);

                        $state.go('app.book.home',{},{reload: true});
                        $scope.showAlertBookError();
                    }
                    else
                    {
                        $state.go('app.book.home',{},{reload: true});
                        console.log('Reservation posted.');
                    }


                });

            });
        };


        $scope.profile = $localStorage.profile;
//TODO clear currentProvider back to full data.
        var providerAndReservedSkills = currentProvider.bufferProvider  ;
        //currentProvider.setcurrentProvider($scope.selectedProvider);


        var totalAmount = 0;
        for(var i = providerAndReservedSkills.skillsandprice.length; i--;) {
            if (!providerAndReservedSkills.skillsandprice[i].selected) {

                providerAndReservedSkills.skillsandprice.splice(i, 1);
            }
            else {
                var intprice = Number(providerAndReservedSkills.skillsandprice[i].price);
                totalAmount = totalAmount + intprice;
            }
        }
        $scope.reservation.status = 'En attente de confirmation';
        var bookingInfo = {
            providerInfo: providerAndReservedSkills,
            userInfo : $localStorage.profile,
            reservationInfo: $scope.reservation,
            serviceInfo: providerAndReservedSkills.skillsandprice,
            totalamount: totalAmount

        };
        var profileok = false;
        if (($scope.profile) && $scope.profile.profile){
            if ($scope.profile.profile.email){
                if ($scope.profile.profile.email!==""){
                    profileok = true;
                    console.log("profile loaded.");

                    //Profile loaded we ask for credit card info.
                    //And we bill 10% of total.
                    $scope.showAlertReserveOK();


                }
            }
        }
        else {
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



      $scope.navigateToProviderSchedule = function (provider) {
        //commentsPopup.close();
        //$ionicHistory.currentView($ionicHistory.backView());
         //$ionicHistory.nextViewOptions({ disableAnimate: true,historyRoot: true });
        //$state.go('app.profile.posts', {userId: 123});
          //book_addbooking/:title/:firstname/:lastname/:contact_email/:contact_mobilenb/:contact_web_site_url
        $state.go('app.book.addbooking',{provider_data:provider,
            title:provider.title,
            firstname:provider.firstname,
            lastname:provider.lastname,
            contact_email:provider.contact_email,
            contact_mobilenb:provider.contact_mobilenb,
            contact_web_site_url:provider.web_site_url
        },{reload: true}
        );//provider.contact_email


      };

      //$self.openDatePicker();
    }

)
.controller('BookProviderCtrl', function($scope, currentProvider,BookingsService, $ionicPopup, $state,ionicDatePicker) {





}
)


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


.controller('ProfileCtrl', function($scope,currentProvider, $stateParams, PostService, $localStorage, $sessionStorage, $ionicHistory, $state, $ionicScrollDelegate) {

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

  ShopService.getProduct(productId).then(function(product){
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
        { text: '', type: 'close-popup ion-ios-close-outline' },
        {
          text: 'Add to cart',
          onTap: function(e) {
            return $scope.data;
          }
        }
      ]
    });
    myPopup.then(function(res) {
      if(res)
      {
        $ionicLoading.show({ template: '<ion-spinner icon="ios"></ion-spinner><p style="margin: 5px 0 0 0;">Adding to cart</p>', duration: 1000 });
        ShopService.addProductToCart(res.product);
        console.log('Item added to cart!', res);
      }
      else {
        console.log('Popup closed');
      }
    });
  };
})


.controller('PostCardCtrl', function($scope, PostService, $ionicPopup, $state) {
  var commentsPopup = {};

  $scope.navigateToUserProfile = function(user){
    commentsPopup.close();
    $state.go('app.profile.posts', {userId: user._id});
  };

  $scope.showComments = function(post) {
    PostService.getPostComments(post)
    .then(function(data){
      post.comments_list = data;
      commentsPopup = $ionicPopup.show({
  			cssClass: 'popup-outer comments-view',
  			templateUrl: 'views/app/partials/comments.html',
  			scope: angular.extend($scope, {current_post: post}),
  			title: post.comments+' Comments',
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
    .then(function(data){
      $scope.totalPages = data.totalPages;
      $scope.posts = data.posts;

      $scope.$broadcast('scroll.refreshComplete');
    });
  };

  $scope.getNewData = function() {
    //do something to load your new data here
    $scope.$broadcast('scroll.refreshComplete');
  };

  $scope.loadMoreData = function(){
    $scope.page += 1;

    PostService.getFeed($scope.page)
    .then(function(data){
      //We will update this value in every request because new posts can be created
      $scope.totalPages = data.totalPages;
      $scope.posts = $scope.posts.concat(data.posts);

      $scope.$broadcast('scroll.infiniteScrollComplete');
    });
  };

  $scope.moreDataCanBeLoaded = function(){
    return $scope.totalPages > $scope.page;
  };

  $scope.doRefresh();

})

.controller('BookCtrl', function($scope,  currentProvider,$state, BookingsService, $ionicModal,$ionicPopup,lodash,$filter, $ionicScrollDelegate) {
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
        items: ['Brushing', 'Chignon', 'Coupe',  'Décoloration/Coloration', 'Défrisage', 'Lissage brésilien']
    };
    $scope.groups[1] = {
        name: 'Coiffure - Tresses',
        items: ['Nattes', 'Nattes Collées', 'Vanilles', 'Piqué-laché', 'Locks', 'Fausses locks', 'Crochets']
    };
    $scope.groups[2] = {
        name: 'Coiffure - Tissage et pose perruque',
        items: ['Tissage Ouvert', 'Tissage Fermé','Tissage Invisible (américain)', 'Tissage U part', 'Pose de closure',
        'Pose de closure élastic band', 'Pose Lace Frontale', 'Pose perruque', 'Retrait tissage']
    };
    $scope.groups[3] = {
        name: 'Cils',
        items: ['Extension de cils pose classique', 'Extension de cils pose mixte','Extension de cils pose volume russe',
        'Remplissage classique','Remplissage mixte','Remplissage volume russe','Dépose extensions et faux cils']
    };


    $scope.groups[4] = {
        name: 'Onglerie',
        items: ['Pose de vernis simple (Mains)', 'Pose vernis semi permanent (Mains)','Pose gel avec capsule (Mains)','Extension au gel/chablon (Mains)','Nail art (Mains)',
            'Pose de vernis simple (Pieds)', 'Pose vernis semi permanent (Pieds)','Pose gel avec capsule (Pieds)','Extension au gel/chablon  (Pieds)','Nail art  (Pieds)']
    };

/*    $scope.groups[5] = {
        name: 'Beauté des pieds',
        items: ['Pose de vernis simple', 'Pose vernis semi permanent','Pose gel avec capsule','Extension au gel (chablon)','Nail art']
    };*/

    $scope.groups[5] = {
        name: 'Maquillage',
        items: ['Maquillage jour', 'Maquillage soir']
    };

    $scope.groups[6] = {
        name: 'Henné',
        items: ['Tatouage au henné naturel (une main, deux mains, autre partie du corps)', 'Tatouage au Jagua (une main, deux mains, autre partie du corps)','Mariage' ]
    };

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
      $scope.filteredServices =[];
    $scope.workProvider=[];


        /* $scope.values=  [
           {id:1, name:"value1" },
           {id:2, name:"value2" },
           {id:3, name:"value3" }
         ];
         $scope.selectedValues= []; //initial selections
       */


    //cssClass: 'popup-outer comments-view',

    $scope.bookPerService=function(provider) {
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
        for(var i = $scope.workProvider.skillsandprice.length; i--;) {
            if ($scope.workProvider.skillsandprice[i].price === 0) {
                $scope.workProvider.skillsandprice.splice(i, 1);
            }
        }
        for (var i=0;i<$scope.workProvider.skillsandprice.length;i++)
        {
            $scope.workProvider.skillsandprice[i].selected = false;
        }

        $scope.myPopup = $ionicPopup.show(
            {
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
                                 );*///provider.contact_email
                            currentProvider.setbufferProvider($scope.workProvider);
                            return currentProvider.bufferProvider;
                         }
                     }
                ]
            });
        $scope.myPopup.then(function(provider) {
            if(provider)
            {
/*                $state.go('app.book.addbooking',{provider_data:provider,
                        bookedskills:provider.skillsandprice,
                        title:provider.title,
                        firstname:provider.firstname,
                        lastname:provider.lastname,
                        contact_email:provider.contact_email,
                        contact_mobilenb:provider.contact_mobilenb,
                        contact_web_site_url:provider.web_site_url
                    }*/
                $state.go('app.book.addbooking',{obj:provider},{reload: true}


                );//provider.contact_email

                //$ionicLoading.show({ template: '<ion-spinner icon="ios"></ion-spinner><p style="margin: 5px 0 0 0;">Adding to cart</p>', duration: 1000 });
                //ShopService.addProductToCart(res.product);
                //console.log('Item added to cart!', res);
            }
            else {
                console.log('Popup closed');
            }
        });

    };



    $scope.showDetails=function(provider) {
       // $scope.details_modal.show();
        $scope.selectedProvider = provider;


        for(var i = $scope.selectedProvider.skillsandprice.length; i--;) {
            if ($scope.selectedProvider.skillsandprice[i].price === 0) {
                $scope.selectedProvider.skillsandprice.splice(i, 1);
            }
        }
        $scope.myPopup = $ionicPopup.show(
            {
            cssClass: 'add-to-cart-popup',
            templateUrl: 'views/app/book/partials/show_skills_popup.html',
            title: 'Services disponibles',
            scope: $scope,
            buttons: [
                { text: '', type: 'close-popup ion-ios-close-outline' } /*,
                {
                    text: 'Add to cart',
                    onTap: function(e) {
                        return $scope.data;
                    }
                }*/
            ]
        });
        $scope.myPopup.then(function(res) {
            if(res)
            {
                $ionicLoading.show({ template: '<ion-spinner icon="ios"></ion-spinner><p style="margin: 5px 0 0 0;">Adding to cart</p>', duration: 1000 });
                //ShopService.addProductToCart(res.product);
                console.log('Item added to cart!', res);
            }
            else {
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
    $scope.updateQuery=function(category){

        BookingsService.getProviders(category).then(function(providers){
            $scope.providers = providers;
            if (providers.size === 0)
            {
                console.log("no providers");
            }
            else
            {
                $scope.setActive('Résultat');
                $scope.scrollTop();

            }
        });
    };




    BookingsService.getProviders($scope.filterCategory).then(function(providers){

          if (providers.error) {
              $scope.providers = {};
          }
          else {
              $scope.providers = providers;


          }

      });

    BookingsService.getProviders($scope.filterCategory).then(function(providers){
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

