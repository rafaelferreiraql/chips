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
                selected: 3,
            },

            start: function() {
                Graphics.combat.draw();
            },

            newTurn: function() {
                let selected = combat.data.selected;
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
                Graphics.combat.shoot(combat.data.selected);
            },

            select: function(sel) {
                combat.data.selected = sel;
                console.log(sel);
            },

            switch: function(sel1,sel2) {
                console.log(`${sel1} ${sel2} Switch`);
                Graphics.combat.switch(sel1,sel2);
            }
        },
    } // Close Return
}
