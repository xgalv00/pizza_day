angular.module("pizzaDayApp").controller("ResetCtrl", ['$meteor', '$state',
    function ($meteor, $state) {
        var vm = this;

        vm.credentials = {
            email: ''
        };

        vm.error = '';

        vm.reset = function () {
            debugger;
            $meteor.forgotPassword(vm.credentials).then(
                function () {
                    $state.go('app.login');
                },
                function (err) {
                    vm.error = 'Error sending forgot password email - ' + err;
                }
            );
        };
    }
]);
