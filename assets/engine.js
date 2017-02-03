function gameEngine() {

    return {
        init: function() {
            combat = Game.Engine.combat;
            Graphics = Game.Graphics;
            canvas = gameCanvas;
            global = Game.Engine.global;

            chipWheel = [types.water,types.ice,types.fire,types.light,types.shadow];

            // Placeholder. It'll be eventually chosen in the menu.
            p1chips = range(5).map(() => chipWheel[Math.floor(Math.random()*5)]);
            p2chips = range(5).map(() => chipWheel[Math.floor(Math.random()*5)]);

            p1data = {
                tag: "P1",
                X: function() { return (gameCanvas.width)*0.15}, // 15%
                //X: "15%",
                left: true,
                chips: p1chips,
            }

            p2data = {
                tag: "P2",
                X: function() { return (gameCanvas.width)*0.85}, // 85%
                //X: "85%",
                left: false,
                chips: p2chips,
                ai: BasicAIPlus,
            }
            global.start();
            //combat.start(); //Left this one here for debugging
        },

        global: {
            start: function() {
                canvas.node.innerHTML = "";
                Graphics.global.start();
            }

        },

        combat: {

            data: {
                turn: 0,
                lastTurn: 29,
            },

            start: function() {
                P1 = new Player(p1data);
                P2 = new Player(p2data);

                combat.data.turn = 0;

                Graphics.combat.start();
            },

            newTurn: function() {
                // Duel finishes if all turns are over
                if(combat.data.turn === combat.data.lastTurn) {
                    combat.end();
                }

                // Duel continues
                else {
                    P2.AI.select();

                    combat.data.turn += 1;
                    if(combat.data.turn%5 === 0) {
                        P1.swap();
                        P2.swap();
                    }
                    else {
                        combat.shoot();
                    }

                    Graphics.combat.newTurnPH();
                }


            },

            shoot: function() {
                // willBreak() deals with the logic of whether the shot will
                // break on the face of another shot in the same lane, see below
                P1.shoot(this.willBreak(
                    P1.chips[P1.selected-1],P2.chips[P2.selected-1]));
                P2.shoot(this.willBreak(
                    P2.chips[P2.selected-1],P1.chips[P1.selected-1]));
            },

            willBreak: function(thisChip,otherChip) {
                const shot = thisChip.shot;
                const opposing = otherChip.shot;

                if(thisChip.pos !== otherChip.pos) {
                    return false;
                }
                else {
                    return (shot.weak.includes(opposing.name) || shot === opposing);
                }
            },

            select: function(sel,player) {
                //remember, selection here means the ID, not the position!
                player.updateSelection(sel);
            },

            switch: function(chip1,chip2,player) {
                Graphics.combat.switch(chip1,chip2,player);
            },

            end: function() {
                Graphics.combat.end();
            }
        },
    } // Close Return
}
