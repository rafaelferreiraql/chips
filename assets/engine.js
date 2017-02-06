function gameEngine() {

    return {
        init: function() {
            combat = Game.Engine.combat;
            Graphics = Game.Graphics;
            canvas = gameCanvas;
            global = Game.Engine.global;

            // Types of shots
            shots = {
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

            // Types of chips
            types = {
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
                keys: ["49","50","51","52","53"],
            }

            p2data = {
                tag: "P2",
                X: function() { return (gameCanvas.width)*0.85}, // 85%
                //X: "85%",
                left: false,
                chips: p2chips,
                keys: ["35","40","34","37","12"],
            }
            global.start();
            //combat.start(); //Left this one here for debugging
        },

        global: {
            start: function() {
                canvas.node.innerHTML = "";
                Graphics.global.start();
            },

            singlePlayer: function() {
                p2data.ai = BasicAIPlus;
                combat.data.battle = "single";
                canvas.node.innerHTML = "";
                Graphics.global.single();
            },

            multiPlayer: function() {
                combat.data.battle = "multi";
                canvas.node.innerHTML = "";
                Graphics.global.multi();
            },

            cpu: function() {
                p1data.ai = BasicAIPlus;
                p2data.ai = BasicAIPlus;
                combat.data.battle = "cpu";
                canvas.node.innerHTML = "";
                Graphics.global.cpu();
            },

            keyConfig: function() {
                canvas.node.innerHTML = "";
                Graphics.global.configScreen();
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

                canvas.node.onkeydown = function(k) {
                    let keys = [P1.keycodes,P2.keycodes];
                    console.log(k.keyCode);
                }

                Graphics.combat.start();
            },

            newTurn: function() {
                // Duel finishes if all turns are over
                if(combat.data.turn === combat.data.lastTurn) {
                    combat.end();
                }

                // Duel continues
                else {
                    if(P1.AI) P1.AI.select();
                    if(P2.AI) P2.AI.select();

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
                // remember, selection here means the ID, not the position!
                // In hindsight, this might be the stupidest idea I've had.
                // Might change this later
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
