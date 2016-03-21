Events = new Mongo.Collection("events");
Dishes = new Mongo.Collection("dishes");
Orders = new Mongo.Collection("orders");
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
    orderDish: function (order) {
        var user = this.userId;
        var group = Groups.findOne(order.group);
        var event = Events.findOne(order.event);
        if (!event)
            throw new Meteor.Error(404, "No such event");
        if (!group)
            throw new Meteor.Error(404, "No such group");
        var forder = Orders.findOne({user: user, event: event});
        if (!forder){
            console.log("create order");
            var dish = order.dish;
            delete order.dish;
            order.items = [{
                _id: dish._id,
                name: dish.name,
                price: dish.price,
                count: 1,
                total: dish.price
            }];
            order.total = dish.price;
            Orders.insert(order);
            console.log("success create order")
        }else{
            console.log("update order");
        }

        console.log("Order dish was called " + user );
        //TODO add remove group from each user
    }
});