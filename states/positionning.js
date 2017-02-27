var positionning = function(game){
};
  
positionning.prototype = {
  	create: function(){
        drawCases(this.game);
        this.game.turn.player = this.game.players[0];
        positioningTurnInit(this.game.turn.player);
        button = game.add.button(600, 600, 'button', actionOnClick, this, 1, 0, 1);
      },
    update : function(){
        checkOverLap(this.game.turn.player,this.game.turn.player.availableCasePositioning);
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
        var newPlayer = nextPlayer();
        if(newPlayer !== null)
        {
            this.game.turn.player = newPlayer;
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
         var oneEscouade = escouadesGroup.create(XposEscouade, YposEscouade, 'escouade');
        oneEscouade.scale.setTo(100 / oneEscouade.width, 100 / oneEscouade.height);
        escouade.originalX = XposEscouade;
        escouade.originalY = YposEscouade;
        escouade.phaserObject = oneEscouade;
        escouade.isDragged = false;
        oneEscouade.inputEnabled = true;
        this.game.physics.arcade.enable(oneEscouade);
        oneEscouade.input.enableDrag();
        oneEscouade.ref = escouade;
        oneEscouade.events.onDragStart.add(dragEscouade, this);
        oneEscouade.events.onDragStop.add(stopDragEscouade, this);
        XposEscouade = XposEscouade + 100;
    });
}
