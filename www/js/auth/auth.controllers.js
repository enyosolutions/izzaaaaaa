angular.module('izza.auth.controllers', ['ionic', 'ngStorage'])

.controller('AuthCtrl', function($scope){

})

.controller('WelcomeCtrl', function($scope, $ionicModal, show_hidden_actions, $state){

	$scope.show_hidden_actions = show_hidden_actions;

	$scope.toggleHiddenActions = function(){
		$scope.show_hidden_actions = !$scope.show_hidden_actions;
	};

	$scope.facebookSignIn = function(){
		console.log("doing facebbok sign in");
		$state.go('app.book.home');
	};

	$ionicModal.fromTemplateUrl('views/app/legal/privacy-policy.html', {
            scope: $scope,
            animation: 'slide-in-up'
          }).then(function(modal) {
            $scope.privacy_policy_modal = modal;
          });

	$ionicModal.fromTemplateUrl('views/app/legal/terms-of-service.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.terms_of_service_modal = modal;
  });

  $scope.showPrivacyPolicy = function() {
    $scope.privacy_policy_modal.show();
  };

	$scope.showTerms = function() {
    $scope.terms_of_service_modal.show();
  };
})

.controller('LogInCtrl', function($scope, $state, $stateParams, $localStorage, AuthService){
        $scope.user = {email: '', password: ''};
	$scope.doLogIn = function(){
                console.log($scope.user);
                AuthService.authenticateUser($scope.user).then(function(response){ 
                if (response.success) {
                    $localStorage.token = response.data.token;
                    console.log($localStorage);
                    $state.go('app.book.home');
                } else {
                    console.log("Error " + response.status);
                }
            });
            //$state.go('app.book.home');
	};
})

.controller('SignUpCtrl', function($scope, $state, $q, $stateParams, AuthService){
        $scope.newUser = {
            firstname: "",
            lastname: "",
            email: "",
            password: "",
            address: "",
            address2: "",
            phone: "",
            platform: "",
            deviceid: ""
        };
        $scope.newUser.platform = ionic.Platform.platform();
        $scope.newUser.deviceid = '12345foo';
	$scope.doSignUp = function(){
            $state.go('auth.signup_info', { userInfo: $scope.newUser});
	};
})

.controller('SignUpInfoCtrl', function($scope, $state, $q, $stateParams, AuthService){
        $scope.newUser = $stateParams.userInfo;
        console.log($scope.newUser);
        $scope.doSignUp = function(){
            console.log($scope.newUser);
            AuthService.createUser($scope.newUser).then(function(response){ 
                if (response.success) {
                    console.log("Yay, you're signed up!" + response.data);
                    $state.go('auth.login', {obj: {email: $scope.newUser.email}});
                } else {
                    console.log("Error " + response.status);
                }
            });
	};
})

.controller('ForgotPasswordCtrl', function($scope, $state, $q){
	$scope.requestNewPassword = function() {
                console.log("requesting new password");
		$state.go('app.book.home');
  };
})

;
