function gameEngine() {

    return {
        init: function() {
            combat = Game.Engine.combat;
            Graphics = Game.Graphics;

            combat.start();
        },

        global: {

        },

        combat: {

            data: {
                turn: 0,
                p1selected: 3,
                p1chips: [
                    {id:1, pos:1},
                    {id:2, pos:2},
                    {id:3, pos:3},
                    {id:4, pos:4},
                    {id:5, pos:5}
                ]
            },

            start: function() {
                chipData = this.data.p1chips;
                Graphics.combat.draw();
            },

            newTurn: function() {
                let selected = combat.data.p1selected;
                combat.data.turn += 1;
                if(combat.data.turn%5 === 0) {
                    if(selected < 3) combat.switch(selected,selected+1);
                    else if (selected > 3) combat.switch(selected,selected-1);
                }
                else {
                    combat.shoot();
                }
            },

            shoot: function() {
                Graphics.combat.shoot(combat.data.p1selected);
            },

            select: function(sel) {
                combat.data.p1selected = sel;
                console.log(sel);
            },

            switch: function(sel1,sel2) {
                console.log(`${sel1} ${sel2} Switch`);

                chipData[sel1-1].pos = sel2;
                chipData[sel2-1].pos = sel1;

                Graphics.combat.switch(sel1,sel2);
            }
        },
    } // Close Return
}
