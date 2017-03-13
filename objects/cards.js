var oneCard = function(object, type)
{
    this.object = object;
    this.type = type;
    this.handler = null;
    this.phaserObject = null;
}

oneCard.prototype = {
    setHandler : function(handler)
    {
        this.handler = handler;
    },
    drawCard : function(game)
    {
        if(this.handler !== null)
        {
            drawCard(this, this.handler.x, this.handler.y);
        }
    }
}

function createCard(object, type)
{
    return new oneCard(object, type);
}
