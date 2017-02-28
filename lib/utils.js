function checkOverLap(player, caseTable, OverLapDraggingManagmentFunc)
{
    player.fleat.squads.forEach(function(squad){
        if(squad.isDragged)
        {
            let overLapedCase = getOverlapedCase(squad, caseTable);

            oldOverLapped = squad.overlapedCase;
            squad.overlapedCase = overLapedCase;
            OverLapDraggingManagmentFunc(squad, oldOverLapped);
        }
    });
}


function BadOverLaped(oneCase)
{
    oneCase.phaserObject.loadTexture('badOverLapedCase', 0);
}

function OverLaped(oneCase)
{
    oneCase.phaserObject.loadTexture('overLapedCase', 0);
}

function NotOverLaped(oneCase)
{
    oneCase.phaserObject.loadTexture('case', 0);
}

function AttackOverLaped(oneCase)
{
    oneCase.phaserObject.loadTexture('attackOverLaped', 0);
}

function SupportOverLaped(oneCase)
{
    oneCase.phaserObject.loadTexture('supportLapedCase', 0);
}




function getOverlapedCase(squad, caseTable)
{
    let overLapValue = 0;
    let overLapCase = null;
    caseTable.forEach(function(oneCase){
        if(!this.game.physics.arcade.overlap(squad.phaserObject, oneCase.phaserObject, function(esc,theCase) {

            let intersects = Phaser.Rectangle.intersection(esc, theCase);
            let thisOverlap = intersects.width * intersects.height;
            if(thisOverlap > overLapValue || overLapCase == oneCase)
            {
                overLapCase = oneCase;
                overLapValue = thisOverlap;
            }
        })){
            if(overLapCase == oneCase)
            {
                overLapCase = null;
            }
        }
    });
    return overLapCase;
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
        NotOverLaped(sprite.ref.overlapedCase);
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
            sprite.x = sprite.ref.overlapedCase.phaserObject.x;
            sprite.y = sprite.ref.overlapedCase.phaserObject.y;
        }
        else
        {
            // go here if the squad is moved to a case already countaining a fleet.
            // if the esouade had already a case : get back to the previous case.
            if(sprite.ref.case !== null)
            {
                sprite.x = sprite.ref.case.phaserObject.x;
                sprite.y = sprite.ref.case.phaserObject.y;
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
    cases = game.add.group();
    game.caseTable.forEach(function(elem){
        var oneCase = cases.create(elem.position.x, elem.position.y, 'case');
        this.game.physics.arcade.enable(oneCase);
        oneCase.scale.setTo(elem.width / oneCase.width,  elem.height / oneCase.height);
        elem.phaserObject = oneCase;
    });
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

var squadWidth = 100;
var squadHeight = 100;
var lifeBarHeight = 8;
var lifebarWidth = 100;
var lifeBarX = 0;
var lifeBarY = 70;

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
        oneSquad.scale.setTo(squadWidth / oneSquad.width, squadHeight / oneSquad.height);
        oneSquad.ref = squad;
        squad.isDragged = false;
        squad.phaserObject = oneSquad;
        var lifeBar = this.game.add.graphics(lifeBarX, lifeBarY);
        lifeBar.lineStyle(lifeBarHeight, 0x33FF00);
        lifeBar.lineTo(lifebarWidth, 0);
        oneSquad.addChild(lifeBar);
        oneSquad.ref.lifeBar.phaserObject = lifeBar;
        lifeBar.anchor.set(0, 0);
        var style = { font: "9px Arial",/* fill: "#ff0044", wordWrap: false, wordWrapWidth: lifeBar.width, /*align: "center", backgroundColor: "#ffff00"*/ };
        text = this.game.add.text(lifeBar.x, lifeBar.y - (lifeBarHeight / 2) - 3, oneSquad.ref.lifeBar.armor + "/" + oneSquad.ref.lifeBar.armor , style);
        text.x = (lifebarWidth / 2) - (text.width / 2);
        oneSquad.ref.lifeBar.textObject = text;
        oneSquad.addChild(text);
    });
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