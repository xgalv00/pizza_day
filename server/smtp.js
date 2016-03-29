Meteor.startup(function () {
    if (!Meteor.settings.public.LOCAL) {
        process.env.MAIL_URL = "smtp://" + Meteor.settings.sendGridUserName + ":" + Meteor.settings.sendGridUserName + "@smtp.sendgrid.net:587";
    }
});
