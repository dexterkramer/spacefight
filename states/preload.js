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
        game.load.image('card', 'assets/card.jpg');
        
	},
  	create: function(){
        this.game.add.tileSprite(0, 0, game.width, game.height, 'space');
        this.game.players = [];
        this.game.caseTable = createCases(this.game.cache.getJSON('casemap'));
        this.game.players.push(createPlayer(this.game.cache.getJSON('player1'), 0, this.game.caseTable.slice( 12 , 19), this.game.caseTable.slice( 16 , 19)));
        this.game.players.push(createPlayer(this.game.cache.getJSON('player2'), 1, this.game.caseTable.slice( 0 , 7 ), this.game.caseTable.slice( 0 , 3 )));
        this.game.state.start("Positionning");
        this.game.turn = new oneTurn();
	}
}
