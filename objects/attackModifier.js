var AttackModifier = function(turns)
{
    this.damageModifier = 1;
    this.turns = turns;
    this.type = "AttackModifier";
}

AttackModifier.prototype = {
    setDamageModifier : function(damageModifier)
    {
        this.damageModifier = damageModifier;
    }
};

function createDamageModifier(damageModifier, turns)
{
    var attackModifier = new AttackModifier(turns);
    attackModifier.setDamageModifier(damageModifier);
    return attackModifier;
}