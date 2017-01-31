class Player {
    constructor(data) {

        this.test = function() {console.log(Graphics);};
        this.chips = [
            {id:1, pos:1, type:data.chips[0]},
            {id:2, pos:2, type:data.chips[1]},
            {id:3, pos:3, type:data.chips[2]},
            {id:4, pos:4, type:data.chips[3]},
            {id:5, pos:5, type:data.chips[4]}
        ];
        this.tag = data.tag;
        this.X = data.X;
        this.selected = 3;
        this.left = data.left;
    }

    draw() {
        Graphics.combat.drawChips(this);
    }

    shoot(shotbreak) {
        Graphics.combat.shoot(this,shotbreak);
    }

    select() {
        console.log("Select");
    }

    swap() {
        let index = this.chips[this.selected-1].pos;
        if(index < 3) {combat.switch(
            this.chips[this.selected-1],
            this.chips.find(function(chip) {return chip.pos === index+1}),
            this);
        }
        else if(index > 3) {combat.switch(
            this.chips[this.selected-1],
            this.chips.find(function(chip) {return chip.pos === index-1}),
            this);
        }
        else console.log("No Switch");
    }
}

const shots = {
    "fire": {
        color: "red",
        dmg: 100,
        weak: ["water","light"],
    },
    "ice": {
        color: "lightblue",
        dmg: 100,
        weak: ["fire","light"],
    },
    "water": {
        color: "blue",
        dmg: 100,
        weak: ["ice","light"],
    },
    "shadow": {
        color:"#444",
        dmg: 150,
        weak: ["fire","water","ice","light"],
    },
    "light": {
        color:"lightgrey",
        dmg: 65,
        weak: [],
    }
}

// Trocar nome de variável depois, ou mover pra outro escopo já!
const types = {
    "fire": {
        color: "red",
        shot: "fire",
    },
    "ice": {
        color:"lightblue",
        shot: "ice",
    },
    "water": {
        color:"blue",
        shot: "water",
    },
    "shadow": {
        color:"#444",
        shot: "shadow",
    },
    "light": {
        color:"lightgrey",
        shot: "light",
    }
}

let p1data = {
    tag: "P1",
    X: (gameCanvas.width)*0.15, // 15%
    //X: "15%",
    left: true,
    chips: [
        types.light,
        types.ice,
        types.water,
        types.fire,
        types.shadow,
    ]
}

let p2data = {
    tag: "P2",
    X: (gameCanvas.width)*0.85, // 85%
    //X: "85%",
    left: false,
    chips: [
        types.water,
        types.water,
        types.water,
        types.water,
        types.water,
    ]
}

//let player1 = new Player(p1data);
//let player2 = new Player(p2data);
