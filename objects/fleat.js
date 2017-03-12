var oneFleat = function(name, player)
{
    this.name = name;
    this.squads = [];
    this.player = player;
    player.fleat = this;
    this.capitalShip = null;
};

oneFleat.prototype = {
    addSquad : function(squad)
    {
        this.squads.push(squad);
    },
    addCapitalShip : function(squadJson)
    {
        this.capitalShip = createSquad(this, squadJson);
        this.addSquad(this.capitalShip);
    },
};