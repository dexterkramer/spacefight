var onePlayer = function(name, number, availableCasePositioning)
{
    this.name = name;
    this.fleat = null;
    this.blocked = true;
    this.number = number;
    this.availableCasePositioning = availableCasePositioning;
    this.movesAllowed = 1;
    this.allOrders = [];
    this.availableOrders = [];
};

onePlayer.prototype = {
    resetSquadsActions : function()
    {
        this.movesAllowed = 1;
        this.fleat.squads.forEach(function(squad){
            squad.movesAllowed = 1;
            squad.tempAction = null;
            squad.action = null;
            squad.movedFrom = [];
            squad.defendAgainst = [];
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
        var squadPositioned = true;
        this.fleat.squads.forEach(function(squad){
            if(squad.case == null)
            {
                squadPositioned = false;
            }
        });
        return squadPositioned;
    }
};