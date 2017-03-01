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
        this.phaserObject.loadTexture('badOverLapedCase', 0);
    },
    OverLaped : function()
    {
        this.phaserObject.loadTexture('overLapedCase', 0);
    },
    NotOverLaped : function()
    {
        this.phaserObject.loadTexture('case', 0);
    },
    AttackOverLaped : function()
    {
        this.phaserObject.loadTexture('attackOverLaped', 0);
    },
    SupportOverLaped : function()
    {
        this.phaserObject.loadTexture('supportLapedCase', 0);
    }
}