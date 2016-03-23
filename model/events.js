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
        // TODO add check for group
        var group = Groups.findOne(event.group);
        if (!group)
            throw new Meteor.Error(404, "No such group");
        var current_event = Events.findOne({group: event.group, active: true});
        var ndate = stringToDate(event.date, "mm-dd-yyyy", "-");
        event.active = (current_event) ? false : true;
        event.date = ndate;
        event.status = "created";
        Events.insert(event);
    },
    removeEvent: function (event) {
        Events.remove(event._id);
    },
    addDish: function (dish) {
        // TODO add check for group
        Dishes.insert(dish);
    },
    removeDish: function (dish) {
        Dishes.remove(dish._id);
        //TODO add remove group from each user
    },
    updateDishOrder: function (dish_id, order_id, count) {
        //TODO check dish_id is string and count is number
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
                name: dish.name,
                price: dish.price,
                count: 1,
                //total: dish.price
            }];
            //order.total = dish.price;
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
                            name: order.dish.name,
                            price: order.dish.price,
                            count: 1
                        }
                    }
                }
            );
            console.log("update order");
        }

        console.log("Order dish was called " + user);
        //TODO add remove group from each user
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