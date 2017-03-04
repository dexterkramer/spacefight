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
    getOverlapedCase : function(caseTable, game)
    {
        let overLapValue = 0;
        let overLapCase = null;
        var ref = this;
        caseTable.forEach(function(oneCase){
            if (oneCase.phaserObject.points.contains(game.input.x, game.input.y))
            {
                overLapCase = oneCase;
            }
        });
        return overLapCase;
    },
    drawLifeBar : function(game)
    {
        if(this.lifeBar.phaserObject !== null)
        {
            this.lifeBar.phaserObject.destroy();
        }
        if(this.lifeBar.textObject !== null)
        {
            this.lifeBar.textObject.destroy();
        }
        var lifeBar = game.add.graphics(lifeBarX, lifeBarY);
        var percent = this.lifeBar.armor / this.lifeBar.startArmor; 
        lifeBar.lineStyle(lifeBarHeight, getLifeBarColor(percent));
        lifeBar.lineTo(lifebarWidth * percent, 0);
        this.phaserObject.addChild(lifeBar);
        this.lifeBar.phaserObject = lifeBar;
        lifeBar.anchor.set(0, 0);
        var style = { font: "9px Arial",/* fill: "#ff0044", wordWrap: false, wordWrapWidth: lifeBar.width, /*align: "center", backgroundColor: "#ffff00"*/ };
        text = game.add.text(lifeBarX, lifeBar.y - (lifeBarHeight / 2) - 3, this.lifeBar.armor + "/" + this.lifeBar.maxArmor , style);
        text.anchor.set(0 , 0);
        text.x = lifeBarX + ((lifebarWidth * percent) / 2) - (text.width / 2);
        this.lifeBar.textObject = text;
        this.phaserObject.addChild(text);
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
        if(defendingSquad.defendAgainst.length > 0)
        {
            var firstToAttack = defendingSquad.defendAgainst[0];
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
                return createDamageModifier(2,1);
            }
        }
        return false;
    },
    getFriendlyFire : function(defendingSquad)
    {
        var ref = this;
        var toFriendlyFire = [];
        if(defendingSquad.defendAgainst.length > 0)
        {
            defendingSquad.defendAgainst.forEach(function(hasAttacked){
                var hasAttackedFromFlankNumber = defendingSquad.canGo(hasAttacked.case);
                var attackedFromFlankNumber = defendingSquad.canGo(ref.case);
                var plusOne = (attackedFromFlankNumber == 6) ? 1 : attackedFromFlankNumber + 1;
                var lessOne = (attackedFromFlankNumber == 1) ? 6 : attackedFromFlankNumber - 1;
                var plusThree = ((attackedFromFlankNumber + 3) > 6) ? attackedFromFlankNumber + 3 - 6: attackedFromFlankNumber + 3;
                if(hasAttackedFromFlankNumber == plusOne || hasAttackedFromFlankNumber == lessOne)
                {
                    toFriendlyFire.push(hasAttacked);
                }
            });
        }
        return toFriendlyFire;
    },
    applyFriendlyFire : function(toFriendlyFire, game)
    {
        var ref = this;
        toFriendlyFire.forEach(function(squad){
            var modifiers = [];
            modifiers.push(createDamageModifier(0.2,1));
            ref.attack(squad, modifiers);
            squad.applyDamages();
            squad.updateLifeBar();
            squad.drawLifeBar(game);
        });
    },
    defend : function(defendingSquad, modifiers)
    {
        var attackingModifierArrayTmp = this.attackModifiersArray.slice(0,this.attackModifiersArray.length);
        if(typeof modifiers != "undefined" && modifiers != null)
        {
            modifiers.forEach(function(modifier){
                if(typeof modifiers == "AttackModifier")
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
                if(typeof modifiers == "AttackModifier")
                {
                    attackingModifierArrayTmp.push(modifier);
                }
            });
        }
        var flankBonus = this.calcultateFlankingBonus(defendingSquad);
        if(flankBonus)
        {
            attackingModifierArrayTmp.push(flankBonus);
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
        ref.movesAllowed = 0;
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
            if(modifier.turns <= 0)
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