angular.module("pizzaDayApp").controller("RegisterCtrl", ['$meteor', '$state',
    function ($meteor, $state) {
        var vm = this;

        vm.credentials = {
            email: '',
            password: ''
        };

        vm.error = '';

        vm.register = function () {
            $meteor.createUser(vm.credentials).then(
                function () {
                    $state.go('app.login');
                },
                function (err) {
                    vm.error = 'Registration error - ' + err;
                }
            );
        };
    }
]);
