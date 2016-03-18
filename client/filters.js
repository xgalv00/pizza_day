angular.module('pizzaDayApp').filter('displayName', function () {
    return function (user) {
        if (!user)
            return;
        if (user.profile && user.profile.name)
            return user.profile.name;
        else if (user.emails)
            return user.emails[0].address;
        else
            return user;
    }
});

angular.module('pizzaDayApp').filter('showAddToGroup', function (owner_groups_ids) {
    return function (user) {
        console.log(user._id);
        console.log(owner_groups_ids);
        return true;
    }
});
