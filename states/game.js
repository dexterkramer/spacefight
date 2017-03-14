var TheGame = function(game){
};
  
TheGame.prototype = {
  	create: function(){
        this.game.add.tileSprite(0, 0, game.width, game.height, 'space');
        this.game.turn.number = 0;
        this.game.battles = [];
        drawCases();
        drawAllSquads();
        nextTurn();
        button = this.game.add.button(600, 600, 'button', nextTurn, this, 1, 0, 1);
      },
    update : function(){
        this.game.caseTable.forEach(function(oneCase){
            oneCase.NotOverLaped();
        });
        checkOverLapSquad(this.game.turn.player,this.game.caseTable, OverLapGamingDraggingManagment);
        checkOverLapCard(this.game.turn.player,this.game.caseTable, OverLapGamingCardDraggingManagment);
    }
}

//////////////////////////////////////////////////////////////////
////////////////////////// GAME MECHANICS ////////////////////////
//////////////////////////////////////////////////////////////////

function nextTurn()
{
    //applyActions();
    doFights();
    if(this.game.turn.player !== null)
    {
        disableDragingFroPlayer(this.game.turn.player);
    }
    this.game.turn.number++;
    if(this.game.turn.player != null)
    {
        this.game.turn.player.resetEffects();
        this.game.turn.player.destroyCardView();
    }
    nextPlayer();
    this.game.turn.player.resetSquadsActions();
    this.game.turn.player.drawOneCard();
    this.game.turn.player.showCards();
    enableDrag(this.game.turn.player, dragSquad, stopDragSquadGaming);
}

///////////////////////////////////////////////////////////
///////////////////// DRAG AND OVERLAP ////////////////////
///////////////////////////////////////////////////////////

function dragCard(sprite, pointer)
{
    sprite.body.moves = false;
    sprite.ref.isDragged = true;
}

function stopDragCard(sprite, pointer)
{
    var card = sprite.ref;
    sprite.body.moves = false;
    card.isDragged = false;
    if(card.overlapedCase !== null )
    {
        if(card.type == "squad")
        {
            if(card.overlapedCase.squad == null)
            {
                card.overlapedCase.squad = card.object;
                card.object.case = card.overlapedCase;
                card.object.fleat.deploySquad(card.object);
                card.destroy();
            }
        }
        else if(card.type == "order")
        {
            if(card.overlapedCase.squad != null)
            {
                if(card.overlapedCase.squad.fleat.player == card.handler.player)
                {
                    card.overlapedCase.squad.buff(card.object);
                    card.destroy();
                }
                else if(card.overlapedCase.squad.fleat.player != card.handler.player)
                {
                    card.overlapedCase.squad.buff(card.object);
                    card.destroy();
                }
            }
        }
    }
    else
    {
        // set the squad to the original position.
        sprite.x = card.handler.x;
        sprite.y = card.handler.y;
    }
    //stopDragPlayer(sprite);
}

function OverLapGamingCardDraggingManagment(card)
{
    if(card.overlapedCase !== null)
    {
        if(card.type == "squad")
        {
            if(card.overlapedCase.squad == null)
            {
                card.overlapedCase.OverLaped();
            }
        }
        else if(card.type == "order")
        {
            if(card.overlapedCase.squad != null)
            {
                if(card.overlapedCase.squad.fleat.player == card.handler.player)
                {
                    card.overlapedCase.SupportOverLaped();
                }
                if(card.overlapedCase.squad.fleat.player != card.handler.player)
                {
                    card.overlapedCase.AttackOverLaped();
                }
            }

        }
        /*if(squad.canGo(squad.overlapedCase))
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
                if(squad.movedFrom[squad.movedFrom.length - 1] == squad.overlapedCase || squad.movesAllowed > 0)
                {  
                    squad.overlapedCase.OverLaped();
                }
            }
        }*/
    }
}

function OverLapGamingDraggingManagment(squad)
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
                if(squad.movedFrom[squad.movedFrom.length - 1] == squad.overlapedCase || squad.movesAllowed > 0)
                {  
                    squad.overlapedCase.OverLaped();
                }
            }
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

//////////////////////////////////////////////////////////////////////////
/////////////////////////// ATTACK ///////////////////////////////////////
//////////////////////////////////////////////////////////////////////////

function tempAttack(squad, target)
{
    // don't move the squad to the case (attack the ennemy squad instead)
    if(squad.case !== null)
    {
        squad.phaserObject.x = squad.case.phaserObject.middleX;
        squad.phaserObject.y = squad.case.phaserObject.middleY;
    }

    var defendingAgainst = getDefendingAgainst(target);
    if(defendingAgainst.length == 0)
    {
        target.action = addBattle(target, squad);
        drawAttack(target.action);
    }

    var existingAttack = findBattle(squad);

    if(existingAttack)
    {
        removeBattle(existingAttack);
    }

    squad.action = addBattle(squad, target);
    drawAttack(squad.action);
}

function getDefendingAgainst(defendingSquad)
{
    var defendingAgainst = [];
    this.game.battles.forEach(function(battle){
        if(battle.target == defendingSquad)
        {
            defendingAgainst.push(battle);
        }
    });
    return defendingAgainst;
}

function addBattle(attackingSquad, target)
{
    var theBattle = createBattle(attackingSquad, target);
    this.game.battles.push(theBattle);
    return theBattle;
}

function removeBattle(battle)
{
    if(battle.arrowPhaserObject != null)
    {
        battle.arrowPhaserObject.destroy();
    }
    this.game.battles.splice(this.game.battles.findIndex(function(elem){
        return elem == battle;
    }),1);
}

function findBattle(attackingSquad)
{
    var index = this.game.battles.findIndex(function(elem){
        return elem.attackingSquad == attackingSquad;
    });
    if(typeof index == "undefined" || index == null || index == -1)
    {
        return false;
    }
    return this.game.battles[index];
}

function isDefendingAgainst(defendingSquad, attackingSquad)
{
    defendingBattle = findBattle(defendingSquad);
    if(defendingBattle && defendingBattle.target == attackingSquad)
    {
        return defendingBattle;
    }
    return false;
}

function doFights()
{
    var actualTurn = this.game.turn.number;
    this.game.battles.forEach(function(battle){
        battle.process(this.game.turn.number);
    });
}

function drawAttack(battle)
{
    var distance = Phaser.Math.distance(battle.attackingSquad.phaserObject.x, battle.attackingSquad.phaserObject.y, battle.target.phaserObject.x, battle.target.phaserObject.y );
    var angle = game.physics.arcade.angleBetween(battle.attackingSquad.phaserObject, battle.target.phaserObject);
    var arrow = this.game.add.sprite(battle.attackingSquad.phaserObject.x  , battle.attackingSquad.phaserObject.y  , 'red-arrow');
    arrow.scale.setTo(distance / arrow.width,  50 /  arrow.height);
    arrow.anchor.x = 0;
    arrow.anchor.y = 0.5;
    arrow.rotation = angle;
    arrow.alpha = 0.5;
    battle.arrowPhaserObject = arrow;
}


////////////////////////////////////////////
///////////////// MOVE /////////////////////
////////////////////////////////////////////

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
        return true;
    }
    else if (sprite.ref.movesAllowed > 0)
    {
        
        sprite.ref.movesAllowed--;
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

function refreshAction(squad)
{
    var defendingAgainst = getDefendingAgainst(squad);
    defendingAgainst.forEach(function(battle, index){
        battle.arrowPhaserObject.destroy();
        if(battle.attackingSquad.canGo(squad.case))
        {
            drawAttack(battle.attackingSquad.action);
        }
        else
        {
            removeBattle(battle);
            battle.attackingSquad.action = null;
        }
    });

    if(squad.action != null && squad.action.type == "attack")
    {
        squad.action.arrowPhaserObject.destroy();
        if(squad.canGo(squad.action.target.case))
        {
            drawAttack(squad.action);
        }
        else
        {
            removeBattle(squad.action);
            squad.action.target.action = null;
            squad.action = null;
        }
    }
}

////////////////////////////////////////////
///////////////// SUPPORT //////////////////
////////////////////////////////////////////

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