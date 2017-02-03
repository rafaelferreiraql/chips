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
        this.chips.forEach(function(chip,index) {
            chip.shot = shots[chip.type.shot];
            chip.shot.name = chip.type.shot;
        });
        this.tag = data.tag;
        this.X = data.X();
        this.setX = data.X;
        this.updateSelection(3);
        /*
            The above assigns:
            -   this.selected;
            -   this.selectedChip;
            Also, updates whenever it's called.
         */
        this.left = data.left; // Refers to the position of the player's chips
        this.score = {
            value: 0,
            update: () => {
                let score = canvas.node.getElementsByClassName(this.tag+" score");
                score.innerHTML = this.value;
            }
        };
        this.AI = (data.ai ? new data.ai(this) : null);
    }

    updateSelection(select) {
        this.selected = select; // Refers to the chip ID, not the position!
        this.selectedChip = this.chips[this.selected-1];
    }

    draw() {
        Graphics.combat.drawChips(this);
    }

    drawScore() {
        Graphics.combat.score(this);
    }

    shoot(willbreak) {
        if(!willbreak) {
            this.score.value += this.selectedChip.shot.dmg;
        };
        Graphics.combat.shoot(this,willbreak);
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
