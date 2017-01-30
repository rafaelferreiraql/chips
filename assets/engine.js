function gameEngine() {

    return {
        init: function() {
            combat = Game.Engine.combat;
            Graphics = Game.Graphics;
            P1 = Game.Player[0];
            P2 = Game.Player[1];
            canvas = gameCanvas;

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
                ],
            },

            start: function() {
                chipData = this.data.p1chips;

                canvas.node.innerHTML = "";
                //Graphics.combat.drawChips(P1);
                //Graphics.combat.drawChips(P2);
                P1.draw();
                P2.draw();
                Graphics.combat.newTurnPH();
            },

            newTurn: function() {
                combat.data.turn += 1;
                combat.turnAction(P1);
                combat.turnAction(P2);
            },

            turnAction: function(player) {
                let selected = player.selected;
                if(combat.data.turn%5 === 0) {
                    player.swap();
                }
                else {
                    //combat.shoot(player);
                    player.shoot();
                }
            },

            shoot: function(player) {
                player.shoot();
            },

            select: function(sel,player) {
                player.selected = sel;
                combat.data.p1selected = sel;
                console.log(player.selected);
            },

            switch: function(sel1,sel2,player) {

                player.chips[sel1-1].pos = sel2;
                player.chips[sel2-1].pos = sel1;

                console.log(player.chips);

                Graphics.combat.switch(sel1,sel2,player);
            }
        },
    } // Close Return
}
