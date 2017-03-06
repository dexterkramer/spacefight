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
        this.game.caseTable.forEach(function(oneCase){
            oneCase.NotOverLaped();
        });
        checkOverLap(this.game.turn.player,this.game.caseTable, OverLapGamingDraggingManagment);
    }
}

function OverLapGamingDraggingManagment(squad, oldOverLapped)
{
    if(squad.overlapedCase !== null)
    {
        if(squad.canGo(squad.overlapedCase))
        {
            if(squad.overlapedCase.squad != null)
            {
                if(squad.overlapedCase.squad.fleat.player != squad.fleat.player )
                {
                    var toFriendlyFires = squad.getFriendlyFire(squad.overlapedCase.squad);
                    toFriendlyFires.forEach(function(toFriendlyFire) {
                        toFriendlyFire.case.FirendlyFireOverlaped();
                    });
                    squad.overlapedCase.AttackOverLaped();
                }
                else if(squad.overlapedCase.squad.fleat.player == squad.fleat.player )
                {
                    squad.overlapedCase.SupportOverLaped();
                }
            }
            else
            {
                if(squad.movedFrom[squad.movedFrom.length - 1] == squad.overlapedCase || squad.fleat.player.movesAllowed > 0)
                {  
                    squad.overlapedCase.OverLaped();
                }
            }
        }
    }
}

function nextTurn()
{
    applyActions();
    doFights();
    if(this.game.turn.player !== null)
    {
        disableDragingFroPlayer(this.game.turn.player);
    }
    this.game.turn.number++;
    if(this.game.turn.player != null)
    {
        this.game.turn.player.resetEffects();
    }
    nextPlayer();
    this.game.turn.player.resetSquadsActions();
    this.game.turn.player.drawOneorder();
    enableDrag(this.game.turn.player, dragSquad, stopDragSquadGaming);
}

function refreshAction(squad)
{
    var toSlice = [];
    squad.defendAgainst.forEach(function(attackingSquad, index){
        attackingSquad.action.phaserObject.destroy();
        if(attackingSquad.canGo(squad.case))
        {
            drawAttack(attackingSquad, squad);
        }
        else
        {
            toSlice.push(index);
            attackingSquad.action = null;
        }
    });

    toSlice.forEach(function(indexToslice){
        squad.defendAgainst.splice(indexToslice, 1);
    });

    if(squad.action != null)
    {
        squad.action.phaserObject.destroy();
        if(squad.canGo(squad.action.target.case))
        {
            drawAttack(squad, squad.action.target);
        }
        else
        {
            squad.action.target.defendAgainst.splice(squad.action.target.defendAgainst.findIndex(function(elem){
                return elem == squad;
            }),1);
            squad.action = null;
        }
    }

}

function stopDragSquadGaming(sprite, pointer)
{
    sprite.body.moves = false;
    sprite.ref.isDragged = false;
    // has the squad been dragged on a case ?
    if(sprite.ref.overlapedCase !== null && sprite.ref.canGo(sprite.ref.overlapedCase))
    {
        // does the case already coutain an squad ?
        if(sprite.ref.overlapedCase.squad == null)
        {
            // if the squad is alreay on another case, remove it from the case.
            if(move(sprite))
            {
                refreshAction(sprite.ref);
            }
        }
        else
        {
            if(sprite.ref.overlapedCase.squad.fleat.player == sprite.ref.fleat.player)
            {
                support(sprite.ref, sprite.ref.overlapedCase.squad);
            }
            if(sprite.ref.overlapedCase.squad.fleat.player != sprite.ref.fleat.player)
            {
                tempAttack(sprite.ref, sprite.ref.overlapedCase.squad);
            }
        }
    }
    else
    {
        // set the squad to the original position.
        sprite.x = sprite.ref.case.phaserObject.middleX;
        sprite.y = sprite.ref.case.phaserObject.middleY;
    }
}

function support(squad, target)
{
    // go here if the squad is moved to a case already countaining a fleet.
    // if the esouade had already a case : get back to the previous case.
    if(squad.case !== null)
    {
        squad.phaserObject.x = squad.case.phaserObject.middleX;
        squad.phaserObject.y = squad.case.phaserObject.middleY;
    }

    // stop if the squad have already made an action this turn
    if(squad.action != null)
    {
        return false;
    }
    
    squad.support(target);
    target.updateLifeBar();
    target.drawLifeBar(this.game);
    squad.action = new action("support", target);
    return true;
}

function tempAttack(squad, target)
{
    // don't move the squad to the case (attack the ennemy squad instead)
    if(squad.case !== null)
    {
        squad.phaserObject.x = squad.case.phaserObject.middleX;
        squad.phaserObject.y = squad.case.phaserObject.middleY;
    }
    if( squad.action != null &&  squad.action.phaserObject != null )
    {
        squad.action.phaserObject.destroy();
    }
    squad.action = new action("attack", target);
    drawAttack(squad, target);
    if(target.defendAgainst.length == 0)
    {
        target.action = new action("defend", squad);
        drawAttack(target, squad);
        squad.defendAgainst.push(target);
    }
    target.defendAgainst.push(squad);
}


function applyActions()
{
    /*this.game.players.forEach(function(player){
        player.fleat.squads.forEach(function(squad){
            if(squad.tempAction.type != squad.action.type && squad.action.target != squad.tempAction.target )
            {
                squad.action = squad.tempAction;
            }

        });
    });*/
}

function doFights()
{
    this.game.players.forEach(function(player){
        player.fleat.squads.forEach(function(squad){
            if(squad.action != null && squad.action.type == "attack")
            {   
                var target = squad.action.target;
                squad.initFinalArmor();
                target.initFinalArmor();
                var modifiers = [];
                var flankBonus = squad.calcultateFlankingBonus(target);
                if(flankBonus)
                {
                    modifiers.push(flankBonus);
                }
                
                squad.attack(target, modifiers);
                if(target.action.type == "defend" && target.action.target == squad)
                {
                    target.attack(squad, []);
                }
                target.applyDamages();
                squad.applyDamages();
                squad.updateLifeBar();
                target.updateLifeBar();
                squad.drawLifeBar(this.game);
                target.drawLifeBar(this.game);
                var toFriendlyFires = squad.getFriendlyFire(target);
                squad.applyFriendlyFire(toFriendlyFires, this.game);
            }
        });
    });
}

function drawAttack(squad, squad2)
{
    var distance = Phaser.Math.distance(squad.phaserObject.x, squad.phaserObject.y, squad2.phaserObject.x, squad2.phaserObject.y );
    var angle = game.physics.arcade.angleBetween(squad.phaserObject, squad2.phaserObject);
    var arrow = this.game.add.sprite(squad.phaserObject.x  , squad.phaserObject.y  , 'red-arrow');
    arrow.scale.setTo(distance / arrow.width,  50 /  arrow.height);
    arrow.anchor.x = 0;
    arrow.anchor.y = 0.5;
    arrow.rotation = angle;
    arrow.alpha = 0.5;
    squad.action.phaserObject = arrow;
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
        sprite.ref.fleat.player.movesAllowed = sprite.ref.fleat.player.movesAllowed + 1;
        sprite.ref.movedFrom.pop();
        sprite.ref.applyMove();
        return true;
    }
    else if (sprite.ref.fleat.player.movesAllowed > 0)
    {
        
        sprite.ref.fleat.player.movesAllowed--;
        sprite.ref.movedFrom.push(sprite.ref.case);
        sprite.ref.applyMove();
        return true;
    }
    else
    {
        if(sprite.ref.case !== null)
        {
            sprite.x = sprite.ref.case.phaserObject.middleX;
            sprite.y = sprite.ref.case.phaserObject.middleY;
        }
    }
    return false;
}