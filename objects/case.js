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
    this.overLapped = null;
};

oneCase.prototype = {
    findCasePosition : function()
    {
        var theElement = this;
        while(theElement.left != null)
        {
            theElement = theElement.left;
            if(theElement.x !== null)
            {
                this.position.x =  this.position.x + theElement.position.x + theElement.width;
                break;
            }
            this.position.x = this.position.x + theElement.width;
        }
        var theElement = this;
        while(theElement.top != null)
        {
            theElement = theElement.top;
            if(theElement.y !== null)
            {
                this.position.y = theElement.position.y + theElement.height;
                break;
            }
            this.position.y = this.position.y + theElement.height;
        }
        if(this.position.y == null)
        {
            this.position.y = 0;
        }
        if(this.position.x == null)
        {
            this.position.x = 0;
        }
    },
    BadOverLaped : function()
    {
        if(this.overLapped != 1)
        {
            this.phaserObject.clear();
            this.phaserObject.beginFill(0xDBDEE9);
            this.phaserObject.alpha= 1;
            this.phaserObject.drawPolygon(this.phaserObject.points);
            this.phaserObject.endFill();
        }
        this.overLapped = 1;
    },
    OverLaped : function()
    {
        if(this.overLapped != 2)
        {
            this.phaserObject.clear();
            this.phaserObject.beginFill(0xFEEC42);
            this.phaserObject.alpha= 1;
            this.phaserObject.drawPolygon(this.phaserObject.points);
            this.phaserObject.endFill();
        }
        this.overLapped = 2;
    },
    NotOverLaped : function()
    {
        if(this.overLapped != null)
        {
            this.phaserObject.clear();
            //this.phaserObject.beginFill(0xFF0000);
            this.phaserObject.alpha= 0;
            this.phaserObject.drawPolygon(this.phaserObject.points);
            this.phaserObject.endFill();
        }
        this.overLapped = null;
    },
    AttackOverLaped : function()
    {
        if(this.overLapped != 3)
        {
            this.phaserObject.clear();
            this.phaserObject.beginFill(0xFF0000);
            this.phaserObject.alpha= 1;
            this.phaserObject.drawPolygon(this.phaserObject.points);
            this.phaserObject.endFill();
        }
        this.overLapped = 3;
    },
    SupportOverLaped : function()
    {
        if(this.overLapped != 4)
        {
            this.phaserObject.clear();
            this.phaserObject.beginFill(0x4ED709);
            this.phaserObject.alpha= 1;
            this.phaserObject.drawPolygon(this.phaserObject.points);
            this.phaserObject.endFill();
        }
        this.overLapped = 4;
    },
    FirendlyFireOverlaped : function()
    {
        if(this.overLapped != 5)
        {
            this.phaserObject.alpha= 1;
            this.phaserObject.clear();
            this.phaserObject.beginFill(0xFF0000, 0.4);
            this.phaserObject.drawPolygon(this.phaserObject.points);
            this.phaserObject.endFill();
        }
        this.overLapped = 5;
    }
}