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
        oldOverLapped.NotOverLaped();
    }
    if(squad.overlapedCase !== null)
    {
        if(squad.canGo(squad.overlapedCase))
        {
            if(squad.overlapedCase.squad != null)
            {
                if(squad.overlapedCase.squad.fleat.player != squad.fleat.player )
                {
                    squad.overlapedCase.AttackOverLaped();
                }
                else if(squad.overlapedCase.squad.fleat.player == squad.fleat.player )
                {
                    squad.overlapedCase.SupportOverLaped();
                }
            }
            else
            {
                if(squad.movedFrom[squad.movedFrom.length - 1] == squad.overlapedCase || squad.movesAllowed > 0)
                {  
                    squad.overlapedCase.OverLaped();
                }
            }
        }
    }
}

function nextTurn()
{
    if(this.game.turn.player !== null)
    {
        disableDragingFroPlayer(this.game.turn.player);
    }
    this.game.turn.number++;
    nextPlayer();
    this.game.turn.player.resetSquadsActions();
    enableDrag(this.game.turn.player, dragSquad, stopDragSquadGaming);
}

function stopDragSquadGaming(sprite, pointer)
{
    sprite.body.moves = false;
    sprite.ref.isDragged = false;
    // has the squad been dragged on a case ?
    if(sprite.ref.overlapedCase !== null && sprite.ref.canGo(sprite.ref.overlapedCase))
    {
        sprite.ref.overlapedCase.NotOverLaped();
        // does the case already coutain an squad ?
        if(sprite.ref.overlapedCase.squad == null)
        {
            // if the squad is alreay on another case, remove it from the case.
            move(sprite);
        }
        else
        {
            if(sprite.ref.overlapedCase.squad.fleat.player == sprite.ref.fleat.player)
            {
                support(sprite);
            }
            if(sprite.ref.overlapedCase.squad.fleat.player != sprite.ref.fleat.player)
            {
                attack(sprite.ref, sprite.ref.overlapedCase.squad);
            }
        }
    }
    else
    {
        // set the squad to the original position.
        sprite.x = sprite.ref.case.phaserObject.x;
        sprite.y = sprite.ref.case.phaserObject.y;
    }
}

function support(sprite)
{
    // go here if the squad is moved to a case already countaining a fleet.
    // if the esouade had already a case : get back to the previous case.
    if(sprite.ref.case !== null)
    {
        sprite.x = sprite.ref.case.phaserObject.x;
        sprite.y = sprite.ref.case.phaserObject.y;
    }
    console.log('support');
}

function attack(squad, target)
{
    // go here if the squad is moved to a case already countaining a fleet.
    // if the esouade had already a case : get back to the previous case.
    if(squad.case !== null)
    {
        squad.phaserObject.x = squad.case.phaserObject.x;
        squad.phaserObject.y = squad.case.phaserObject.y;
    }
    squad.initFinalArmor();
    target.initFinalArmor();
    squad.attack(target);
    if(target.canDefend())
    {
        target.attack(squad);
    }
    target.applyDamages();
    squad.applyDamages();
    squad.updateLifeBar();
    target.updateLifeBar();
    squad.drawLifeBar(this.game);
    target.drawLifeBar(this.game);
    drawAttack(squad, target);
    squad.action = new action("attack", target);
}

function drawAttack(squad, squad2)
{
    /*
    var distance = Phaser.Math.distance(squad.phaserObject.x, squad.phaserObject.y, squad2.phaserObject.x, squad2.phaserObject.y );
    var angle = game.physics.arcade.angleBetween(squad.phaserObject, squad2.phaserObject);
    var arrow = this.game.add.sprite(squad.phaserObject.x  , squad.phaserObject.y  , 'red-arrow');
    arrow.scale.setTo(distance / arrow.width,  100 /  arrow.height);
    arrow.pivot.x = arrow.width * .5;arrow.pivot.y = arrow.height * .5;
    arrow.rotation = angle;
    arrow.x = arrow.x + ((arrow.width)  * (Math.cos(angle)/ Math.sin(angle))); 
    arrow.y = arrow.y + ((arrow.height)  * (Math.cos(angle)/ Math.sin(angle)));*/
}

function move(sprite)
{
    if(sprite.ref.movedFrom[sprite.ref.movedFrom.length - 1] == sprite.ref.overlapedCase)
    {
        if(sprite.ref.case !== null)
        {
            sprite.ref.case.squad = null;
        }
        sprite.ref.movesAllowed = sprite.ref.movesAllowed + 1;
        sprite.ref.movedFrom.pop();
        sprite.ref.applyMove();
    }
    else if (sprite.ref.movesAllowed > 0)
    {
        
        sprite.ref.movesAllowed--;
        sprite.ref.movedFrom.push(sprite.ref.case);
        sprite.ref.applyMove();
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