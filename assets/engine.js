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
                Graphics.combat.resizePH();
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
                // shotBreak() deals with the logic of whether the shot will
                // break on the face of another shot in the same lane, see below
                P1.shoot(this.shotBreak(P1,P2));
                P2.shoot(this.shotBreak(P2,P1));
            },

            shotBreak: function(shooter,opponent) {
                const shooterChip = shooter.chips[shooter.selected-1];
                const opponentChip = opponent.chips[opponent.selected-1]
                const shot = shooterChip.type.shot;
                const opposing = opponentChip.type.shot;

                if(shooterChip.pos !== opponentChip.pos) {
                    return false;
                }
                else {
                    return (shots[shot].weak.includes(opposing) || shot === opposing);
                }
            },

            select: function(sel,player) {
                //remember, selection here means the ID, not the position!
                player.selected = sel;
                console.log(sel);
            },

            switch: function(chip1,chip2,player) {
                Graphics.combat.switch(chip1,chip2,player);
            }
        },
    } // Close Return
}
