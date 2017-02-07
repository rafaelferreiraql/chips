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
        this.keycodes = data.keys;
    }

    updateSelection(select) {
        this.selected = select; // Now refactoring to select by position!
        this.selectedChip = this.chips[select-1];
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
            this.chips[this.selected],
            this);
        }
        else if(index > 3) {combat.switch(
            this.chips[this.selected-1],
            this.chips[this.selected-2],
            this);
        }
        else console.log("No Switch");
    }
}
