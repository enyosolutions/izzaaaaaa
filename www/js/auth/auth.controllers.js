angular.module('izza.auth.controllers', ['ionic', 'ngStorage'])

  .controller('AuthCtrl', function ($scope) {

  })

  .controller('WelcomeCtrl', function ($scope, $ionicModal, show_hidden_actions, $state) {

    $scope.show_hidden_actions = show_hidden_actions;

    $scope.toggleHiddenActions = function () {
      $scope.show_hidden_actions = !$scope.show_hidden_actions;
    };

    $scope.facebookSignIn = function () {
      console.log("doing facebbok sign in");
      $state.go('app.book.home');
    };

    $ionicModal.fromTemplateUrl('views/app/legal/privacy-policy.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function (modal) {
      $scope.privacy_policy_modal = modal;
    });

    $ionicModal.fromTemplateUrl('views/app/legal/terms-of-service.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function (modal) {
      $scope.terms_of_service_modal = modal;
    });

    $scope.showPrivacyPolicy = function () {
      $scope.privacy_policy_modal.show();
    };

    $scope.showTerms = function () {
      $scope.terms_of_service_modal.show();
    };
  })

  .controller('LogInCtrl', function ($scope, $state, $ionicPopup, $stateParams, $localStorage, AuthService, $q, UserService, $ionicLoading, ProfileService) {
    $scope.user = { email: "", password: "" };
    $scope.doLogIn = function () {
      if(!$scope.user.email || !$scope.user.password){
        return $ionicPopup.alert({title:"Erreur", template:"Merci de saisir votre email et votre mot de passe"});
      }

      AuthService.authenticateUser($scope.user).then(function (response) {
        if (response.success) {
          $localStorage.token = response.data.token;
          $localStorage.customer_id = response.data.id;
          $localStorage.stripe_id = response.data.stripeid;
          ProfileService.getProfile($localStorage.customer_id)
            .success(function (response) {
              $localStorage.profile = response;
              console.log(response);
            })
            .error(function (error) {
              console.log('Error ' + error);
            });
          console.log($localStorage.profile);
          $state.go('app.book.home');
        } else {
          console.log("Error " + response.status);
          if (response.status == 403) {
            $scope.error = "Votre email ou votre mot de passe est incorrect";
          }
        }

      });
      //$state.go('app.book.home');
    };

    // If redirected from Register. Automatic Login with credentials passed from sighup controller
    if ($stateParams.userInfo) {
      $scope.user = { email: $stateParams.userInfo.email, password: $stateParams.userInfo.password };
      $scope.doLogIn();
    }

    // Facebook login
    // This is the success callback from the login method
    var fbLoginSuccess = function (response) {
      if (!response.authResponse) {
        fbLoginError("Cannot find the authResponse");
        return;
      }

      var authResponse = response.authResponse;

      getFacebookProfileInfo(authResponse)
        .then(function (profileInfo) {
          // For the purpose of this example I will store user data on local storage
          UserService.setUser({
            authResponse: authResponse,
            userID: profileInfo.id,
            name: profileInfo.name,
            email: profileInfo.email,
            picture: "http://graph.facebook.com/" + authResponse.userID + "/picture?type=large"
          });
          $ionicLoading.hide();
          $state.go('app.home');
        }, function (fail) {
          // Fail get profile info
          console.log('profile info fail', fail);
        });
    };

    // This is the fail callback from the login method
    var fbLoginError = function (error) {
      console.log('fbLoginError', error);
      $ionicLoading.hide();
    };

    // This method is to get the user profile info from the facebook api
    var getFacebookProfileInfo = function (authResponse) {
      var info = $q.defer();

      facebookConnectPlugin.api('/me?fields=email,name&access_token=' + authResponse.accessToken, null,
        function (response) {
          console.log(response);
          info.resolve(response);
        },
        function (response) {
          console.log(response);
          info.reject(response);
        }
      );
      return info.promise;
    };

    //This method is executed when the user press the "Login with facebook" button
    $scope.facebookSignIn = function () {
      facebookConnectPlugin.getLoginStatus(function (success) {
        if (success.status === 'connected') {
          // The user is logged in and has authenticated your app, and response.authResponse supplies
          // the user's ID, a valid access token, a signed request, and the time the access token
          // and signed request each expire
          console.log('getLoginStatus', success.status);

          // Check if we have our user saved
          var user = UserService.getUser('facebook');

          if (!user.userID) {
            getFacebookProfileInfo(success.authResponse)
              .then(function (profileInfo) {
                // For the purpose of this example I will store user data on local storage
                UserService.setUser({
                  authResponse: success.authResponse,
                  userID: profileInfo.id,
                  name: profileInfo.name,
                  email: profileInfo.email,
                  picture: "http://graph.facebook.com/" + success.authResponse.userID + "/picture?type=large"
                });

                $state.go('app.home');
              }, function (fail) {
                // Fail get profile info
                console.log('profile info fail', fail);
              });
          } else {
            $state.go('app.home');
          }
        } else {
          // If (success.status === 'not_authorized') the user is logged in to Facebook,
          // but has not authenticated your app
          // Else the person is not logged into Facebook,
          // so we're not sure if they are logged into this app or not.

          console.log('getLoginStatus', success.status);

          $ionicLoading.show({
            template: 'Logging in...'
          });

          // Ask the permissions you need. You can learn more about
          // FB permissions here: https://developers.facebook.com/docs/facebook-login/permissions/v2.4
          facebookConnectPlugin.login(['email', 'public_profile'], fbLoginSuccess, fbLoginError);
        }
      });
    };

  })

  .controller('SignUpCtrl', function ($scope, $state, $q, $ionicPopup, $stateParams, AuthService, $cordovaDevice, $ionicPlatform) {
    $ionicPlatform.ready(function () {
      if (window.cordova) {
        $scope.deviceUuid = $cordovaDevice.getUUID();
      }
      else {
        $scope.deviceUuid = "BROWSER" + new Date();
      }
    });
    $scope.newUser = {
      title: "",
      firstname: "",
      lastname: "",
      email: "",
      password: "",
      address: "",
      address2: "",
      phone: "",
      platform: ionic.Platform.platform(),
      deviceid: $scope.deviceUuid
    };
    $scope.doSignUp = function () {
      if(!$scope.newUser.email || !$scope.newUser.password){
        return $ionicPopup.alert({title:"Erreur", template:"Merci de saisir votre email et votre mot de passe"});
      }
      $state.go('auth.signup_info', { userInfo: $scope.newUser });
    };
  })

  .controller('SignUpInfoCtrl', function ($scope, $state, $q, $stateParams, AuthService) {
    $scope.newUser = $stateParams.userInfo;
    console.log($scope.newUser);
    $scope.doSignUp = function () {
      console.log($scope.newUser);
      AuthService.createUser($scope.newUser).then(function (response) {
        if (response.success) {
          console.log("Yay, you're signed up!" + response.data);
          $state.go('auth.login', { userInfo: { email: $scope.newUser.email, password: $scope.newUser.password } });
        } else {
          console.log("Error " + response.status);
        }
      });
    };
  })

  .controller('ForgotPasswordCtrl', function ($scope, $state, $q, AuthService) {
    $scope.user = {email: ''};
    $scope.requestNewPassword = function () {

      console.log($scope.user.email);
      // $state.go('app.book.home');
      AuthService.requestPwd($scope.user.email).then(function (response) {
        if (response.success) {
          console.log(response);
        } else {
          console.log("Error " + response.status);
        }
      });
    };
  })
