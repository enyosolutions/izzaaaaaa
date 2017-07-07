angular.module('izza.app.services', [])



.service('RemoteDirectory', function() {
    //this.api_url =  'https://localhost:8443';
    //this.api_url = "https://001.izza.co";
    // this.api_url = "http://dev.olivierlinsicheng.com:8093";
    this.api_url = "http://alphalabx.com:3000";

    //this.api_url =  'https://192.168.1.2:8443';
    // this.api_url =  'http://localhost:3000';

    this.getAPISrvURL = function() {
        return this.api_url;
    };

    this.setAPISrvURL = function(url) {
        this.api_url = url;
    };

})

.service('AuthService', function() {

    //For
    // - Saving a user

    this.saveUser = function(user) {
        window.localStorage.izza_user = JSON.stringify(user);
    };

    this.getLoggedUser = function() {

        return (window.localStorage.izza_user) ?
            JSON.parse(window.localStorage.izza_user) : null;
    };

})

.service('currentProvider', function() {

    _.cloneDeep

    this.bufferProvider = {};
    this.currentProvider = {};

    this.bufferProvider = function() {
        return _.cloneDeep(this.bufferProvider);
    };

    this.setbufferProvider = function(provider) {

        this.bufferProvider = _.cloneDeep(provider);

    };

    this.currentProvider = function() {
        return _.cloneDeep(this.currentProvider);
    };

    this.setcurrentProvider = function(provider) {

        this.currentProvider = _.cloneDeep(provider);
    };
})


.service('BookingsService', function($http, $q, _, RemoteDirectory) {

    //For:
    // - getting providers.
    // - create booking for a provider.


    this.getReservations = function(useremail) {
        var dfd = $q.defer();
        var url = RemoteDirectory.getAPISrvURL() + '/api/reservations/byemail/' + encodeURIComponent(useremail);
        console.log('Loading res from:' + url);
        $http.get(url).success(function(database) {
            dfd.resolve(database);
            console.log("resolved database getting reservations.");
        }).error(function(err) {
            console.log('Error loading reservations...' + err);
        })

        ;
        return dfd.promise;
    };
    this.getCategories = function() {
          var url = RemoteDirectory.getAPISrvURL() + '/api/categories';
          var cats= $http.get(url);
          return cats;
    };
  
    this.getAllProviders = function() {
        var url = RemoteDirectory.getAPISrvURL() + '/api/providers';
        provs = $http.get(url);
        return provs;
    };
  
    this.getProviders = function(subcategoryName) {
        var url = RemoteDirectory.getAPISrvURL() + '/api/providers/bysubcategory/' + encodeURIComponent(subcategoryName);
        provs = $http.get(url);
        return provs;
    };

    this.cancelBooking = function(res_id) {
        var dfd = $q.defer();
        var url = RemoteDirectory.getAPISrvURL() + '/api/reservations/cancelres/' + encodeURIComponent(res_id);
        console.log('Loading res from:' + url);
        $http.get(url).success(function(result) {
            dfd.resolve(result);
            console.log("cancelBooking api call OK.");
            if (result.error) {
                console.log("cancelBooking api call NOK." + result.error);

            } else {
                console.log('"cancelBooking api call OK...' + result);

            }
        }).error(function(err) {
            console.log('"cancelBooking api call NOK...' + err);
        })

        ;
        return dfd.promise;
    };


    this.updateBookingCompleted = function(res_id, isCompleted) {
        var dfd = $q.defer();
        //var toPost = JSON.stringify(bookingInfo);
        var toPost = { "completed": isCompleted, "res_id": res_id };

        var url = RemoteDirectory.getAPISrvURL() + '/api/reservations/compbook';

        $http.post(url, toPost).success(function(database) {
            if (database.error) {
                console.log("Error flagging reservation as completed: " + database.error);
                dfd.resolve(database);
            } else if (database.status === 'error') {
                dfd.resolve(database);
            } else {
                dfd.resolve(database);
            }

        }).error(function(err) {
            if (err) {
                console.log("Error creating reservation: " + err.message);
            }

        });
        return dfd.promise;

    };

    this.createBookingForProvider = function(bookingInfo) {
        var dfd = $q.defer();
        var toPost = JSON.stringify(bookingInfo);

        //$http.get('database.json').success(function(database) {

        //var hostname = 'http://799836ab.ngrok.io';
        //var hostname = 'http://001.izza.co';
        var hostname = 'http://localhost:3000';
        //var hostname = 'http://dev001.invicti.eu';

        var url = RemoteDirectory.getAPISrvURL() + '/api/reservations/createreservation';

        $http.post(url, toPost).success(function(database) {
            if (database.error) {
                console.log("Error creating reservation: " + database.error);
                dfd.resolve(database);
            } else if (database.status === 'error') {
                dfd.resolve(database);
            } else {
                dfd.resolve(database);
            }

        }).error(function(err) {
            if (err) {
                console.log("Error creating reservation: " + err.message);
            }

        });
        return dfd.promise;

    };

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

});
