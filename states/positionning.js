var positionning = function(game){
};
  
positionning.prototype = {
  	create: function(){
        this.game.add.tileSprite(0, 0, game.width, game.height, 'space');
        drawCases(this.game);
        nextPlayer(false);
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
    if(squad.overlapedCase !== null && squad.overlapedCase.squad !== null && squad.overlapedCase.squad !== squad)
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
        nextPlayer(false);
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
    var squadPositioned = true;
    player.fleat.squads.forEach(function(squad){
        if(squad.case == null)
        {
            squadPositioned = false;
        }
    });
    return squadPositioned;
}

function positioningPlayer(player)
{
    squadsGroup = this.game.add.group();
    var XposSquad = 0;
    var YposSquad = 600;
    player.fleat.squads.forEach(function(squad){
        squad.originalX = XposSquad;
        squad.originalY = YposSquad;
        XposSquad = XposSquad + 100;
    });

    drawPlayerSquads(player);
    enableDrag(player, dragSquad, stopDragSquad);
}
