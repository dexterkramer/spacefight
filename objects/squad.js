var oneSquad = function(name, fleat)
{
    this.name = name;
    this.fleat = fleat;
    this.ships = [];
    this.case = null;
    this.action = null;
    this.phaserObject = null;
    this.overlapedCase = null;
    this.movesAllowed = 0;
    this.movedFrom = null;
    this.tempAction = null;
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
        this.phaserObject.x = this.overlapedCase.phaserObject.x;
        this.phaserObject.y = this.overlapedCase.phaserObject.y;
    },
    getOverlapedCase : function(caseTable, game)
    {
        let overLapValue = 0;
        let overLapCase = null;
        var ref = this;
        caseTable.forEach(function(oneCase){
            if(!game.physics.arcade.overlap(ref.phaserObject, oneCase.phaserObject, function(esc,theCase) {
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
        text = game.add.text(lifeBar.x, lifeBar.y - (lifeBarHeight / 2) - 3, this.lifeBar.armor + "/" + this.lifeBar.armor , style);
        text.x = ((lifebarWidth * percent) / 2) - (text.width / 2);
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
        this.ships.forEach(function(ship){
            totalArmor += ship.lifeBar.armor;
            totalShield += ship.lifeBar.shield;
        });
        this.lifeBar = new lifeBar(totalArmor, totalShield);
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
            if(this.case.left == oneCase || this.case.right == oneCase || this.case.top == oneCase || this.case.bottom == oneCase)
            {
                return true;
            }
            if(this.case.right !== null && (this.case.right.bottom == oneCase || this.case.right.top == oneCase ))
            {
                return true;
            }
            if(this.case.left !== null && (this.case.left.bottom == oneCase || this.case.left.top == oneCase ))
            {
                return true;
            }
            if(this.case.top !== null && (this.case.top.right == oneCase || this.case.top.left == oneCase ))
            {
                return true;
            }
            if(this.case.bottom !== null && (this.case.bottom.right == oneCase || this.case.bottom.left == oneCase ))
            {
                return true;
            }
        }
    },
    attack : function(defendingSquad)
    {
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
        shipGroups.forEach(function(shipGroup){
            if(defendingShipArray.length >= 0)
            {
                let selectedEnnemyIndex = Math.floor(Math.random()*defendingShipArray.length);
                shipGroup.forEach(function(ship){
                    if(typeof defendingShipArray[selectedEnnemyIndex] !== "undefined")
                    {
                        defendingShipArray[selectedEnnemyIndex].lifeBar.tempArmor -= ship.infos.firePower;
                        defendingShipArray[selectedEnnemyIndex].lifeBar.finalArmor -= ship.infos.firePower;
                        if(defendingShipArray[selectedEnnemyIndex].lifeBar.tempArmor <= 0)
                        {
                            defendingShipArray.splice(selectedEnnemyIndex, 1);
                        }
                    }
                });
            }
        });
    }
};