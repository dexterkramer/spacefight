var ship = function(infos)
{
    this.infos = infos;
    this.createLifeBar();
};

ship.prototype = {
    createLifeBar : function()
    {
        this.lifeBar = new lifeBar(this.infos.armor, this.infos.shield);
    }
};