Groups = new Mongo.Collection("groups", {
    transform: function (doc) {
        doc.owner = Meteor.users.findOne({
            _id: doc.owner
        }, {fields: {emails: 1, profile: 1}});
        return doc;
    }
});
//var Schemas = {};
//Schemas.Group = new SimpleSchema({
//    owner: {
//        type: String,
//        label: "Owner's user id"
//    },
//    name: {
//        type: String,
//        label: "Name"
//    },
//    image: {
//        type: Object,
//        optional: true,
//        label: "Group's logo"
//    },
//    users: {
//        type: [String],
//        optional: true,
//        label: "Users added to group"
//    }
//});

Groups.attachSchema(new SimpleSchema({
    owner: {
        type: String,
        label: "Owner's user id"
    },
    name: {
        type: String,
        label: "Name"
    },
    image: {
        type: FS.File,
        optional: true,
        label: "Group's logo"
    },
    users: {
        type: [String],
        optional: true,
        label: "Users added to group"
    }
}));

Meteor.methods({
    addUser: function (userId, groupId) {
        check(userId, nonEmptyString);
        check(groupId, nonEmptyString);
        var user = Meteor.users.findOne(userId);
        var group = Groups.findOne(groupId);
        if (!user)
            throw new Meteor.Error(404, "No such user");
        if (!group)
            throw new Meteor.Error(404, "No such group");
        Meteor.users.update(userId, {$addToSet: {groups: groupId}});
        Groups.update(groupId, {$addToSet: {users: userId}});
    },
    addGroup: function (group) {
        // TODO add check for group
        Groups.insert(group);
    }
});



var nonEmptyString = Match.Where(function (x) {
    check(x, String);
    return x.length > 0;
});