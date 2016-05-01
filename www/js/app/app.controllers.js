angular.module('izza.app.controllers', [])




.controller('BookingsCtrl', function($scope, PostService, $ionicPopup,$ionicModal, $state, $ionicHistory) {

    }
)
.controller('PickBookingTimeCtrl', function($scope, PostService, $filter, $stateParams,ionicDatePicker, $location, $state,BookService, $ionicModal, $localStorage, $sessionStorage,$ionicPopup, $ionicHistory) {


         $scope.params = $stateParams;

        var ipObj1 = {
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
            ionicDatePicker.openDatePicker(ipObj1);
        };

    $scope.profile = $localStorage.profile;

    $filter('date')(Date(), 'dd/MM/yyyy')

    $scope.reservation ={
        reservation_date:Date(),
        betweenFrom:"",
        betweenTo:"",

    };

    $scope.confirmBooking = function(){

        $scope.profile = $localStorage.profile;
        var bookingInfo = {
            providerInfo: $scope.params,
            userInfo : $localStorage.profile,
            reservationInfo: $scope.reservation

        };
        var profileok = false;
        if ($scope.profile){
            if ($scope.profile.profile.email){
                if ($scope.profile.profile.email!==""){
                    profileok = true;

                }
            }
        }
        else {
            profileok = false;
        }


        if (profileok){
            BookService.createBookingForProvider(bookingInfo);
            $state.go('app.book.home');

        }
        else
        {
            $state.go('app.profile.home');
        }


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
        }
        );//provider.contact_email


      };

      //$self.openDatePicker();
    }

)
.controller('BookProviderCtrl', function($scope, PostService, $ionicPopup, $state,ionicDatePicker) {





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


.controller('ProfileCtrl', function($scope, $stateParams, PostService, $localStorage, $sessionStorage, $ionicHistory, $state, $ionicScrollDelegate) {

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

.controller('BookCtrl', function($scope,  $state, BookService) {


      $scope.filterCategory = "Toutes";
      $scope.providers = [];
      $scope.popular_providers = [];

  $scope.values=  [
    {id:1, name:"value1" },
    {id:2, name:"value2" },
    {id:3, name:"value3" }
  ];
  $scope.selectedValues= []; //initial selections

    $scope.updateQuery=function(category){

        BookService.getProviders(category).then(function(providers){
            $scope.providers = providers;
            if (providers.size === 0)
            {
                console.log("no providers");
            }
        });
    };

      BookService.getProviders($scope.filterCategory).then(function(providers){
        $scope.providers = providers;
      });

      BookService.getProviders($scope.filterCategory).then(function(providers){
        $scope.popular_providers = providers.slice(0, 2);
      });






    })
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



;
