angular.module('izza.app.services', [])

.service('AuthService', function (){

  this.saveUser = function(user){
    window.localStorage.izza_user = JSON.stringify(user);
  };

  this.getLoggedUser = function(){

    return (window.localStorage.izza_user) ?
      JSON.parse(window.localStorage.izza_user) : null;
  };

})

.service('PostService', function ($http, $q){

  this.getPostComments = function(post){
    var dfd = $q.defer();

    $http.get('database.json').success(function(database) {
      var comments_users = database.users;

      // Randomize comments users array
      comments_users = window.knuthShuffle(comments_users.slice(0, post.comments));

      var comments_list = [];
      // Append comment text to comments list
      comments_list = _.map(comments_users, function(user){
        var comment = {
          user: user,
          text: database.comments[Math.floor(Math.random()*database.comments.length)].comment
        };
        return comment;
      });

      dfd.resolve(comments_list);
    });

    return dfd.promise;
  };

  this.getUserDetails = function(userId){
    var dfd = $q.defer();

    $http.get('database.json').success(function(database) {
      //find the user
      var user = _.find(database.users, function(user){ return user._id == userId; });
      dfd.resolve(user);
    });

    return dfd.promise;
  };

  this.getUserPosts = function(userId){
    var dfd = $q.defer();

    $http.get('database.json').success(function(database) {

      //get user posts
      var userPosts =  _.filter(database.posts, function(post){ return post.userId == userId; });
      //sort posts by published date
      var sorted_posts = _.sortBy(userPosts, function(post){ return new Date(post.date); });

      //find the user
      var user = _.find(database.users, function(user){ return user._id == userId; });

      //add user data to posts
      var posts = _.each(sorted_posts.reverse(), function(post){
        post.user = user;
        return post;
      });

      dfd.resolve(posts);
    });

    return dfd.promise;
  };

  this.getUserLikes = function(userId){
    var dfd = $q.defer();

    $http.get('database.json').success(function(database) {
      //get user likes
      //we will get all the posts
      var slicedLikes = database.posts.slice(0, 4);
      // var sortedLikes =  _.sortBy(database.posts, function(post){ return new Date(post.date); });
      var sortedLikes =  _.sortBy(slicedLikes, function(post){ return new Date(post.date); });

      //add user data to posts
      var likes = _.each(sortedLikes.reverse(), function(post){
        post.user = _.find(database.users, function(user){ return user._id == post.userId; });
        return post;
      });

      dfd.resolve(likes);

    });

    return dfd.promise;

  };

  this.getFeed = function(page){

    var pageSize = 5, // set your page size, which is number of records per page
        skip = pageSize * (page-1),
        totalPosts = 1,
        totalPages = 1,
        dfd = $q.defer();

    $http.get('database.json').success(function(database) {

      totalPosts = database.posts.length;
      totalPages = totalPosts/pageSize;

      var sortedPosts =  _.sortBy(database.posts, function(post){ return new Date(post.date); }),
          postsToShow = sortedPosts.slice(skip, skip + pageSize);

      //add user data to posts
      var posts = _.each(postsToShow.reverse(), function(post){
        post.user = _.find(database.users, function(user){ return user._id == post.userId; });
        return post;
      });

      dfd.resolve({
        posts: posts,
        totalPages: totalPages
      });
    });

    return dfd.promise;
  };
})


.service('BookService', function ($http, $q, _){

      this.getProviders = function(categoryName){
        var dfd = $q.defer();
        //$http.get('database.json').success(function(database) {
        $http.get('http://001.izza.co/api/providers/bycategory/' + encodeURIComponent(categoryName)).success(function(database) {
          dfd.resolve(database);
        });
        return dfd.promise;
      };
  
      this.createBookingForProvider = function (bookingInfo)
      {
        var dfd = $q.defer();
          var toPost = JSON.stringify(bookingInfo);

        //$http.get('database.json').success(function(database) {
      
        $http.post('http://001.izza.co/api/reservations/createreservation',toPost).success(function(database) {
          dfd.resolve(database);
        });
        return dfd.promise;
        
      }
  
  /*

      this.getProvider = function(providerId){
        var dfd = $q.defer();
        $http.get('database.json').success(function(database) {
          var provider = _.find(database.providers, function(provider){ return provider._id == providerId; });

          dfd.resolve(provider);
        });
        return dfd.promise;
      };

      this.addProviderToBooking = function(providerToAdd){
        var booking_providers = !_.isUndefined(window.localStorage.ionTheme1_cart) ? JSON.parse(window.localStorage.ionTheme1_cart) : [];

        //check if this product is already saved
        var existing_provider = _.find(booking_providers, function(provider){ return provider._id == providerToAdd._id; });

        if(!existing_provider){
          booking_providers.push(providerToAdd);
        }

        window.localStorage.ionTheme1_cart = JSON.stringify(booking_providers);
      };

      this.getBookingProviders = function(){
        return JSON.parse(window.localStorage.ionTheme1_cart || '[]');
      };

      this.removeProviderFromBooking = function(providerToRemove){
        var booking_providers = JSON.parse(window.localStorage.ionTheme1_cart);

        var new_booking_providers = _.reject(booking_providers, function(provider){ return provider._id == providerToRemove._id; });

        window.localStorage.ionTheme1_cart = JSON.stringify(new_booking_providers);
      };
      */

    })

.service('ShopService', function ($http, $q, _){

  this.getProducts = function(){
    var dfd = $q.defer();
    $http.get('database.json').success(function(database) {
      dfd.resolve(database.products);
    });
    return dfd.promise;
  };

  this.getProduct = function(productId){
    var dfd = $q.defer();
    $http.get('database.json').success(function(database) {
      var product = _.find(database.products, function(product){ return product._id == productId; });

      dfd.resolve(product);
    });
    return dfd.promise;
  };

  this.addProductToCart = function(productToAdd){
    var cart_products = !_.isUndefined(window.localStorage.ionTheme1_cart) ? JSON.parse(window.localStorage.ionTheme1_cart) : [];

    //check if this product is already saved
    var existing_product = _.find(cart_products, function(product){ return product._id == productToAdd._id; });

    if(!existing_product){
      cart_products.push(productToAdd);
    }

    window.localStorage.ionTheme1_cart = JSON.stringify(cart_products);
  };

  this.getCartProducts = function(){
    return JSON.parse(window.localStorage.ionTheme1_cart || '[]');
  };

  this.removeProductFromCart = function(productToRemove){
    var cart_products = JSON.parse(window.localStorage.ionTheme1_cart);

    var new_cart_products = _.reject(cart_products, function(product){ return product._id == productToRemove._id; });

    window.localStorage.ionTheme1_cart = JSON.stringify(new_cart_products);
  };

});
