Utils = {
    checkIsOwner: (group) => {
        var userId = Meteor.userId();
        if (!(userId && userId == group.owner))
            throw new Meteor.Error(403, "User is not owner");
    },
    checkIsInGroup: (group) => {
        var userId = Meteor.userId();
        if (!(userId && _.contains(group.users, userId)))
            throw new Meteor.Error(403, "User is not in group");
    },
    checkIsBelongToUser: (userIdFromObj) => {
        var userId = Meteor.userId();
        if (!(userId && userIdFromObj == userId))
            throw new Meteor.Error(403, "You are not owner of this object");
    },
    getOr404: (collection, selector, msgVar) => {
        var test = collection.findOne(selector);
        if (!test)
            throw new Meteor.Error(404, "No such " + msgVar);
        return test;
    },
    stringToDate: (_date, _format, _delimiter) => {
        if (!_date) {
            var now = new Date();
            return new Date(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), now.getUTCHours());
        }
        var formatLowerCase = _format.toLowerCase();
        var formatItems = formatLowerCase.split(_delimiter);
        var dateItems = _date.split(_delimiter);
        var monthIndex = formatItems.indexOf("mm");
        var dayIndex = formatItems.indexOf("dd");
        var yearIndex = formatItems.indexOf("yyyy");
        var month = parseInt(dateItems[monthIndex]);
        month -= 1;
        return new Date(Date.UTC(dateItems[yearIndex], month, dateItems[dayIndex], 0, 0, 0));
    },
    contactEmail: (user) => {
        if (user.emails && user.emails.length)
            return user.emails[0].address;
        if (user.services && user.services.facebook && user.services.facebook.email)
            return user.services.facebook.email;
        return null;

    }
};
