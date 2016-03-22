Events = new Mongo.Collection("events");
Dishes = new Mongo.Collection("dishes");
Orders = new Mongo.Collection("orders", {
    transform: function (doc) {
        var total = 0;
        doc.items.forEach(function (element, index, array) {
            element.total = element.price * element.count;
            total += element.total;
        });
        doc.total = total;
        return doc;
    }
});
Coupons = new Mongo.Collection("coupons");

Meteor.methods({
    addEvent: function (event) {
        // TODO add check for group
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
    updateDishOrder: function (dish_id, order_id, count){
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