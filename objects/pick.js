var onePick = function(player)
{
    this.player = player;
    this.pile = [];
}

onePick.prototype = {
    initPick : function()
    {
        var ref = this;
        this.player.orders.forEach(function(order){
            ref.pile.push(createCard(order, "order"));
        });
        this.player.fleat.squads.forEach(function(squad){
            ref.pile.push(createCard(squad, "squad"));
        });
    },
    drawOne : function()
    {
        let selectIndex = Math.floor(Math.random()*this.pile.length);
        var selectedCard = this.pile[selectIndex];
        this.pile.slice(selectIndex,1);
        return selectedCard;
    }
};

function createPick(player)
{
    var pick = new onePick(player);
    pick.initPick();
    return pick;
}