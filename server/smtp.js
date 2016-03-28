Meteor.startup(function () {
    process.env.MAIL_URL = "smtp://" + Meteor.settings.sendGridUserName + ":" + Meteor.settings.sendGridUserName + "@smtp.sendgrid.net:587";
});
