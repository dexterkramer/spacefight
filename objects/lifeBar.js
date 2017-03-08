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
    }
};