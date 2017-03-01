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

function clearGameCache (game) {
    game.cache = new Phaser.Cache(game);
    game.load.reset();
    game.load.removeAll();
}

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

function createCases(casemap)
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

    caseTable.forEach(function(oneCase){
        oneCase.findCasePosition();
    });
    return caseTable;
}