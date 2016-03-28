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
    image_url: {
        type: String,
        optional: true,
        label: "Image url on file system"
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
        let user = Utils.getOr404(Meteor.users, userId, "user");
        let group = Utils.getOr404(Groups, userId, "group");
        Utils.checkIsOwner(group);
        Meteor.users.update(userId, {$addToSet: {groups: groupId}});
        Groups.update(groupId, {$addToSet: {users: userId}});
    },
    removeUser: function (userId, groupId) {
        let user = Utils.getOr404(Meteor.users, userId, "user");
        let group = Utils.getOr404(Groups, userId, "group");
        Utils.checkIsOwner(group);
        Meteor.users.update(userId, {$pull: {groups: groupId}});
        Groups.update(groupId, {$pull: {users: userId}});
    },
    addGroup: function (group) {
        // TODO add check for group
        if (!this.userId) {
            throw new Meteor.Error(403, "Auth required for this action");
        }
        Groups.insert(group, function (err, _id) {
            if ("image" in group) {
                var ngroup = Utils.getOr404(Groups, _id, "group");
                Groups.update(_id, {$set: {image_url: ngroup.image.url()}})
            }
        });
    }
});


var nonEmptyString = Match.Where(function (x) {
    check(x, String);
    return x.length > 0;
});