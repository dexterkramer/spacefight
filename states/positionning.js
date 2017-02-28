var positionning = function(game){
};
  
positionning.prototype = {
  	create: function(){
        drawCases(this.game);
        nextPlayer();
        positioningTurnInit(this.game.turn.player);
        button = game.add.button(600, 600, 'button', actionOnClick, this, 1, 0, 1);
      },
    update : function(){
        checkOverLap(this.game.turn.player,this.game.turn.player.availableCasePositioning, OverLapPositioningDraggingManagment);
    }
}

function OverLapPositioningDraggingManagment(squad, oldOverLapped)
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

function positioningTurnInit(player)
{
    positioningPlayer(player);
}

function finish()
{
    game.state.start("TheGame");
}

function actionOnClick()
{
    if(okToFinishPositioning(this.game.turn.player))
    {
        disableDragingFroPlayer(this.game.turn.player); 
        nextPlayer();
        if(this.game.turn.player !== null)
        {
            positioningTurnInit(this.game.turn.player);
        }
        else
        {
            finish();
        }
    }
}

function okToFinishPositioning(player)
{
    var escouadePositioned = true;
    player.fleat.escouades.forEach(function(escouade){
        if(escouade.case == null)
        {
            escouadePositioned = false;
        }
    });
    return escouadePositioned;
}

function positioningPlayer(player)
{
    escouadesGroup = this.game.add.group();
    var XposEscouade = 0;
    var YposEscouade = 600;
    player.fleat.escouades.forEach(function(escouade){
        escouade.originalX = XposEscouade;
        escouade.originalY = YposEscouade;
        XposEscouade = XposEscouade + 100;
    });

    drawPlayerSquads(player);
    enableDrag(player, dragEscouade, stopDragEscouade);
}
