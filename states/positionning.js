var positionning = function(game){
};
  
positionning.prototype = {
  	create: function(){
        this.game.add.tileSprite(0, 0, game.width, game.height, 'space');
        squadsGroup = this.game.add.group();
        cardsGroup = this.game.add.group();
        drawCases();
        nextPlayer(false);
        positioningTurnInit(this.game.turn.player);
        button = game.add.button(600, 600, 'button', actionOnClick, this, 1, 0, 1);
      },
    update : function(){
        this.game.caseTable.forEach(function(oneCase){
            oneCase.NotOverLaped();
        });
        checkOverLapSquad(this.game.turn.player,this.game.turn.player.availableCasePositioning, OverLapPositioningDraggingManagment);
    }
}

function OverLapPositioningDraggingManagment(squad)
{
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
    var XposSquad = 100;
    var YposSquad = 700;

    player.fleat.capitalShip.originalX = XposSquad;
    player.fleat.capitalShip.originalY = YposSquad;

/*
    player.fleat.squads.forEach(function(squad){
        squad.originalX = XposSquad;
        squad.originalY = YposSquad;
        XposSquad = XposSquad + 100;
    });
*/
    player.fleat.deploySquad(player.fleat.capitalShip);
    enableDragSquad(player.fleat.capitalShip, dragSquad, stopDragSquad);
    //drawSquad(player.fleat.capitalShip);
    //drawPlayerSquads(player);
    //enableDrag(player, dragSquad, stopDragSquad);
}
