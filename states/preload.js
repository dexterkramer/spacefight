var preload = function(game){}

preload.prototype = {
	preload: function(){ 
        //clearGameCache(this.game);
        game.load.json('casemap', 'assets/cases.json');
        game.load.json('player1', 'assets/player1.json');
        game.load.json('player2', 'assets/player2.json');
        game.load.image('escouade', 'assets/escouade.jpg');
        game.load.image('case', 'assets/case.bmp');
        game.load.image('overLapedCase', 'assets/overlapedCase.bmp');
        game.load.image('badOverLapedCase', 'assets/badOverLapedCase.bmp');
        game.load.spritesheet('button', 'assets/nextButton.PNG', 125, 55);
        
	},
  	create: function(){
        this.game.caseTable = createCases(this.game.cache.getJSON('casemap'));
        this.game.player1 = createPlayer(this.game.cache.getJSON('player1'));
        this.game.player2 = createPlayer(this.game.cache.getJSON('player2'));
        this.game.state.start("Positionning");
	}
}

function clearGameCache (game) {
    game.cache = new Phaser.Cache(game);
    game.load.reset();
    game.load.removeAll();
}

var oneEscouade = function(name, fleat)
{
    this.name = name;
    this.fleat = fleat;
    this.ships = [];
    this.case = null;
    this.action = null;
    this.phaserObject = null;
    this.overlapedCase = null;
};

oneEscouade.prototype = {
    addShip : function(ship)
    {
        this.ships.push(ship);
    }
};

var ship = function(infos)
{
    this.infos = infos;
};

var oneFleat = function(name, player)
{
    this.name = name;
    this.escouades = [];
    this.player = player;
    player.fleat = this;
};

oneFleat.prototype = {
    addEscouade : function(escouade)
    {
        this.escouades.push(escouade);
    }
};

var onePlayer = function(name)
{
    this.name = name;
    this.fleat = null;
    this.blocked = true;
};

function createFleat(player, fleatJson)
{
    var fleat = new oneFleat(fleatJson.name, player);
    fleatJson.escouades.forEach(function(escouadeJson){
        fleat.addEscouade(createEscouade(fleat, escouadeJson));
    });
    return fleat;
}

function createEscouade(fleat, escouadeJson)
{
    var escouade = new oneEscouade(escouadeJson.name, fleat);
    escouadeJson.ships.forEach(function(shipJson){
        escouade.addShip(shipJson);
    });
    return escouade;
}

function createPlayer(playerJson)
{
    var player = new onePlayer(playerJson.name);
    player.fleat = createFleat(player, playerJson.fleat );
    return player;
}




var oneCase = function(name,number,width,height){
    this.position = {};
    this.position.x = null;
    this.position.y = null;
    this.number = number;
    this.name = name;
    this.escouade = null;
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

    caseTable.forEach(function(elem){
        elem.left = caseTable[(((elem.number % caseByLine) == 1) ? null : elem.number - 1)]; 
        elem.right = caseTable[(((elem.number % caseByLine) == 0) ? null : elem.number + 1)]; 
        elem.top = caseTable[((elem.number <= caseByLine) ? null : elem.number - caseByLine)]; 
        elem.bottom = caseTable[((elem.number > ((caseByLine * lines) - caseByLine)) ? null : elem.number + caseByLine)]; 
    });

    caseTable.forEach(function(elem){
        findCasePosition(elem);
    });
    return caseTable;
}