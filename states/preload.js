var preload = function(game){}

preload.prototype = {
	preload: function(){ 
        //clearGameCache(this.game);
        game.load.json('casemap', 'assets/cases.json');
        game.load.json('player1', 'assets/player1.json');
        game.load.json('player2', 'assets/player2.json');
        game.load.image('squad', 'assets/squad.png');
        game.load.image('case', 'assets/case2.png');
        game.load.image('overLapedCase', 'assets/moveOveralped.png');
        game.load.image('supportLapedCase', 'assets/overlapedSupportCase.png');
        game.load.image('badOverLapedCase', 'assets/badOverLapedCase.png');
        game.load.spritesheet('button', 'assets/nextButton.PNG', 125, 55);
        game.load.image('space', 'assets/deep-space.jpg');
        game.load.image('attackOverLaped', 'assets/attackOverLaped.png');
        game.load.image('red-arrow', 'assets/red-arrow.png');
        
        
	},
  	create: function(){
        this.game.add.tileSprite(0, 0, game.width, game.height, 'space');
        this.game.players = [];
        this.game.caseTable = createCases(this.game.cache.getJSON('casemap'));
        this.game.players.push(createPlayer(this.game.cache.getJSON('player1'), 0, this.game.caseTable.slice(Math.round(this.game.caseTable.length / 2), this.game.caseTable.length)));
        this.game.players.push(createPlayer(this.game.cache.getJSON('player2'), 1, this.game.caseTable.slice(0 , Math.round(this.game.caseTable.length / 2))));
        this.game.state.start("Positionning");
        this.game.turn = new oneTurn();
	}
}

var oneTurn = function()
{
    this.player = null;
}

function clearGameCache (game) {
    game.cache = new Phaser.Cache(game);
    game.load.reset();
    game.load.removeAll();
}

var onePlayer = function(name, number)
{
    this.name = name;
    this.number = number;
    this.availableCasePositioning = null;
}

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

var lifeBar = function(armor, shield)
{
    this.armor = armor;
    this.shield = shield;
    this.phaserObject = null;
    this.textObject = null;
}

oneSquad.prototype = {
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
    }
};



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

var oneFleat = function(name, player)
{
    this.name = name;
    this.squads = [];
    this.player = player;
    player.fleat = this;
};

oneFleat.prototype = {
    addSquad : function(squad)
    {
        this.squads.push(squad);
    }
};

var onePlayer = function(name, number, availableCasePositioning)
{
    this.name = name;
    this.fleat = null;
    this.blocked = true;
    this.number = number;
    this.availableCasePositioning = availableCasePositioning;
};

function createFleat(player, fleatJson)
{
    var fleat = new oneFleat(fleatJson.name, player);
    fleatJson.squads.forEach(function(squadJson){
        fleat.addSquad(createSquad(fleat, squadJson));
    });
    return fleat;
}

function createSquad(fleat, squadJson)
{
    var squad = new oneSquad(squadJson.name, fleat);
    squadJson.ships.forEach(function(shipJson){
        squad.addShip(new ship(shipJson));
    });
    squad.createLifeBar();
    return squad;
}

function createPlayer(playerJson, number, availableCasePositioning)
{
    var player = new onePlayer(playerJson.name, number, availableCasePositioning);
    player.fleat = createFleat(player, playerJson.fleat );
    return player;
}




var oneCase = function(name,number,width,height){
    this.position = {};
    this.position.x = null;
    this.position.y = null;
    this.number = number;
    this.name = name;
    this.squad = null;
    this.left = null;
    this.right = null;
    this.top = null;
    this.bottom = null;
    this.height = height;
    this.width = width;
    this.phaserObject = null;
};



function findCasePosition(elem)
{
    var theElement = elem;
    while(theElement.left != null)
    {
        theElement = theElement.left;
        if(theElement.x !== null)
        {
            elem.position.x =  elem.position.x + theElement.position.x + theElement.width;
            break;
        }
        elem.position.x = elem.position.x + theElement.width;
    }
    var theElement = elem;
    while(theElement.top != null)
    {
        theElement = theElement.top;
        if(theElement.y !== null)
        {
            elem.position.y = theElement.position.y + theElement.height;
            break;
        }
        elem.position.y = elem.position.y + theElement.height;
    }
    if(elem.position.y == null)
    {
        elem.position.y = 0;
    }
    if(elem.position.x == null)
    {
        elem.position.x = 0;
    }
}

function createCases (casemap)
{
    var caseByLine = 4;
    var lines = 4;
    var caseTable = [];
    casemap.forEach(function(elem){
        let newCase = new oneCase(elem.name, elem.number, elem.height, elem.width);
        caseTable[elem.number] = newCase;
    });

    casemap.forEach(function(elem){
        caseTable[elem.number].left = (elem.links.left !== null) ? caseTable[elem.links.left] : null;
        caseTable[elem.number].right = (elem.links.right !== null) ? caseTable[elem.links.right] : null;
        caseTable[elem.number].top = (elem.links.top !== null) ? caseTable[elem.links.top] : null;
        caseTable[elem.number].bottom = (elem.links.bottom !== null) ? caseTable[elem.links.bottom] : null;
    });

    caseTable.forEach(function(elem){
        findCasePosition(elem);
    });
    return caseTable;
}