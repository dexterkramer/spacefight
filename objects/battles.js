var battle = function(attackingSquad, target)
{
    this.attackingSquad = attackingSquad;
    this.target = target;
    this.isProcessed = 0;
    this.arrowPhaserObject = null;
}

battle.prototype = {
    process : function(turnNumber)
    {
        if(this.isProcessed == turnNumber)
            return;
        this.attackingSquad.initFinalArmor();
        this.target.initFinalArmor();
        var modifiers = [];
        var flankBonus = this.attackingSquad.calcultateFlankingBonus(this.target);
        if(flankBonus)
        {
            modifiers.push(flankBonus);
        }
        this.attackingSquad.attack(this.target, modifiers);
        var defnedingAgainstBattle = isDefendingAgainst(this.target, this.attackingSquad);
        if(defnedingAgainstBattle)
        {
            defnedingAgainstBattle.attackingSquad.attack(this.attackingSquad, []);
            defnedingAgainstBattle.isProcessed = turnNumber;
        }
        var toFriendlyFires = this.attackingSquad.getFriendlyFire(this.target);
        this.attackingSquad.applyFriendlyFire(toFriendlyFires);
        this.target.applyDamages();
        this.attackingSquad.applyDamages();
        this.attackingSquad.updateLifeBar();
        this.target.updateLifeBar();
        this.target.drawLifeBar();
        this.attackingSquad.drawLifeBar();
        this.isProcessed = turnNumber;
    }
};

function createBattle(suqad, target)
{
    var theBattle = new battle(suqad, target);
    return theBattle;
}