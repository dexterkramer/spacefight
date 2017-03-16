var oneSquad = function(name, fleat)
{
    this.name = name;
    this.fleat = fleat;
    this.ships = [];
    this.case = null;
    this.action = null;
    this.defendAgainst = [];
    this.phaserObject = null;
    this.overlapedCase = null;
    this.movesAllowed = 1;
    this.movedFrom = [];
    this.tempAction = null;
    this.attackModifiersArray = [];
    this.isDragged = false;
};

oneSquad.prototype = {
    applyMove : function()
    {
        if(this.case !== null)
        {
            this.case.squad = null;
        }
        //linking the squad to the new case.
        this.case = this.overlapedCase;
        this.overlapedCase.squad = this;

        // move the sprite of the esouade to his new position 
        this.phaserObject.x = this.overlapedCase.phaserObject.middleX;
        this.phaserObject.y = this.overlapedCase.phaserObject.middleY;
    },
    buff : function(order)
    {
        var ref = this;
        order.effects.forEach(function(effect){
            if(effect.type == "damage")
            {
                ref.attackModifiersArray.push(createDamageModifier(effect.value, -1));
            }
        });
    },
    drawLifeBar : function()
    {
        var lifeBarPhaserObject = this.lifeBar.draw();
        this.phaserObject.addChild(lifeBarPhaserObject);
        this.phaserObject.addChild(lifeBarPhaserObject.textObject);
    },
    addShip : function(ship)
    {
        this.ships.push(ship);
    },
    createLifeBar : function()
    {
        var totalArmor = 0;
        var totalShield = 0;
        var totalMaxArmor = 0;
        this.ships.forEach(function(ship){
            totalArmor += ship.lifeBar.armor;
            totalShield += ship.lifeBar.shield;
            totalMaxArmor += ship.lifeBar.maxArmor;
        });
        this.lifeBar = new lifeBar(totalArmor, totalShield, totalMaxArmor);
    },
    updateLifeBar : function()
    {
        var totalArmor = 0;
        var totalShield = 0;
        this.ships.forEach(function(ship){
            totalArmor += ship.lifeBar.armor;
            totalShield += ship.lifeBar.shield;
        });
        this.lifeBar.setArmor(totalArmor);
        this.lifeBar.setShield(totalShield);
    },
    calculFirePower : function()
    {
        var totalFirePower = 0;
        this.ships.forEach(function(ship){
            if(ship.lifeBar.armor > 0)
            {
                totalFirePower += ship.infos.firePower;
            }
        });
        return totalFirePower;
    },
    removeFromBattle : function()
    {
        this.fleat.undeploySquad(this);
        this.case.squad = null;
        this.case = null;
        if(this == this.fleat.capitalShip)
        {
            loose(this.fleat.player);
        }
    },
    canDefend : function()
    {
        if(this.action != null && this.action.type == "defend")
        {
            this.addAttackModifier(createDamageModifier(0.9,1));
        }
        return true;
    },
    applyDamages : function()
    {
        this.ships.forEach(function(ship){
            ship.lifeBar.armor = ship.lifeBar.finalArmor;
        });
        
    },
    initFinalArmor : function()
    {
        this.ships.forEach(function(ship){
            ship.lifeBar.finalArmor = ship.lifeBar.armor; 
        });
    },
    getAvailableShips : function()
    {
        var shipArray = [];
        this.ships.forEach(function(ship, index){
            if(ship.lifeBar.armor > 0)
            {
                ship.lifeBar.tempArmor = ship.lifeBar.armor;
                shipArray.push(ship);
            }
        });
        return shipArray;
    },
    canGo : function(oneCase)
    {
        if(this.case !== null)
        {
            if(this.case.left == oneCase)
            {
                return 1;
            }   
            if(this.case.topLeft == oneCase)
            {
                return 2;
            }
            if(this.case.topRight == oneCase)
            {
                return 3;
            }
            if(this.case.right == oneCase)
            {
                return 4;
            }
            if(this.case.bottomRight == oneCase)
            {
                return 5;
            }
            if(this.case.bottomLeft == oneCase)
            {
                return 6;
            }

        }
        return false;
    },
    calcultateFlankingBonus : function(defendingSquad)
    {
        var defendingAgainst = getDefendingAgainst(defendingSquad);

        if(defendingAgainst.length > 0 && defendingAgainst[0].attackingSquad != this)
        {
            var firstToAttack = defendingAgainst[0].attackingSquad;
            var firstToAttackFromFlankNumber = defendingSquad.canGo(firstToAttack.case);
            var attackedFromFlankNumber = defendingSquad.canGo(this.case);
            var plusOne = (attackedFromFlankNumber == 6) ? 1 : attackedFromFlankNumber + 1;
            var lessOne = (attackedFromFlankNumber == 1) ? 6 : attackedFromFlankNumber - 1;
            var plusThree = ((attackedFromFlankNumber + 3) > 6) ? attackedFromFlankNumber + 3 - 6: attackedFromFlankNumber + 3;
            if(firstToAttackFromFlankNumber == plusOne || firstToAttackFromFlankNumber == lessOne)
            {
                return false;
            }
            else if(firstToAttackFromFlankNumber == plusThree)
            {
                return createDamageModifier(2,1);
            }
            else
            {
                return createDamageModifier(1.5,1);
            }
        }
        return false;
    },
    getFriendlyFire : function(defendingSquad)
    {
        var ref = this;
        var toFriendlyFire = [];
        var defendingAgainst = getDefendingAgainst(defendingSquad);
        if(defendingAgainst.length > 0)
        {
            defendingAgainst.forEach(function(battle){
                var hasAttackedFromFlankNumber = defendingSquad.canGo(battle.attackingSquad.case);
                var attackedFromFlankNumber = defendingSquad.canGo(ref.case);
                var plusOne = (attackedFromFlankNumber == 6) ? 1 : attackedFromFlankNumber + 1;
                var lessOne = (attackedFromFlankNumber == 1) ? 6 : attackedFromFlankNumber - 1;
                if(hasAttackedFromFlankNumber == plusOne || hasAttackedFromFlankNumber == lessOne)
                {
                    toFriendlyFire.push(battle.attackingSquad);
                }
            });
        }
        return toFriendlyFire;
    },
    applyFriendlyFire : function(toFriendlyFire)
    {
        var ref = this;
        toFriendlyFire.forEach(function(squad){
            var modifiers = [];
            modifiers.push(createDamageModifier(0.2,1));
            ref.attack(squad, modifiers);
            squad.applyDamages();
            squad.updateLifeBar();
            squad.drawLifeBar();
            if(squad.lifeBar.armor <= 0)
            {
                squad.removeFromBattle();
            }
        });
    },
    defend : function(defendingSquad, modifiers)
    {
        var attackingModifierArrayTmp = this.attackModifiersArray.slice(0,this.attackModifiersArray.length);
        if(typeof modifiers != "undefined" && modifiers != null)
        {
            modifiers.forEach(function(modifier){
                if(modifier.type == "AttackModifier")
                {
                    attackingModifierArrayTmp.push(modifier);
                }
            });
        }
        var attackingShipArray = this.getAvailableShips();
        var defendingShipArray = defendingSquad.getAvailableShips();
        var shipGroups = [];
        while(attackingShipArray.length > 0)
        { 
            let i;
            let selectedShips = [];
            // ships focus ennemies ship 3 v 1 
            for(i = 0; i < 3 && attackingShipArray.length > 0; i++)
            {
                let selectIndex = Math.floor(Math.random()*attackingShipArray.length);
                selectedShips.push(attackingShipArray[selectIndex]);
                attackingShipArray.splice(selectIndex, 1);
            }
            shipGroups.push(selectedShips);
        }
        var ref = this;
        shipGroups.forEach(function(shipGroup){
            if(defendingShipArray.length >= 0)
            {
                let selectedEnnemyIndex = Math.floor(Math.random()*defendingShipArray.length);
                shipGroup.forEach(function(ship){
                    if(typeof defendingShipArray[selectedEnnemyIndex] !== "undefined")
                    {
                        ship.attack(defendingShipArray[selectedEnnemyIndex], attackingModifierArrayTmp);
                        if(defendingShipArray[selectedEnnemyIndex].lifeBar.tempArmor <= 0)
                        {
                            defendingShipArray.splice(selectedEnnemyIndex, 1);
                        }
                    }
                });
            }
        });
    },
    attack : function(defendingSquad, modifiers)
    {
        var attackingModifierArrayTmp = this.attackModifiersArray.slice(0,this.attackModifiersArray.length);
        if(typeof modifiers != "undefined" && modifiers != null)
        {
            modifiers.forEach(function(modifier){
                if(modifier.type == "AttackModifier")
                {
                    attackingModifierArrayTmp.push(modifier);
                }
            });
        }
        
        var attackingShipArray = this.getAvailableShips();
        var defendingShipArray = defendingSquad.getAvailableShips();
        var shipGroups = [];
        while(attackingShipArray.length > 0)
        { 
            let i;
            let selectedShips = [];
            // ships focus ennemies ship 3 v 1 
            for(i = 0; i < 3 && attackingShipArray.length > 0; i++)
            {
                let selectIndex = Math.floor(Math.random()*attackingShipArray.length);
                selectedShips.push(attackingShipArray[selectIndex]);
                attackingShipArray.splice(selectIndex, 1);
            }
            shipGroups.push(selectedShips);
        }
        var ref = this;
        shipGroups.forEach(function(shipGroup){
            if(defendingShipArray.length >= 0)
            {
                let selectedEnnemyIndex = Math.floor(Math.random()*defendingShipArray.length);
                shipGroup.forEach(function(ship){
                    if(typeof defendingShipArray[selectedEnnemyIndex] !== "undefined")
                    {
                        ship.attack(defendingShipArray[selectedEnnemyIndex], attackingModifierArrayTmp);
                        if(defendingShipArray[selectedEnnemyIndex].lifeBar.tempArmor <= 0)
                        {
                            defendingShipArray.splice(selectedEnnemyIndex, 1);
                        }
                    }
                });
            }
        });
        //ref.movesAllowed = 0;
    },
    disableDrag : function()
    {
        this.phaserObject.input.disableDrag();
    },
    getAvailableSupportedShip : function()
    {
        var shipArray = [];
        this.ships.forEach(function(ship, index){
            if(ship.lifeBar.armor > 0 && ship.lifeBar.armor < ship.lifeBar.maxArmor)
            {
                shipArray.push(ship);
            }
        });
        return shipArray;
    },
    support : function(target)
    {
        var supportingShipArray = this.getAvailableShips();
        var targetShipArray = target.getAvailableSupportedShip();
        if(targetShipArray.length == 0 || supportingShipArray.length == 0)
        {
            return false;
        }
        supportingShipArray.forEach(function(ship){
            let selectedTargetIndex = Math.floor(Math.random()*targetShipArray.length);
            targetShipArray[selectedTargetIndex].lifeBar.armor += ship.infos.support;
            if(targetShipArray[selectedTargetIndex].lifeBar.armor >= targetShipArray[selectedTargetIndex].lifeBar.maxArmor)
            {
                targetShipArray[selectedTargetIndex].lifeBar.armor = targetShipArray[selectedTargetIndex].lifeBar.maxArmor;
                targetShipArray.splice(selectedTargetIndex, 1);
            }
        });
        // after supporting a squad, one squad cannot move but can perform an attack, with -70% damages
        this.movesAllowed = 0;
        this.addAttackModifier(createDamageModifier(0.7,1));
        return true;
    },
    addAttackModifier : function(attackModifier)
    {
        this.attackModifiersArray.push(attackModifier);
    },
    resetModifiers : function()
    {
        var toRemove = [];
        this.attackModifiersArray.forEach(function(modifier, index){
            modifier.turns -= 1;
            if(modifier.turns == 0)
            {
                toRemove.push(index);
            }
        });
        var ref = this;
        toRemove.forEach(function(indexToRemove){
            ref.attackModifiersArray.splice(indexToRemove, 1);
        });
    }
};