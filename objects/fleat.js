var oneFleat = function(name, player)
{
    this.name = name;
    this.squads = [];
    this.player = player;
    player.fleat = this;
};

oneFleat.prototype = {
    addSquad : function(squad)
    {
        this.squads.push(squad);
    }
};