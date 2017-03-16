var TheGame = function(game){
};
  
TheGame.prototype = {
  	create: function(){
        this.game.add.tileSprite(0, 0, game.width, game.height, 'space');
        this.game.turn.number = 0;
        this.game.battles = [];
        this.game.looser = [];
        this.game.eliminatedPlayers = [];
        this.game.infos = { tourInfos : null};
        this.game.battleInfos = null;
        drawCases();
        drawAllSquads();
        nextTurn();
        button = this.game.add.button(600, 600, 'button', nextTurn, this, 1, 0, 1);
      },
    update : function(){
        checkLoosers();
        this.game.caseTable.forEach(function(oneCase){
            oneCase.NotOverLaped();
        });
        checkOverLapSquad(this.game.turn.player,this.game.caseTable, OverLapGamingDraggingManagment);
        checkOverLapCard(this.game.turn.player,this.game.caseTable, this.game.turn.player.availableCaseDeploying, OverLapGamingCardDraggingManagment);
    }
}

//////////////////////////////////////////////////////////////////
////////////////////////// GAME MECHANICS ////////////////////////
//////////////////////////////////////////////////////////////////

function checkLoosers()
{
    if(this.game.looser.length > 0)
    {
        var ref = this;
        var i;
        var initLenght = this.game.players.length;
        for(i = 0; i < initLenght; i++)
        {
            var looserIndex = this.game.players.findIndex(function(elem){
                return ref.game.looser.indexOf(elem) != -1;
            });
            if(looserIndex != -1)
            {
                this.game.eliminatedPlayers.push(this.game.players[looserIndex]);
                this.game.players.splice(looserIndex, 1);
            }
        }
        if(this.game.players.length <= 1)
        {
            finishGame();
        }
    }
}

function finishGame()
{
    refreshInfos();
    //console.log("finish !!!");
    if(this.game.players.length == 1)
    {
        //console.log(this.game.players[0].name + " win ! ");
    }
    this.game.eliminatedPlayers.forEach(function(player){
        //console.log(player.name + " looose, booohoohoo !!!!");
    });
}

function refreshInfos()
{
    if(this.game.infos.tourInfos != null && this.game.infos.tourInfos.phaserObject != null)
    {
        this.game.infos.tourInfos.phaserObject.destroy();
    }
    if(this.game.players.length <= 1)
    {
        if(this.game.players.length == 1)
        {
            var infosTourX = 700;
            var infosTourY = 100;
            var textTour = this.game.turn.player.name+ " win the game !";
            var style = { font: "20px Arial", fill: "#ff0044"/*, wordWrap: false, wordWrapWidth: lifeBar.width, /*align: "center", backgroundColor: "#ffff00"*/ };
            var text = this.game.add.text(infosTourX, infosTourY, textTour , style);
            text.anchor.set(0 , 0);
            this.game.infos.tourInfos = {};
            this.game.infos.tourInfos.phaserObject = text;
        }
        else
        {
            var infosTourX = 700;
            var infosTourY = 100;
            var textTour = "DRAW !";
            var style = { font: "20px Arial", fill: "#ff0044"/*, wordWrap: false, wordWrapWidth: lifeBar.width, /*align: "center", backgroundColor: "#ffff00"*/ };
            var text = this.game.add.text(infosTourX, infosTourY, textTour , style);
            text.anchor.set(0 , 0);
            this.game.infos.tourInfos = {};
            this.game.infos.tourInfos.phaserObject = text;
        }
    }
    else
    {
        if(this.game.turn.player != null)
        {
            var infosTourX = 700;
            var infosTourY = 100;
            var textTour = " Turn : " + this.game.turn.player.name;
            var style = { font: "20px Arial", fill: "#ff0044"/*, wordWrap: false, wordWrapWidth: lifeBar.width, /*align: "center", backgroundColor: "#ffff00"*/ };
            var text = this.game.add.text(infosTourX, infosTourY, textTour , style);
            text.anchor.set(0 , 0);
            this.game.infos.tourInfos = {};
            this.game.infos.tourInfos.phaserObject = text;
        }
    }
}

function nextTurn()
{
    this.game.battles = [];
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
    refreshInfos();
    this.game.turn.player.resetSquadsActions();
    this.game.turn.player.drawOneCard();
    this.game.turn.player.showCards();
    enableDrag(this.game.turn.player, dragSquad, stopDragSquadGaming);
}

function loose(player)
{
    this.game.looser.push(player);
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
                enableDragSquad(card.object, dragSquad, stopDragSquadGaming);
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
    }
}

function removeBattleInfos()
{
    if(this.game.battleInfos != null)
    {
        if(this.game.battleInfos.squadTextPhaserObject != null)
        {
            this.game.battleInfos.squadTextPhaserObject.destroy();
            this.game.battleInfos.squadTextPhaserObject = null;
        }
        if(this.game.battleInfos.ennemyTextPhaserObject != null)
        {
            this.game.battleInfos.ennemyTextPhaserObject.destroy();
            this.game.battleInfos.ennemyTextPhaserObject = null;
        }
        /*if(this.game.battleInfos.flankBonusTextPhaserObject != null)
        {
            this.game.battleInfos.flankBonusTextPhaserObject.destroy();
            this.game.battleInfos.flankBonusTextPhaserObject = null;
        }*/
    }
    this.game.battleInfos = null;
}

function createBattleInfos(squad, target, toFriendlyFire)
{
    if(this.game.battleInfos != null && this.game.battleInfos.squad == squad && this.game.battleInfos.target == target)
    {
        return false;
    }
    var infos = {};
    infos.target = target;
    infos.squad = squad;
    infos.firePower = squad.calculFirePower();
    infos.armor = squad.lifeBar.armor;
    infos.ennemyFirePower = target.calculFirePower();
    infos.ennemyArmor = target.lifeBar.armor;
    infos.toFriendlyFire = toFriendlyFire;
    var flankBonus = squad.calcultateFlankingBonus(target);
    infos.flankBonus = [];
    if(flankBonus)
    {
        infos.flankBonus.push(flankBonus);
    }

    return infos;
}

function refreshBattleInfos()
{
    var infosBattleX = 700;
    var infosBattleY = 350;
    var textSquadName = this.game.battleInfos.squad.name;
    var textFirePower = "\nFire Power : " + this.game.battleInfos.firePower; 
    var textArmor = "\nArmor : " + this.game.battleInfos.armor;
    var textEnnemyName = this.game.battleInfos.target.name;
    var textEnnemyFirePower = "\nFire Power : " + this.game.battleInfos.ennemyFirePower; 
    var textEnnemyArmor = "\nArmor : " + this.game.battleInfos.ennemyArmor;
    var textFriendlyFire = "";
    if(this.game.battleInfos.toFriendlyFire.length > 0)
    {   
        textFriendlyFire = "\n FriendlyFire : ";
        this.game.battleInfos.toFriendlyFire.forEach(function(toFriendly){
            textFriendlyFire += "\n" + toFriendly.name;
        });
    }

    var textFlankBonus = "";
    var yPosToAdd = 0;
    this.game.battleInfos.flankBonus.forEach(function(bonus){
        yPosToAdd += 10;
        textFlankBonus += "\n flank bonus : " + bonus.damageModifier;
    });

    var style = { font: "20px Arial", fill: "#20D113"/*, wordWrap: false, wordWrapWidth: lifeBar.width, /*align: "center", backgroundColor: "#ffff00"*/ };
    var text = this.game.add.text(infosBattleX, infosBattleY, textSquadName + textFirePower + textArmor + textFlankBonus, style);
    text.anchor.set(0 , 0);
    this.game.battleInfos.squadTextPhaserObject = text;

    var infosBattleX = 700;
    var infosBattleY = 450 + yPosToAdd;

    var styleEnnemy = { font: "20px Arial", fill: "#ff0044"/*, wordWrap: false, wordWrapWidth: lifeBar.width, /*align: "center", backgroundColor: "#ffff00"*/ };
    var textEnnemy = this.game.add.text(infosBattleX, infosBattleY, textEnnemyName + textEnnemyFirePower + textEnnemyArmor + textFriendlyFire, styleEnnemy);
    textEnnemy.anchor.set(0 , 0);
    this.game.battleInfos.ennemyTextPhaserObject = textEnnemy;

}

function OverLapGamingDraggingManagment(squad)
{
    var battleInfos = false;
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
                    battleInfos = createBattleInfos(squad, squad.overlapedCase.squad, toFriendlyFires);
                    if(battleInfos)
                    {
                        removeBattleInfos();
                        this.game.battleInfos = battleInfos;
                        refreshBattleInfos();
                    }
                }
                else if(squad.overlapedCase.squad.fleat.player == squad.fleat.player )
                {
                    removeBattleInfos();
                    squad.overlapedCase.SupportOverLaped();
                }
            }
            else
            {
                if(squad.movedFrom[squad.movedFrom.length - 1] == squad.overlapedCase || squad.movesAllowed > 0)
                {  
                    removeBattleInfos();
                    squad.overlapedCase.OverLaped();
                }
            }
        }
        else
        {
            removeBattleInfos();
        }
    }
    else
    {
        removeBattleInfos();
    }

}

function stopDragSquadGaming(sprite, pointer)
{
    removeBattleInfos();
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
                //refreshAction(sprite.ref);
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
                if(sprite.ref.action == null)
                {
                    attack(sprite.ref, sprite.ref.overlapedCase.squad);
                    disableDragSquad(sprite.ref);
                }
                else
                {
                    returnPreviousCase(sprite.ref);
                }
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

function returnPreviousCase(squad)
{
    // don't move the squad to the case (attack the ennemy squad instead)
    if(squad.case !== null)
    {
        squad.phaserObject.x = squad.case.phaserObject.middleX;
        squad.phaserObject.y = squad.case.phaserObject.middleY;
    }
}

//////////////////////////////////////////////////////////////////////////
/////////////////////////// ATTACK ///////////////////////////////////////
//////////////////////////////////////////////////////////////////////////

function attack(squad, target)
{
    // don't move the squad to the case (attack the ennemy squad instead)
    if(squad.case !== null)
    {
        squad.phaserObject.x = squad.case.phaserObject.middleX;
        squad.phaserObject.y = squad.case.phaserObject.middleY;
    }
    squad.action = addBattle(squad, target);
    target.action = addBattle(target, squad);

    squad.initFinalArmor();
    target.initFinalArmor();
    var modifiers = [];
    var toFriendlyFires = squad.getFriendlyFire(target);
    squad.applyFriendlyFire(toFriendlyFires);
    if(toFriendlyFires.length > 0)
    {
        modifiers.push(createDamageModifier(1-(toFriendlyFires.length/10),1));
    }
    var flankBonus = squad.calcultateFlankingBonus(target);
    if(flankBonus)
    {
        modifiers.push(flankBonus);
    }
    squad.attack(target, modifiers);
    target.attack(squad,  []);
    target.applyDamages();
    squad.applyDamages();
    squad.updateLifeBar();
    target.updateLifeBar();
    target.drawLifeBar();
    squad.drawLifeBar();
    if(target.lifeBar.armor <= 0)
    {
        target.removeFromBattle();
    }
    if(squad.lifeBar.armor <= 0)
    {
        squad.removeFromBattle();
    }
    //drawAttack(squad.action);
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

function findUnprocessedBattle(attackingSquad)
{
    var index = this.game.battles.findIndex(function(elem){
        return elem.isProcessed == false && elem.attackingSquad == attackingSquad;
    });
    if(typeof index == "undefined" || index == null || index == -1)
    {
        return false;
    }
    return this.game.battles[index];
}

function isDefendingAgainst(defendingSquad, attackingSquad)
{
    defendingBattle = findUnprocessedBattle(defendingSquad);
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
        battle.process(actualTurn);
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