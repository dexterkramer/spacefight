var lifeBar = function(armor, shield, maxArmor)
{
    //this.startArmor = armor;
    this.armor = armor;
    this.startShielf = shield;
    this.shield = shield;
    this.phaserObject = null;
    this.textObject = null;
    this.tempArmor = armor;
    this.maxArmor = maxArmor;
    this.finalArmor = armor;
}

lifeBar.prototype = {
    setArmor : function(armor)
    {
        this.armor = armor;
    },
    setShield : function(shield)
    {
        this.shield = shield;
    },
    draw : function()
    {
        if(this.phaserObject !== null)
        {
            this.phaserObject.destroy();
        }
        if(this.textObject !== null)
        {
            this.textObject.destroy();
        }
        var lifeBarPhaser = drawLifeBar(this);
        this.phaserObject = lifeBarPhaser;
        this.textObject = lifeBarPhaser.textObject;
        return lifeBarPhaser;
    }
};