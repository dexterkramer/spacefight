function checkOverLap(player, caseTable, OverLapDraggingManagmentFunc)
{
    player.fleat.squads.forEach(function(squad){
        if(squad.isDragged)
        {
            let overLapedCase = squad.getOverlapedCase(caseTable, this.game);
            oldOverLapped = squad.overlapedCase;
            squad.overlapedCase = overLapedCase;
            OverLapDraggingManagmentFunc(squad, oldOverLapped);
        }
    });
}

function dragSquad(sprite, pointer)
{
    sprite.body.moves = false;
    sprite.ref.isDragged = true;
}

function stopDragPlayer(sprite)
{
    console.log("azezaeaze");
    // has the squad been dragged on a case ?
    if(sprite.ref.overlapedCase !== null)
    {
        sprite.ref.overlapedCase.NotOverLaped();
        // does the case already coutain an squad ?
        if(sprite.ref.overlapedCase.squad == null)
        {
            // if the squad is alreay on another case, remove it from the case.
            if(sprite.ref.case !== null)
            {
                sprite.ref.case.squad = null;
            }

            //linking the squad to the new case.
            sprite.ref.case = sprite.ref.overlapedCase;
            sprite.ref.overlapedCase.squad = sprite.ref;

            // move the sprite of the esouade to his new position 
            sprite.x = sprite.ref.overlapedCase.phaserObject.middleX;
            sprite.y = sprite.ref.overlapedCase.phaserObject.middleY;
        }
        else
        {
            // go here if the squad is moved to a case already countaining a fleet.
            // if the esouade had already a case : get back to the previous case.
            if(sprite.ref.case !== null)
            {
                sprite.x = sprite.ref.case.phaserObject.middleX;
                sprite.y = sprite.ref.case.phaserObject.middleY;
            }
            else
            {
                // else if the squad is not linked to a case : return to the original position.
                sprite.x = sprite.ref.originalX;
                sprite.y = sprite.ref.originalY;
            }
        }
    }
    else
    {
        // go here if the squad is not dragged on a case.
        // if the squad add a case previously : remove it.
        if(sprite.ref.case !== null)
        {
            sprite.ref.case.squad = null;
            sprite.ref.case = null;
        }

        // set the squad to the original position.
        sprite.x = sprite.ref.originalX;
        sprite.y = sprite.ref.originalY;
    }
}

function stopDragSquad(sprite, pointer)
{
    sprite.body.moves = false;
    sprite.ref.isDragged = false;
    stopDragPlayer(sprite);
}

function drawCases(game)
{
    /*
    cases = game.add.group();
    game.caseTable.forEach(function(elem){
        var oneCase = cases.create(elem.position.x, elem.position.y, 'case');
        this.game.physics.arcade.enable(oneCase);
        oneCase.scale.setTo(elem.width / oneCase.width,  elem.height / oneCase.height);
        elem.phaserObject = oneCase;
    });*/
/*
    var xStart = 50;

    var i;
    for(i = 0; i < 3; i++)
    {
        poly = new Phaser.Polygon([ new Phaser.Point(200, 100), new Phaser.Point(350, 100), new Phaser.Point(375, 200), new Phaser.Point(150, 200) ]);
    }*/
    var startx = 200;
    var starty = 100;
    var i;
    game.caseTable = [];
    for(i = 0; i < 3; i++)
    {
        var poly = new Phaser.Polygon([ new Phaser.Point(startx, starty), new Phaser.Point(startx+61, starty-35), new Phaser.Point(startx+122, starty), new Phaser.Point(startx + 122, starty+70), new Phaser.Point(startx + 61, starty+105), new Phaser.Point(startx, starty+70)  ]);
        

        var c = new oneCase("azeaz",1,121,121);
        var graphics = game.add.graphics(0, 0);
        graphics.beginFill(0xFF33ff);
        //graphics.lineStyle(10, 0xFF0000, 0.8);
        graphics.drawPolygon(poly.points);
        graphics.middleX = startx + 61;
        graphics.middleY = starty + 35;
        graphics.alpha= 0;
        graphics.endFill();
        graphics.points = poly;
        c.phaserObject = graphics;
        
        game.caseTable.push(c);


         var graphicsBorder = game.add.graphics(0, 0);
        graphicsBorder.lineStyle(5, 0xFF0000, 0.8);
        graphicsBorder.moveTo(startx,starty);
        graphicsBorder.lineTo(startx+61,starty-35);
        graphicsBorder.lineTo(startx+122,starty);
        graphicsBorder.lineTo(startx + 122,starty+70);
        graphicsBorder.lineTo(startx + 61,starty+105);
        graphicsBorder.lineTo(startx,starty+70);
        graphicsBorder.lineTo(startx,starty);

        graphicsBorder.alpha= 1;

        startx = startx+122;
    }    

    var startx = 200 - 61;
    var starty = 100 + 35 + 70;
    for(i = 0; i < 4; i++)
    {
        var poly = new Phaser.Polygon([ new Phaser.Point(startx, starty), new Phaser.Point(startx+61, starty-35), new Phaser.Point(startx+122, starty), new Phaser.Point(startx + 122, starty+70), new Phaser.Point(startx + 61, starty+105), new Phaser.Point(startx, starty+70)  ]);


        var c = new oneCase("azeaz",1,121,121);
        var graphics = game.add.graphics(0, 0);
        graphics.beginFill(0xFF33ff);
        //graphics.lineStyle(10, 0xFF0000, 0.8);
        graphics.drawPolygon(poly.points);
        graphics.middleX = startx + 61;
        graphics.middleY = starty + 35;
        graphics.alpha= 0;
        graphics.endFill();
        graphics.points = poly;
        c.phaserObject = graphics;
        
        game.caseTable.push(c);

        var graphicsBorder = game.add.graphics(0, 0);
        graphicsBorder.lineStyle(5, 0xFF0000, 0.8);
        graphicsBorder.moveTo(startx,starty);
        graphicsBorder.lineTo(startx+61,starty-35);
        graphicsBorder.lineTo(startx+122,starty);
        graphicsBorder.lineTo(startx + 122,starty+70);
        graphicsBorder.lineTo(startx + 61,starty+105);
        graphicsBorder.lineTo(startx,starty+70);
        graphicsBorder.lineTo(startx,starty);

        startx = startx+122;
    }  

    var startx = 200 - 61 - 61;
    var starty = 100 + 35 + 70 + 35 + 70;
    for(i = 0; i < 5; i++)
    {
        var poly = new Phaser.Polygon([ new Phaser.Point(startx, starty), new Phaser.Point(startx+61, starty-35), new Phaser.Point(startx+122, starty), new Phaser.Point(startx + 122, starty+70), new Phaser.Point(startx + 61, starty+105), new Phaser.Point(startx, starty+70)  ]);


        var c = new oneCase("azeaz",1,121,121);
        var graphics = game.add.graphics(0, 0);
        graphics.beginFill(0xFF33ff);
        //graphics.lineStyle(10, 0xFF0000, 0.8);
        graphics.drawPolygon(poly.points);
        graphics.middleX = startx + 61;
        graphics.middleY = starty + 35;
        graphics.points = poly;
        graphics.alpha= 0;
        graphics.endFill();
        c.phaserObject = graphics;
        
        game.caseTable.push(c);

        var graphicsBorder = game.add.graphics(0, 0);
        graphicsBorder.lineStyle(5, 0xFF0000, 0.8);
        graphicsBorder.moveTo(startx,starty);
        graphicsBorder.lineTo(startx+61,starty-35);
        graphicsBorder.lineTo(startx+122,starty);
        graphicsBorder.lineTo(startx + 122,starty+70);
        graphicsBorder.lineTo(startx + 61,starty+105);
        graphicsBorder.lineTo(startx,starty+70);
        graphicsBorder.lineTo(startx,starty);




        startx = startx+122;
    }  

    var startx = 200 - 61 - 61 + 61;
    var starty = 100 + 35 + 70 + 35 + 70 + 35 + 70;
    for(i = 0; i < 4; i++)
    {
        var poly = new Phaser.Polygon([ new Phaser.Point(startx, starty), new Phaser.Point(startx+61, starty-35), new Phaser.Point(startx+122, starty), new Phaser.Point(startx + 122, starty+70), new Phaser.Point(startx + 61, starty+105), new Phaser.Point(startx, starty+70)  ]);
        var c = new oneCase("azeaz",1,121,121);
        var graphics = game.add.graphics(0, 0);
        graphics.beginFill(0xFF33ff);
        //graphics.lineStyle(10, 0xFF0000, 0.8);
        graphics.drawPolygon(poly.points);
        graphics.middleX = startx + 61;
        graphics.middleY = starty + 35;
        graphics.points = poly;
        graphics.alpha= 0;
        graphics.endFill();
        c.phaserObject = graphics;
        
        game.caseTable.push(c);

        var graphicsBorder = game.add.graphics(0, 0);
        graphicsBorder.lineStyle(5, 0xFF0000, 0.8);
        graphicsBorder.moveTo(startx,starty);
        graphicsBorder.lineTo(startx+61,starty-35);
        graphicsBorder.lineTo(startx+122,starty);
        graphicsBorder.lineTo(startx + 122,starty+70);
        graphicsBorder.lineTo(startx + 61,starty+105);
        graphicsBorder.lineTo(startx,starty+70);
        graphicsBorder.lineTo(startx,starty);


        startx = startx+122;
    }  

    var startx = 200 - 61 - 61 + 61 + 61;
    var starty = 100 + 35 + 70 + 35 + 70 + 35 + 70 + 35 + 70;
    for(i = 0; i < 3; i++)
    {
        var poly = new Phaser.Polygon([ new Phaser.Point(startx, starty), new Phaser.Point(startx+61, starty-35), new Phaser.Point(startx+122, starty), new Phaser.Point(startx + 122, starty+70), new Phaser.Point(startx + 61, starty+105), new Phaser.Point(startx, starty+70)  ]);
        

        var c = new oneCase("azeaz",1,121,121);
        var graphics = game.add.graphics(0, 0);
        graphics.beginFill(0xFF33ff);
        //graphics.lineStyle(10, 0xFF0000, 0.8);
        graphics.drawPolygon(poly.points);
        graphics.middleX = startx + 61;
        graphics.middleY = starty + 35;
        graphics.points = poly;
        graphics.alpha= 0;
        graphics.endFill();
        c.phaserObject = graphics;
        
        game.caseTable.push(c);

        var graphicsBorder = game.add.graphics(0, 0);
        graphicsBorder.lineStyle(5, 0xFF0000, 0.8);
        graphicsBorder.moveTo(startx,starty);
        graphicsBorder.lineTo(startx+61,starty-35);
        graphicsBorder.lineTo(startx+122,starty);
        graphicsBorder.lineTo(startx + 122,starty+70);
        graphicsBorder.lineTo(startx + 61,starty+105);
        graphicsBorder.lineTo(startx,starty+70);
        graphicsBorder.lineTo(startx,starty);


        startx = startx+122;
    }  
}

function disableDragingFroPlayer(player)
{
    player.fleat.squads.forEach(function(squad){
        squad.phaserObject.input.disableDrag();
    });
}

function nextPlayer(rewind)
{
    if(this.game.turn.player == null)
    {
        if(typeof this.game.players[0] !== "undefined" && this.game.players[0] !== null)
        {
            this.game.turn.player = this.game.players[0];
        }        
        return this.game.turn.player;
    }
    if(typeof this.game.players[this.game.turn.player.number + 1] !== "undefined" && this.game.players[this.game.turn.player.number + 1] !== null)
    {
         this.game.turn.player = this.game.players[this.game.turn.player.number + 1];
    }
    else
    {
        if(typeof rewind == "undefined" || rewind == true)
        {
            this.game.turn.player = this.game.players[0];;
        }
        else
        {
            this.game.turn.player = null;
        }
    }
    return this.game.turn.player;
}

function drawPlayerSquads(player)
{
    squadsGroup = this.game.add.group();
    player.fleat.squads.forEach(function(squad){
        let x;
        let y;
        if(squad.case !== null)
        {
            x = squad.case.phaserObject.x;
            y = squad.case.phaserObject.y;
        }
        else
        {
            x = squad.originalX;
            y = squad.originalY;
        }
        let oneSquad = squadsGroup.create(x, y, 'squad');
        oneSquad.anchor.x = 0.5;
        oneSquad.anchor.y = 0.5;
        oneSquad.scale.setTo(squadWidth / oneSquad.width, squadHeight / oneSquad.height);
        oneSquad.ref = squad;
        squad.isDragged = false;
        squad.phaserObject = oneSquad;
        squad.drawLifeBar(this.game);
    });
}

var squadWidth = 100;
var squadHeight = 100;
var lifeBarHeight = 8;
var lifebarWidth = 100;
var lifeBarX = -50;
var lifeBarY = 35;

function getLifeBarColor(percent)
{
    var color = 0xEC2727;
    if(percent > 0.2 )
    {
        color = 0xEC7C27;
    }
    if(percent > 0.4)
    {
        color = 0xECDF27;
    }
    if(percent > 0.6)
    {
        color = 0x9AEC27;
    }
    if(percent > 0.8)
    {
        color = 0x4BEC27;
    }
    return color;
}

function enableDrag(player, dragSquadFunc, stopDragSquadFunc)
{
    player.fleat.squads.forEach(function(squad){
        squad.phaserObject.inputEnabled = true;
        this.game.physics.arcade.enable(squad.phaserObject);
        squad.phaserObject.input.enableDrag();
        squad.phaserObject.events.onDragStart.add(dragSquadFunc, this);
        squad.phaserObject.events.onDragStop.add(stopDragSquadFunc, this);
    });
}

function drawAllSquads()
{
    this.game.players.forEach(function(player){
        drawPlayerSquads(player);
    });
}