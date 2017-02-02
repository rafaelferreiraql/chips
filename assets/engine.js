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
                P1.drawScore();
                P2.drawScore();
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

                P2.AI.select();
            },

            shoot: function() {
                // willBreak() deals with the logic of whether the shot will
                // break on the face of another shot in the same lane, see below
                P1.shoot(this.willBreak(P1,P2));
                P2.shoot(this.willBreak(P2,P1));
            },

            willBreak: function(shooter,opponent) {
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
                //player.selected = sel;
                player.updateSelection(sel);
                console.log(sel);
            },

            switch: function(chip1,chip2,player) {
                Graphics.combat.switch(chip1,chip2,player);
            }
        },
    } // Close Return
}
