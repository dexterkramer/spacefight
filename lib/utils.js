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
    // has the squad been dragged on a case ?
    if(sprite.ref.overlapedCase !== null)
    {
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
    var startx = 100;
    var starty = 100;

    var i;
    for(i = 0; i < 4; i++)
    {
        var poly = new Phaser.Polygon([ new Phaser.Point(startx, starty), new Phaser.Point(startx+61, starty-35), new Phaser.Point(startx+122, starty), new Phaser.Point(startx + 122, starty+70), new Phaser.Point(startx + 61, starty+105), new Phaser.Point(startx, starty+70)  ]);
        var c = game.caseTable[i];
        var graphics = game.add.graphics(0, 0);
        graphics.beginFill(0xFF33ff);
        graphics.drawPolygon(poly.points);
        graphics.middleX = startx + 61;
        graphics.middleY = starty + 35;
        graphics.alpha= 0;
        graphics.endFill();
        graphics.points = poly;
        c.phaserObject = graphics;

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

    var startx = 100 + 61;
    var starty = 100 + 35 + 70;
    for(i = 4; i < 7; i++)
    {
        var poly = new Phaser.Polygon([ new Phaser.Point(startx, starty), new Phaser.Point(startx+61, starty-35), new Phaser.Point(startx+122, starty), new Phaser.Point(startx + 122, starty+70), new Phaser.Point(startx + 61, starty+105), new Phaser.Point(startx, starty+70)  ]);
        var c = game.caseTable[i];
        var graphics = game.add.graphics(0, 0);
        graphics.beginFill(0xFF33ff);
        graphics.drawPolygon(poly.points);
        graphics.middleX = startx + 61;
        graphics.middleY = starty + 35;
        graphics.alpha= 0;
        graphics.endFill();
        graphics.points = poly;
        c.phaserObject = graphics;

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

    var startx = 100 + 61 + 61;
    var starty = 100 + 35 + 70 + 35 + 70;
    for(i = 7; i < 9; i++)
    {
        var poly = new Phaser.Polygon([ new Phaser.Point(startx, starty), new Phaser.Point(startx+61, starty-35), new Phaser.Point(startx+122, starty), new Phaser.Point(startx + 122, starty+70), new Phaser.Point(startx + 61, starty+105), new Phaser.Point(startx, starty+70)  ]);
        var c = game.caseTable[i];
        var graphics = game.add.graphics(0, 0);
        graphics.beginFill(0xFF33ff);
        graphics.drawPolygon(poly.points);
        graphics.middleX = startx + 61;
        graphics.middleY = starty + 35;
        graphics.points = poly;
        graphics.alpha= 0;
        graphics.endFill();
        c.phaserObject = graphics;
        
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

    var startx = 100 - 61 + 61 + 61;
    var starty = 100 + 35 + 70 + 35 + 70 + 35 + 70;
    for(i = 9; i < 12; i++)
    {
        var poly = new Phaser.Polygon([ new Phaser.Point(startx, starty), new Phaser.Point(startx+61, starty-35), new Phaser.Point(startx+122, starty), new Phaser.Point(startx + 122, starty+70), new Phaser.Point(startx + 61, starty+105), new Phaser.Point(startx, starty+70)  ]);
        var c = game.caseTable[i];
        var graphics = game.add.graphics(0, 0);
        graphics.beginFill(0xFF33ff);
        graphics.drawPolygon(poly.points);
        graphics.middleX = startx + 61;
        graphics.middleY = starty + 35;
        graphics.points = poly;
        graphics.alpha= 0;
        graphics.endFill();
        c.phaserObject = graphics;

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

    var startx = 100 - 61 - 61 + 61 + 61;
    var starty = 100 + 35 + 70 + 35 + 70 + 35 + 70 + 35 + 70;
    for(i = 12; i < 16; i++)
    {
        var poly = new Phaser.Polygon([ new Phaser.Point(startx, starty), new Phaser.Point(startx+61, starty-35), new Phaser.Point(startx+122, starty), new Phaser.Point(startx + 122, starty+70), new Phaser.Point(startx + 61, starty+105), new Phaser.Point(startx, starty+70)  ]);
        var c = game.caseTable[i];
        var graphics = game.add.graphics(0, 0);
        graphics.beginFill(0xFF33ff);
        graphics.drawPolygon(poly.points);
        graphics.middleX = startx + 61;
        graphics.middleY = starty + 35;
        graphics.points = poly;
        graphics.alpha= 0;
        graphics.endFill();
        c.phaserObject = graphics;

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

/*    var startx = 200;
    var starty = 100;
    var i;
    for(i = 0; i < 3; i++)
    {
        var poly = new Phaser.Polygon([ new Phaser.Point(startx, starty), new Phaser.Point(startx+61, starty-35), new Phaser.Point(startx+122, starty), new Phaser.Point(startx + 122, starty+70), new Phaser.Point(startx + 61, starty+105), new Phaser.Point(startx, starty+70)  ]);
        var c = game.caseTable[i];
        var graphics = game.add.graphics(0, 0);
        graphics.beginFill(0xFF33ff);
        graphics.drawPolygon(poly.points);
        graphics.middleX = startx + 61;
        graphics.middleY = starty + 35;
        graphics.alpha= 0;
        graphics.endFill();
        graphics.points = poly;
        c.phaserObject = graphics;

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
    for(i = 3; i < 7; i++)
    {
        var poly = new Phaser.Polygon([ new Phaser.Point(startx, starty), new Phaser.Point(startx+61, starty-35), new Phaser.Point(startx+122, starty), new Phaser.Point(startx + 122, starty+70), new Phaser.Point(startx + 61, starty+105), new Phaser.Point(startx, starty+70)  ]);
        var c = game.caseTable[i];
        var graphics = game.add.graphics(0, 0);
        graphics.beginFill(0xFF33ff);
        graphics.drawPolygon(poly.points);
        graphics.middleX = startx + 61;
        graphics.middleY = starty + 35;
        graphics.alpha= 0;
        graphics.endFill();
        graphics.points = poly;
        c.phaserObject = graphics;

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
    for(i = 7; i < 12; i++)
    {
        var poly = new Phaser.Polygon([ new Phaser.Point(startx, starty), new Phaser.Point(startx+61, starty-35), new Phaser.Point(startx+122, starty), new Phaser.Point(startx + 122, starty+70), new Phaser.Point(startx + 61, starty+105), new Phaser.Point(startx, starty+70)  ]);
        var c = game.caseTable[i];
        var graphics = game.add.graphics(0, 0);
        graphics.beginFill(0xFF33ff);
        graphics.drawPolygon(poly.points);
        graphics.middleX = startx + 61;
        graphics.middleY = starty + 35;
        graphics.points = poly;
        graphics.alpha= 0;
        graphics.endFill();
        c.phaserObject = graphics;
        
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
    for(i = 12; i < 16; i++)
    {
        var poly = new Phaser.Polygon([ new Phaser.Point(startx, starty), new Phaser.Point(startx+61, starty-35), new Phaser.Point(startx+122, starty), new Phaser.Point(startx + 122, starty+70), new Phaser.Point(startx + 61, starty+105), new Phaser.Point(startx, starty+70)  ]);
        var c = game.caseTable[i];
        var graphics = game.add.graphics(0, 0);
        graphics.beginFill(0xFF33ff);
        graphics.drawPolygon(poly.points);
        graphics.middleX = startx + 61;
        graphics.middleY = starty + 35;
        graphics.points = poly;
        graphics.alpha= 0;
        graphics.endFill();
        c.phaserObject = graphics;

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
    for(i = 16; i < 19; i++)
    {
        var poly = new Phaser.Polygon([ new Phaser.Point(startx, starty), new Phaser.Point(startx+61, starty-35), new Phaser.Point(startx+122, starty), new Phaser.Point(startx + 122, starty+70), new Phaser.Point(startx + 61, starty+105), new Phaser.Point(startx, starty+70)  ]);
        var c = game.caseTable[i];
        var graphics = game.add.graphics(0, 0);
        graphics.beginFill(0xFF33ff);
        graphics.drawPolygon(poly.points);
        graphics.middleX = startx + 61;
        graphics.middleY = starty + 35;
        graphics.points = poly;
        graphics.alpha= 0;
        graphics.endFill();
        c.phaserObject = graphics;

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
    */
}

function disableDragingFroPlayer(player)
{
    player.fleat.squads.forEach(function(squad){
        if(squad.phaserObject != null)
        {
            squad.phaserObject.input.disableDrag();
        }
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
            this.game.turn.player = this.game.players[0];
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

    var squad = player.fleat.capitalShip;

    let x;
    let y;
    if(squad.case !== null)
    {
        x = squad.case.phaserObject.middleX;
        y = squad.case.phaserObject.middleY;
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
    squad.phaserObject = oneSquad;
    squad.drawLifeBar(this.game);

    /*squadsGroup = this.game.add.group();
    player.fleat.squads.forEach(function(squad){
        let x;
        let y;
        if(squad.case !== null)
        {
            x = squad.case.phaserObject.middleX;
            y = squad.case.phaserObject.middleY;
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
        squad.phaserObject = oneSquad;
        squad.drawLifeBar(this.game);
    });*/
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
    player.fleat.capitalShip.phaserObject.inputEnabled = true;
    this.game.physics.arcade.enable(player.fleat.capitalShip.phaserObject);
    player.fleat.capitalShip.phaserObject.input.enableDrag();
    player.fleat.capitalShip.phaserObject.events.onDragStart.add(dragSquadFunc, this);
    player.fleat.capitalShip.phaserObject.events.onDragStop.add(stopDragSquadFunc, this);

    player.fleat.squads.forEach(function(squad){
        if(squad.phaserObject == null)
            return;
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

/////////////////////////////////////////////////////////////////////////
//////////////////////////////// CREATE /////////////////////////////////
/////////////////////////////////////////////////////////////////////////

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
    player.orders = createOrders(player, playerJson.orders);
    player.fleat.addCapitalShip(playerJson.fleat.capitalShip);
    return player;
}

function createOrders(player, ordersJson)
{
    var orderArray = [];
    ordersJson.forEach(function(order){
        orderArray.push(createOrder(order));
    });
    return orderArray;
}

function createOrder(orderJson)
{
    var orderObject = new oneOrder(orderJson.name, orderJson.effects);
    return orderObject;
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
        caseTable[elem.number].topLeft = (elem.links.topLeft !== null) ? caseTable[elem.links.topLeft] : null;
        caseTable[elem.number].topRight = (elem.links.topRight !== null) ? caseTable[elem.links.topRight] : null;
        caseTable[elem.number].bottomLeft = (elem.links.bottomLeft !== null) ? caseTable[elem.links.bottomLeft] : null;
        caseTable[elem.number].bottomRight = (elem.links.bottomRight !== null) ? caseTable[elem.links.bottomRight] : null;
    });

    caseTable.forEach(function(oneCase){
        oneCase.findCasePosition();
    });
    return caseTable;
}