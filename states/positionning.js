var positionning = function(game){
};
  
positionning.prototype = {
  	create: function(){
        this.game.add.tileSprite(0, 0, game.width, game.height, 'space');
        squadsGroup = this.game.add.group();
        cardsGroup = this.game.add.group();
        this.game.infos = { tourInfos : null};
        drawCases();
        nextPlayer(false);
        positioningTurnInit(this.game.turn.player);
        button = game.add.button(600, 600, 'button', positioningNextTurn, this, 1, 0, 1);
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
    refreshInfosPositioning();
    positioningPlayer(player);
}

function finish()
{
    game.state.start("TheGame");
}

function positioningNextTurn()
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

    player.fleat.deploySquad(player.fleat.capitalShip);
    enableDragSquad(player.fleat.capitalShip, dragSquad, stopDragSquad);
}

function refreshInfosPositioning()
{
    if(this.game.infos.tourInfos != null && this.game.infos.tourInfos.phaserObject != null)
    {
        this.game.infos.tourInfos.phaserObject.destroy();
    }
    if(this.game.turn.player != null)
    {
        var infosTourX = 700;
        var infosTourY = 100;
        var textTour = this.game.turn.player.name+ " place your capital ship !";
        var style = { font: "20px Arial", fill: "#ff0044"/*, wordWrap: false, wordWrapWidth: lifeBar.width, /*align: "center", backgroundColor: "#ffff00"*/ };
        var text = this.game.add.text(infosTourX, infosTourY, textTour , style);
        text.anchor.set(0 , 0);
        this.game.infos.tourInfos = {};
        this.game.infos.tourInfos.phaserObject = text;
    }
}