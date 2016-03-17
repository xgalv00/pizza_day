Groups = new Mongo.Collection("groups");

//Groups.allow({
//    insert: function (userId) {
//      return (userId ? true : false);
//    },
//    remove: function (userId) {
//      return (userId ? true : false);
//    },
//    update: function (userId) {
//      return (userId ? true : false);
//    }
//  });

Meteor.methods({
    addUser: function (userId, group) {
        check(userId, nonEmptyString);
        //check(group, {
        //    name: String,
        //    image: Date
        //});
        Groups.insert(userId, group);
    },
    addGroup: function (group) {
        // TODO add check for group
        Groups.insert(group);
    },
    removeGroup: function (group){
        Groups.remove(group._id)
    }

    //invite: function (partyId, userId) {
    //    check(partyId, String);
    //    check(userId, String);
    //    var party = Parties.findOne(partyId);
    //    if (!party)
    //        throw new Meteor.Error(404, "No such party");
    //    if (party.owner !== this.userId)
    //        throw new Meteor.Error(404, "No such party");
    //    if (party.public)
    //        throw new Meteor.Error(400,
    //            "That party is public. No need to invite people.");
    //
    //    if (userId !== party.owner && !_.contains(party.invited, userId)) {
    //        Parties.update(partyId, {$addToSet: {invited: userId}});
    //
    //        var from = contactEmail(Meteor.users.findOne(this.userId));
    //        var to = contactEmail(Meteor.users.findOne(userId));
    //
    //        if (Meteor.isServer && to) {
    //            // This code only runs on the server. If you didn't want clients
    //            // to be able to see it, you could move it to a separate file.
    //            Email.send({
    //                from: "noreply@socially.com",
    //                to: to,
    //                replyTo: from || undefined,
    //                subject: "PARTY: " + party.title,
    //                text: "Hey, I just invited you to '" + party.title + "' on Socially." +
    //                "\n\nCome check it out: " + Meteor.absoluteUrl() + "\n"
    //            });
    //        }
    //    }
    //}
});

var contactEmail = function (user) {
    if (user.emails && user.emails.length)
        return user.emails[0].address;
    if (user.services && user.services.facebook && user.services.facebook.email)
        return user.services.facebook.email;
    return null;
};

var nonEmptyString = Match.Where(function (x) {
  check(x, String);
  return x.length > 0;
});