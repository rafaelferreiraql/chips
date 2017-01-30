function gameEngine() {

    return {
        init: function() {
            combat = Game.Engine.combat;
            Graphics = Game.Graphics;
            canvas = gameCanvas;
            combat.start();
        },

        global: {

        },

        combat: {

            data: {
                turn: 0,
            },

            start: function() {
                P1 = new Player(p1data);
                P2 = new Player(p2data);

                canvas.node.innerHTML = "";
                P1.draw();
                P2.draw();
                Graphics.combat.newTurnPH();
            },

            newTurn: function() {
                combat.data.turn += 1;
                if(combat.data.turn%5 === 0) {
                    P1.swap();
                    P2.swap();
                }
                else {
                    combat.shoot();
                }
            },

            shoot: function() {
                // Shooting clash logic goes here
                P1.shoot();
                P2.shoot();
            },

            select: function(sel,player) {
                //remember, selection here means the ID, not the position!
                player.selected = sel;
                console.log(sel);
            },

            switch: function(chip1,chip2,player) {
                console.log(chip1);
                console.log(chip2);

                Graphics.combat.switch(chip1,chip2,player);
            }
        },
    } // Close Return
}
