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
        oldOverLapped.NotOverLaped();
    }
    if(squad.overlapedCase !== null && squad.overlapedCase.squad !== null && squad.overlapedCase.squad !== squad)
    {
        squad.overlapedCase.BadOverLaped();
    }
    else if(squad.overlapedCase !== null)
    {
        squad.overlapedCase.OverLaped(); 
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
    if(this.game.turn.player.okToFinishPositioning())
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
