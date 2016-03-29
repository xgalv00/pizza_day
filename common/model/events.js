Events = new Mongo.Collection("events");
Dishes = new Mongo.Collection("dishes");
Orders = new Mongo.Collection("orders", {
    transform: function (doc) {
        var total = 0;
        doc.items.forEach(function (element, index, array) {
            var dish = Dishes.findOne(element._id);
            var coupon = Coupons.findOne({dish: element._id});
            element.name = dish.name;
            if (coupon) {
                element.full_price = dish.price;
                element.price = dish.price * (1 - coupon.discount / 100);
            }
            else {
                element.price = dish.price;
            }
            element.total = element.price * element.count;

            total += element.total;
        });
        doc.total = total;
        return doc;
    }
});
Coupons = new Mongo.Collection("coupons", {
    transform: function (doc) {
        doc.dish = Dishes.findOne({
            _id: doc.dish
        }, {fields: {name: 1}});
        return doc;
    }
});

var Schemas = {};

Schemas.Dish = new SimpleSchema({
    name: {
        type: String,
        label: "Name",
        max: 100
    },
    price: {
        type: Number,
        label: "Price",
        min: 0,
        decimal: true
    },
    group: {
        type: String,
        label: "Group for dish"
    },
    owner: {
        type: String,
        label: "Owner of dish"
    }
});

Schemas.Coupon = new SimpleSchema({
    dish: {
        type: String,
        label: "Dish id"
    },
    discount: {
        type: Number,
        label: "Price",
        min: 0,
        max: 100
    },
    group: {
        type: String,
        label: "Group id for coupon"
    }
});

Schemas.Event = new SimpleSchema({
    group: {
        type: String,
        label: "Group id for event"
    },
    active: {
        type: Boolean,
        label: "Is active event"
    },
    date: {
        type: Date,
        label: "Event date"
    },
    status: {
        type: String,
        label: "Event status"
    }
});

Schemas.Order = new SimpleSchema({
    event: {
        type: String,
        label: "event id for order"
    },
    user: {
        type: String,
        label: "user id for order"
    },
    group: {
        type: String,
        label: "Group id for order"
    },
    items: {
        type: [Object],
        label: "Set of dishes order by user for event"
    },
    "items.$._id": {
        type: String,
        label: "Dish id from menu"
    },
    "items.$.count": {
        type: Number,
        label: "Count of dish in order",
        min: 1
    },
    status: {
        type: String,
        label: "Order status"
    }
});

Coupons.attachSchema(Schemas.Coupon);
Dishes.attachSchema(Schemas.Dish);
Events.attachSchema(Schemas.Event);
Orders.attachSchema(Schemas.Order);

Meteor.methods({
    addCoupon: function (coupon) {
        var group = Utils.getOr404(Groups, coupon.group, "group");
        Utils.checkIsOwner(group);
        Coupons.insert(coupon);
    },
    removeCoupon: function (coupon) {
        var group = Utils.getOr404(Groups, coupon.group, "group");
        Utils.checkIsOwner(group);
        Coupons.remove(coupon._id);
    },
    addEvent: function (event) {
        var group = Utils.getOr404(Groups, event.group, "group");
        Utils.checkIsOwner(group);
        var current_event = Events.findOne({group: event.group, active: true});
        var ndate = Utils.stringToDate(event.date, "mm-dd-yyyy", "-");
        event.active = (current_event) ? false : true;
        event.date = ndate;
        event.status = (event.active) ? "ordering" : "created";
        Events.insert(event);
    },
    changeEventStatus: function (event_id, newStatus) {
        var event = Utils.getOr404(Events, event_id, "event");
        var group = Utils.getOr404(Groups, event.group, "group");
        Utils.checkIsOwner(group);
        if (newStatus == "delivered") {
            Events.update(event_id, {$set: {status: newStatus, active: false}});
            //TODO send message about delivery
            var nevent = Events.findOne({date: {$gt: event.date}});
            if (nevent) {
                Events.update(nevent._id, {$set: {active: true}});
            }
        } else {
            Events.update(event_id, {$set: {status: newStatus}});
        }
    },
    editDish: function (dish) {
        var dbDish = Utils.getOr404(Dishes, dish._id, "dish");
        var group = Utils.getOr404(Groups, dbDish.group, "group");
        Utils.checkIsInGroup(group);
        //TODO add check if dish in order, could not remove dish when ordered
        Dishes.update({_id: dish._id}, {$set: {name: dish.name, price: dish.price}});
    },
    addDish: function (dish) {
        var group = Utils.getOr404(Groups, dish.group, "group");
        Utils.checkIsInGroup(group);
        Dishes.insert(dish);
    },
    removeDish: function (dish) {
        var group = Utils.getOr404(Groups, dish.group, "group");
        Utils.checkIsInGroup(group);
        Dishes.remove(dish._id);
        //TODO add check if dish in order, could not remove dish when ordered
    },
    removeDishOrder: function (dish_id, order_id) {
        var order = Utils.getOr404(Orders, order_id, "order");
        var dish = Utils.getOr404(Dishes, dish_id, "dish");
        Utils.checkIsBelongToUser(order.user);
        Orders.update(order._id, {$pull: {"items._id": dish._id}});
    },
    updateDishOrder: function (dish_id, order_id, count) {
        var order = Utils.getOr404(Orders, order_id, "order");
        var dish = Utils.getOr404(Dishes, dish_id, "dish");
        Utils.checkIsBelongToUser(order.user);
        Orders.update({_id: order._id, "items._id": dish._id}, {$set: {"items.$.count": parseInt(count, 10)}});
    },
    orderDish: function (order) {
        var user = this.userId;
        var event = Utils.getOr404(Events, order.event, "event");
        var group = Utils.getOr404(Groups, order.group, "group");
        Utils.checkIsInGroup(group);
        var forder = Orders.findOne({user: user, event: event._id});
        if (!forder) {
            console.log("create order");
            var dish = order.dish;
            delete order.dish;
            order.items = [{
                _id: dish._id,
                count: 1
            }];
            //TODO replace by map with statuses
            order.user = this.userId;
            order.status = "created";
            Orders.insert(order);
            console.log("success create order")
        } else {
            Utils.checkIsBelongToUser(forder.user);
            Orders.update({_id: forder._id, "items._id": order.dish._id}, {$inc: {"items.$.count": 1}});
            Orders.update({_id: forder._id, "items._id": {$ne: order.dish._id}},
                {
                    $addToSet: {
                        "items": {
                            _id: order.dish._id,
                            count: 1
                        }
                    }
                }
            );
            console.log("update order");
        }

        console.log("Order dish was called " + user);
    },
    confirmOrder: function (order_id) {
        var order = Utils.getOr404(Orders, order_id, "order");
        var event = Utils.getOr404(Events, order.event, "event");
        var group = Utils.getOr404(Groups, order.group, "group");
        Utils.checkIsBelongToUser(order.user);
        Orders.update(order._id, {$set: {status: "confirmed"}});
        var users = group.users || [];
        users.push(group.owner._id);
        var orders = Orders.find({event: event._id, status: "confirmed", user: {$in: users}});
        var ordersCount = orders.count();
        //!_.contains(party.invited, userId)
        if (users.length == ordersCount) {
            //var group_owner_email = Utils.contactEmail(group.owner);
            var from = Utils.contactEmail(group.owner);
            var ordersArr = orders.map(function (doc) {
                return doc;
            });
            users.forEach(function (el, ind, arr) {
                var to = Utils.contactEmail(Meteor.users.findOne(el));

                if (Meteor.isServer && to) {
                    var uorderInd = ordersArr.findIndex(function (obj) {
                        return obj.user == el;
                    });
                    var uorder = ordersArr.splice(uorderInd, 1)[0];
                    var context = {order: uorder, url: Meteor.absoluteUrl('groups/' + group._id)};
                    var emailTemplate;
                    if (el == group.owner._id) {
                        var itemsToOrder = Orders.aggregate([
                            {$match: {event: event._id, status: "confirmed", user: {$in: users}}},
                            {$project: {items: 1, _id: 0}},
                            {$unwind: "$items"},
                            {$group: {_id: "$items._id", count: {$sum: "$items.count"}}}
                        ]);
                        context.eventSummary = {itemsToOrder: itemsToOrder};
                        emailTemplate = Handlebars.templates['owner_email'](context);
                    } else {
                        emailTemplate = Handlebars.templates['user_email'](context);
                    }

                    Email.send({
                        from: "noreply@pizzaday.com",
                        to: to,
                        replyTo: from || undefined,
                        subject: "Order for event: " + event.date,
                        html: emailTemplate
                    });
                }
            });
            Events.update({_id: event._id}, {$set: {status: "ordered"}});
        }
    }
});

