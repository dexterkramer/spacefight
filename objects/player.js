var onePlayer = function(name, number, availableCasePositioning)
{
    this.name = name;
    this.fleat = null;
    this.blocked = true;
    this.number = number;
    this.availableCasePositioning = availableCasePositioning;
    this.movesAllowed = 1;
    this.orders = [];
    this.availableOrders = [];
    this.cardHandlers = [];
    this.pick = [];
    this.createHandler();
};

onePlayer.prototype = {
    createPick : function()
    {
        this.pick = createPick(this);
    },
    resetSquadsActions : function()
    {
        this.movesAllowed = 1;
        this.fleat.squads.forEach(function(squad){
            squad.movesAllowed = 1;
            squad.tempAction = null;
            //squad.action = null;
            squad.movedFrom = [];
            //squad.defendAgainst = [];
        });
    },
    resetEffects : function()
    {
        this.fleat.squads.forEach(function(squad){
            squad.resetModifiers();
        });
    },
    okToFinishPositioning : function()
    {
        if(this.fleat.capitalShip.case == null)
            return false;
        return true;
    },
    drawOneCard : function()
    {
        var card = this.pick.drawOne();
        var index = this.cardHandlers.findIndex(function(elem){
            return elem.card == null;
        });
        var choosenHandler = this.cardHandlers[index];
        card.setHandler(choosenHandler);
        choosenHandler.addCard(card);
        card.drawCard();
/*
        let selectedOrderIndex = Math.floor(Math.random()*this.orders.length);
        this.availableOrders.push(this.orders[selectedOrderIndex]);
        this.orders.splice(selectedOrderIndex, 1);*/
    },
    createHandler : function()
    {
        this.cardHandlers = createHandlers(this);
    }
};