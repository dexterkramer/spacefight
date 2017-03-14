var oneFleat = function(name, player)
{
    this.name = name;
    this.squads = [];
    this.deployedSquad = [];
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
    },
    deploySquad : function(squad)
    {
        var x;
        var y;
        if(squad.case !== null)
        {
            x = squad.case.phaserObject.middleX;
            y = squad.case.phaserObject.middleY;
        }
        else
        {
            x = squad.originalX;
            y = squad.originalY;
        }
        drawSquad(squad, x, y);
        enableDragSquad(squad, dragSquad, stopDragSquad);
        this.deployedSquad.push(squad);
    }
};