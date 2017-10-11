angular.module('izza.app.services', [])

.service('sharedFunctions', function($state, $ionicHistory) {
    this.goHome = function() {
        $ionicHistory.nextViewOptions({
            disableAnimate: true,
            historyRoot: true
        });
        $state.go('app.book.home');
    }

    this.goToBookings = function() {
        $ionicHistory.nextViewOptions({
            disableAnimate: true,
            historyRoot: true
        });
        $state.go('app.bookings.home');
    }
})

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

.service('AuthService', function($http, $q, _, RemoteDirectory) {

    //For
    // - Saving a user

    this.saveUser = function(user) {
        window.localStorage.izza_user = JSON.stringify(user);
    };

    this.getLoggedUser = function() {

        return (window.localStorage.izza_user) ?
            JSON.parse(window.localStorage.izza_user) : null;
    };
    this.authenticateUser = function(user) {
        var url = RemoteDirectory.getAPISrvURL() + '/api/customer/signin';
        return $http.post(url, user).then(this.handleSuccess, this.handleError);
    }
    this.createUser = function(user) {
        var url = RemoteDirectory.getAPISrvURL() + '/api/customer/signup';
        return $http.post(url, user).then(this.handleSuccess, this.handleError);
    }

    this.requestPwd = function(email) {
        var url = RemoteDirectory.getAPISrvURL() + '/api/customer/reqresetpwd';
        return $http.post(url, email).then(this.handleSuccess, this.handleError);
    }

    this.handleSuccess = function(response) {
        //console.log(res);
        return {success: true, status: response.status, data: response.data};
    }

    this.handleError = function(response) {
        //console.log(res);
        return {success: false, status: response.status, data: response.data};
    }

})

.service('UserService', function() {
  // For the purpose of this example I will store user data on ionic local storage but you should save it on a database
  var setUser = function(user_data) {
    window.localStorage.starter_facebook_user = JSON.stringify(user_data);
  };

  var getUser = function(){
    return JSON.parse(window.localStorage.starter_facebook_user || '{}');
  };

  return {
    getUser: getUser,
    setUser: setUser
  };
})


.service('ProfileService', function($http, $q, _, RemoteDirectory) {
    this.getProfile = function(customer_id) {
        var url = RemoteDirectory.getAPISrvURL() + '/api/customer/' + encodeURIComponent(customer_id);
        provs = $http.get(url);
        return provs;
    };

})


.service('BookingsService', function($http, $q, _, RemoteDirectory, $cordovaGeolocation) {

    //For:
    // - getting providers.
    // - create booking for a provider.


    this.getReservations = function(customer_id) {
        var url = RemoteDirectory.getAPISrvURL() + '/api/appointments/bycustomer/' + encodeURIComponent(customer_id);
        provs = $http.get(url);
        return provs;
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

    this.getProviders = function(idService) {
        var posOptions = {timeout: 10000, enableHighAccuracy: false};
        $cordovaGeolocation
        .getCurrentPosition(posOptions)
        .then(function (position) {
           var lat  = position.coords.latitude
           var long = position.coords.longitude
           console.log(lat + '   ' + long)
        }, function(err) {
           console.log(err)
        });

        var url = RemoteDirectory.getAPISrvURL() + '/api/providers/byservice/' + encodeURIComponent(idService);
        provs = $http.get(url);
        console.log("in getProviders: " + idService);
        console.log("in getProviders: " + JSON.stringify(provs));
        return provs;
    };

    this.getFees = function(fees_info) {
        var url = RemoteDirectory.getAPISrvURL() + '/api/appointment/checkfee/';
        provs = $http.post(url, fees_info);
        return provs;
    };

    this.sendCard = function (card_info) {
        var url = RemoteDirectory.getAPISrvURL() + '/api/stripe/card';
        var provs = $http.post(url, card_info);
        return provs;

    }
    this.getCards = function(stripe_id) {
        var url = RemoteDirectory.getAPISrvURL() + '/api/stripe/cards/' + encodeURIComponent(stripe_id);
        provs = $http.get(url);
        return provs;
    };
    this.createCharge = function(charge) {
        var url = RemoteDirectory.getAPISrvURL() + '/api/stripe/charge';
        $http.post(url, charge)
            .then(
                function(response){
                    console.log("Success!");
                },
                function(response){
                    console.log("Failed!");
                }
            );
    }
    this.createReservation = function(reservation) {
        var url = RemoteDirectory.getAPISrvURL() + '/api/appointment';
        var promise = $http.post(url, reservation);
        promise.then(
                function(response){
                    console.log("Success!");
                },
                function(response){
                    console.log("Failed!");
                }
            );
        return promise;
    }
    this.cancelBooking = function(res_id) {
        var url = RemoteDirectory.getAPISrvURL() + '/api/appointment/cancel/' + encodeURIComponent(res_id);
        console.log('Loading res from:' + url);
        var promise = $http.put(url);
        promise
            .then(
                function(response){
                    console.log("Success!");
                },
                function(error){
                    console.log("Failed!");
                    console.log(error);
                }
            );
        return promise;
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
})
