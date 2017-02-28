var TheGame = function(game){
};
  
TheGame.prototype = {
  	create: function(){
        this.game.add.tileSprite(0, 0, game.width, game.height, 'space');
        this.game.turn.number = 0;
        drawCases(this.game);
        drawAllSquads();
        nextTurn();
        button = game.add.button(600, 600, 'button', nextTurn, this, 1, 0, 1);
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
    if(squad.overlapedCase !== null)
    {
        if(canGo(squad.overlapedCase, squad))
        {
            if(squad.overlapedCase.escouade != null)
            {
                if(squad.overlapedCase.escouade.fleat.player != squad.fleat.player )
                {
                    AttackOverLaped(squad.overlapedCase);
                }
                else if(squad.overlapedCase.escouade.fleat.player == squad.fleat.player )
                {
                    SupportOverLaped(squad.overlapedCase);
                }
            }
            else
            {
                OverLaped(squad.overlapedCase);
            }
        }
    }
}


function resetEscouadesActions(player)
{
    player.fleat.escouades.forEach(function(squad){
        squad.movesAllowed = 1;
        squad.tempAction = null;
        squad.movedFrom = [];
    });
}


function nextTurn()
{
    if(this.game.turn.player !== null)
    {
        disableDragingFroPlayer(this.game.turn.player);
    }
    this.game.turn.number++;
    nextPlayer();
    resetEscouadesActions(this.game.turn.player);
    enableDrag(this.game.turn.player, dragEscouade, stopDragEscouadeGaming);
}

function canGo(oneCase, squad)
{
    if(squad.case !== null)
    {
        if(squad.case.left == oneCase || squad.case.right == oneCase || squad.case.top == oneCase || squad.case.bottom == oneCase)
        {
            return true;
        }
        if(squad.case.right !== null && (squad.case.right.bottom == oneCase || squad.case.right.top == oneCase ))
        {
            return true;
        }
        if(squad.case.left !== null && (squad.case.left.bottom == oneCase || squad.case.left.top == oneCase ))
        {
            return true;
        }
        if(squad.case.top !== null && (squad.case.top.right == oneCase || squad.case.top.left == oneCase ))
        {
            return true;
        }
        if(squad.case.bottom !== null && (squad.case.bottom.right == oneCase || squad.case.bottom.left == oneCase ))
        {
            return true;
        }
    }
}


function stopDragEscouadeGaming(sprite, pointer)
{
    sprite.body.moves = false;
    sprite.ref.isDragged = false;
    // has the escouade been dragged on a case ?
    if(sprite.ref.overlapedCase !== null && canGo(sprite.ref.overlapedCase, sprite.ref))
    {
        NotOverLaped(sprite.ref.overlapedCase);
        // does the case already coutain an escouade ?
        if(sprite.ref.overlapedCase.escouade == null)
        {
            // if the escouade is alreay on another case, remove it from the case.
            move(sprite);
        }
        else
        {
            if(sprite.ref.overlapedCase.escouade.fleat.player == sprite.ref.fleat.player)
            {
                support(sprite);
            }
            if(sprite.ref.overlapedCase.escouade.fleat.player != sprite.ref.fleat.player)
            {
                attack(sprite);
            }
        }
    }
    else
    {
        // set the escouade to the original position.
        sprite.x = sprite.ref.case.phaserObject.x;
        sprite.y = sprite.ref.case.phaserObject.y;
    }
}

function support(sprite)
{
    // go here if the escouade is moved to a case already countaining a fleet.
    // if the esouade had already a case : get back to the previous case.
    if(sprite.ref.case !== null)
    {
        sprite.x = sprite.ref.case.phaserObject.x;
        sprite.y = sprite.ref.case.phaserObject.y;
    }
    console.log('support');
}

function attack(sprite)
{
    // go here if the escouade is moved to a case already countaining a fleet.
    // if the esouade had already a case : get back to the previous case.
    if(sprite.ref.case !== null)
    {
        sprite.x = sprite.ref.case.phaserObject.x;
        sprite.y = sprite.ref.case.phaserObject.y;
    }
    console.log('attack');
}

function applyMove(sprite)
{
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

function move(sprite)
{
    if(sprite.ref.movedFrom[sprite.ref.movedFrom.length - 1] == sprite.ref.overlapedCase)
    {
        if(sprite.ref.case !== null)
        {
            sprite.ref.case.escouade = null;
        }
        sprite.ref.movesAllowed = sprite.ref.movesAllowed + 1;
        sprite.ref.movedFrom.pop();
        applyMove(sprite);
    }
    else if (sprite.ref.movesAllowed > 0)
    {
        
        sprite.ref.movesAllowed--;
        sprite.ref.movedFrom.push(sprite.ref.case);
        applyMove(sprite);
    }
    else
    {
        if(sprite.ref.case !== null)
        {
            sprite.x = sprite.ref.case.phaserObject.x;
            sprite.y = sprite.ref.case.phaserObject.y;
        }
    }
    console.log('move');
}