var onePlayer = function(name, number, availableCasePositioning)
{
    this.name = name;
    this.fleat = null;
    this.blocked = true;
    this.number = number;
    this.availableCasePositioning = availableCasePositioning;
};

onePlayer.prototype = {
    resetSquadsActions : function()
    {
        this.fleat.squads.forEach(function(squad){
            squad.movesAllowed = 1;
            squad.tempAction = null;
            squad.action = null;
            squad.movedFrom = [];
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