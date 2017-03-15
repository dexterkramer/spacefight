var oneCard = function(object, type)
{
    this.object = object;
    this.type = type;
    this.handler = null;
    this.phaserObject = null;
    this.isDragged = false;
}

oneCard.prototype = {
    setHandler : function(handler)
    {
        this.handler = handler;
    },
    drawCard : function()
    {
        if(this.handler !== null)
        {
            if(this.type == "order")
            {
                drawCardOrder(this, this.handler.x, this.handler.y);
                enableDragCard(this, dragCard, stopDragCard);
            }   
            else if(this.type == "squad")
            {
                drawCardSquad(this, this.handler.x, this.handler.y);
                enableDragCard(this, dragCard, stopDragCard);
            }
        }
    },
    destroy : function()
    {
        this.handler.card = null;
        this.handler = null;
        this.phaserObject.destroy();
        this.phaserObject = null;
        this.object = null;
    }
}

function createCard(object, type)
{
    return new oneCard(object, type);
}
