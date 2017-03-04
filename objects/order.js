var oneOrder = function(name, effects)
{
    this.name = name;
    this.effects = effects;
};

function createOrders(player, ordersJson)
{
    var orderArray = [];
    ordersJson.forEach(function(order){
        orderArray.push(createOrder(order));
    });
    return orderArray;
}

function createOrder(orderJson)
{
    var orderObject = new oneOrder(orderJson.name, orderJson.effects);
    return orderObject;
}