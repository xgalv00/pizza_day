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
        console.log("coupon add");
        Coupons.insert(coupon);
    },
    removeCoupon: function (coupon) {
        console.log("coupon remove");
        Coupons.remove(coupon._id);
    },
    addEvent: function (event) {
        // TODO add check for date
        var group = Groups.findOne(event.group);
        if (!group)
            throw new Meteor.Error(404, "No such group");
        var current_event = Events.findOne({group: event.group, active: true});
        var ndate = stringToDate(event.date, "mm-dd-yyyy", "-");
        event.active = (current_event) ? false : true;
        event.date = ndate;
        event.status = (event.active) ? "ordering" : "created";
        Events.insert(event);
    },
    removeEvent: function (event) {
        Events.remove(event._id);
    },
    changeEventStatus: function (event_id, newStatus) {
        //TODO check for status
        //TODO change active event after delivered status
        Events.update(event_id, {$set: {status: newStatus}});
    },
    editDish: function (dish) {
        Dishes.update({_id: dish._id}, {$set: {name: dish.name, price: dish.price}});
    },
    addDish: function (dish) {
        Dishes.insert(dish);
    },
    removeDish: function (dish) {
        Dishes.remove(dish._id);
        //TODO add remove dish from each user
    },
    updateDishOrder: function (dish_id, order_id, count) {
        var order = Orders.findOne(order_id);
        if (!order)
            throw new Meteor.Error(404, "No such order");
        Orders.update({_id: order._id, "items._id": dish_id}, {$set: {"items.$.count": parseInt(count, 10)}});
    },
    orderDish: function (order) {
        var user = this.userId;
        var group = Groups.findOne(order.group);
        var event = Events.findOne(order.event);
        if (!event)
            throw new Meteor.Error(404, "No such event");
        if (!group)
            throw new Meteor.Error(404, "No such group");
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
        //TODO add remove group from each user
    },
    confirmOrder: function (order_id){
        //TODO check order
        var order = Orders.findOne(order_id);
        Orders.update(order._id, {$set: {status: "confirmed"}});
        var group = Groups.findOne(order.group);
        var event = Events.findOne(order.event);
        var users = [].concat(group.users, [group.owner._id]);
        var orders_count = Orders.find({event: event._id, status: "confirmed", user: {$in: users}}).count();
        if (users.length == orders_count){
            console.log("send email");
            Events.update({_id: event._id}, {$set: {status: "ordered"}});
        }
    }
});

function stringToDate(_date, _format, _delimiter) {
    var formatLowerCase = _format.toLowerCase();
    var formatItems = formatLowerCase.split(_delimiter);
    var dateItems = _date.split(_delimiter);
    var monthIndex = formatItems.indexOf("mm");
    var dayIndex = formatItems.indexOf("dd");
    var yearIndex = formatItems.indexOf("yyyy");
    var month = parseInt(dateItems[monthIndex]);
    month -= 1;
    return new Date(Date.UTC(dateItems[yearIndex], month, dateItems[dayIndex], 0, 0, 0));
}