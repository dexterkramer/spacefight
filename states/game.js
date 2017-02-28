var TheGame = function(game){
};
  
TheGame.prototype = {
  	create: function(){
        this.game.turn.number = 0;
        drawCases(this.game);
        drawAllSquads();
        startTurns();
      },
    update : function(){
        checkOverLap(this.game.turn.player,this.game.caseTable, OverLapGamingDraggingManagment);
    }
}

function OverLapGamingDraggingManagment(squad, oldOverLapped)
{
    if(typeof oldOverLapped !== "undefined" && oldOverLapped !== null && oldOverLapped !== squad.overlapedCase )
    {
        NotOverLaped(oldOverLapped);
    }
    if(squad.overlapedCase !== null && squad.overlapedCase.escouade !== null && squad.overlapedCase.escouade !== squad)
    {
        BadOverLaped(squad.overlapedCase);
    }
    else if(squad.overlapedCase !== null)
    {
        OverLaped(squad.overlapedCase); 
    }
}


function startTurns()
{
    this.game.turn.number++;
    nextPlayer();
    enableDrag(this.game.turn.player, dragEscouade, stopDragEscouade);
}