class Player {
    constructor(data) {
        this.test = function() {console.log(Graphics);};
        this.chips = [
            {id:1, pos:1},
            {id:2, pos:2},
            {id:3, pos:3},
            {id:4, pos:4},
            {id:5, pos:5}
        ];
        this.tag = data.tag;
        this.X = data.X;
        this.selected = 3;
        this.left = data.left;
    }

    draw() {
        Graphics.combat.drawChips(this);
    }

    shoot() {
        Graphics.combat.shoot(this);
    }

    select() {
        console.log("Select");
    }

    swap() {
        if(this.selected < 3) combat.switch(this.selected,this.selected+1,this);
        else if(this.selected > 3) combat.switch(this.selected,this.selected-1,this);
        else console.log("No Switch");
    }
}

p1data = {
    tag: "P1",
    X: (gameCanvas.width)*0.15, // 15%
    left: true,
}

p2data = {
    tag: "P2",
    X: (gameCanvas.width)*0.85, // 85%
    left: false,
}

let player1 = new Player(p1data);
let player2 = new Player(p2data);
