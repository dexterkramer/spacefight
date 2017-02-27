var positionning = function(game){
};
  
positionning.prototype = {
  	create: function(){
        drawCases(this.game);
        this.game.player1.blocked = false;
        positioningPlayer(this.game.player1);
        button = game.add.button(600, 600, 'button', actionOnClick, this, 1, 0, 1);
        /*button.onInputOver.add(over, this);
        button.onInputOut.add(out, this);
        button.onInputUp.add(up, this);*/
      },
    update : function(){
        if(!this.game.player1.blocked)
        {
            checkOverLap(this.game.player1, this.game.caseTable.slice(Math.round(this.game.caseTable.length / 2), this.game.caseTable.length));
        }
    }
}

function actionOnClick()
{
    if(okToFinishPositioning(this.game.player1))
    {

    }
}

function checkOverLap(player, caseTable)
{
    player.fleat.escouades.forEach(function(escouade){
        if(escouade.isDragged)
        {
            let overLapedCase = getOverlapedCase(escouade, caseTable);
            if(escouade.overlapedCase !== null )
            {
                NotOverLaped(escouade.overlapedCase);;
            }
            
            escouade.overlapedCase = overLapedCase;
            if(overLapedCase != null && overLapedCase.escouade !== null && overLapedCase.escouade !== escouade)
            {
                BadOverLaped(escouade.overlapedCase);
            }
            else if(escouade.overlapedCase !== null)
            {
                OverLaped(escouade.overlapedCase); 
            }
        }
    });
}

function BadOverLaped(oneCase)
{
    oneCase.phaserObject.loadTexture('badOverLapedCase', 0);
}

function OverLaped(oneCase)
{
    oneCase.phaserObject.loadTexture('overLapedCase', 0);
}

function NotOverLaped(oneCase)
{
    oneCase.phaserObject.loadTexture('case', 0);
}

function getOverlapedCase(escouade, caseTable)
{
    let overLapValue = 0;
    let overLapCase = null;
    caseTable.forEach(function(oneCase){
        if(!this.game.physics.arcade.overlap(escouade.phaserObject, oneCase.phaserObject, function(esc,theCase) {

            let intersects = Phaser.Rectangle.intersection(esc, theCase);
            let thisOverlap = intersects.width * intersects.height;
            if(thisOverlap > overLapValue || overLapCase == oneCase)
            {
                overLapCase = oneCase;
                overLapValue = thisOverlap;
            }
        })){
            if(overLapCase == oneCase)
            {
                overLapCase = null;
            }
        }
    });
    return overLapCase;
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

function dragEscouade(sprite, pointer)
{
    sprite.body.moves = false;
    sprite.ref.isDragged = true;
}

function stopDragEscouade(sprite, pointer)
{
    sprite.body.moves = false;
    sprite.ref.isDragged = false;
    if(!this.game.player1.blocked)
    {
        // has the escouade been dragged on a case ?
        if(sprite.ref.overlapedCase !== null)
        {

            NotOverLaped(sprite.ref.overlapedCase);
            // does the case already coutain an escouade ?
            if(sprite.ref.overlapedCase.escouade == null)
            {
                // if the escouade is alreay on another case, remove it from the case.
                if(sprite.ref.case !== null)
                {
                    sprite.ref.case.escouade = null;
                }

                //linking the escouade to the new case.
                sprite.ref.case = sprite.ref.overlapedCase;
                sprite.ref.overlapedCase.escouade = sprite.ref;

                // move the sprite of the esouade to his new position 
                sprite.x = sprite.ref.overlapedCase.phaserObject.x;
                sprite.y = sprite.ref.overlapedCase.phaserObject.y;
            }
            else
            {
                // go here if the escouade is moved to a case already countaining a fleet.
                // if the esouade had already a case : get back to the previous case.
                if(sprite.ref.case !== null)
                {
                    sprite.x = sprite.ref.case.phaserObject.x;
                    sprite.y = sprite.ref.case.phaserObject.y;
                }
                else
                {
                    // else if the escouade is not linked to a case : return to the original position.
                    sprite.x = sprite.ref.originalX;
                    sprite.y = sprite.ref.originalY;
                }
            }
        }
        else
        {
            // go here if the escouade is not dragged on a case.
            // if the escouade add a case previously : remove it.
            if(sprite.ref.case !== null)
            {
                sprite.ref.case.escouade = null;
                sprite.ref.case = null;
            }

            // set the escouade to the original position.
            sprite.x = sprite.ref.originalX;
            sprite.y = sprite.ref.originalY;
        }
    }
}

function drawCases(game)
{
    cases = game.add.group();
    game.caseTable.forEach(function(elem){
        var oneCase = cases.create(elem.position.x, elem.position.y, 'case');
        this.game.physics.arcade.enable(oneCase);
        oneCase.scale.setTo(elem.width / oneCase.width,  elem.height / oneCase.height);
        elem.phaserObject = oneCase;
    });
}