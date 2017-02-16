function gameEngine() {

    return {
        init: function() {
            combat = Game.Engine.combat;
            Graphics = Game.Graphics;
            canvas = gameCanvas;
            global = Game.Engine.global;
            Audio = Game.Audio;
            sounds = Audio.sounds;
            tracks = Audio.tracks;

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

            chipWheel = [
                types.water,
                types.ice,
                types.fire,
                types.light,
                types.shadow
            ];

            // Previously a placeholder, now it's default.
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

            this.gameLoad();

            //combat.start(); //Left this one here just for debugging
        },

        // Checks when all assets are loaded, and then runs the game
        gameLoad: function() {
            let preloader = canvas.node.appendChild(svgDraw("text"));
            preloader.innerHTML = "Loading assets, please wait..."
            preloader.setAttribute("y",canvas.height/2);

            try {
                let soundlist = Array.from(document.getElementsByTagName("audio"));

                function audioLoaded(audio) {
                    let promise = new Promise(fulfill => {
                        audio.oncanplaythrough = function() {
                            fulfill(audio);
                        }
                    });
                    return promise;
                }

                function pictureLoaded(pic) {
                    let promise = new Promise(fulfill => {
                        pic.onload = function() {
                            fulfill(pic);
                        }
                    });
                    return promise;
                }

                // Game launches; Promise reads all stuff that needs to be loaded,
                // then fires global.start() when done.
                Promise.all([
                    new FontFaceObserver('MenuFont').load(),
                    pictureLoaded(document.getElementById("img_bg"))
                    ].concat(soundlist.map(audioLoaded))
                ).then(global.start);
            }

            catch(e) {
                preloader.innerHTML = "Something's gone wrong :(";
            }
        },

        global: {

            data: {
                screen: null,
                ingame: null,
            },

            start: function() {
                if(global.data.screen === null || global.data.screen === "ingame") {
                    fullClear();
                    Audio.music.play(tracks.menu);
                }
                else {
                    clearDOM();
                }

                global.data.screen = "main";
                Graphics.global.start();
            },

            singlePlayer: function() {
                p2data.ai = BasicAIPlus;
                global.data.screen = "single";
                global.data.ingame = "single";
                clearDOM();
                Graphics.global.single();
            },

            multiPlayer: function() {
                global.data.ingame = "multi";
                global.data.screen = "multi";
                clearDOM();
                Graphics.global.multi();
            },

            cpu: function() {
                p1data.ai = BasicAIPlus;
                p2data.ai = BasicAIPlus;
                global.data.ingame = "cpu";
                global.data.screen = "cpu";
                clearDOM();
                Graphics.global.cpu();
            },

            keyConfig: function() {
                clearDOM();
                global.data.screen = "config";
                Graphics.global.configScreen();
            }

        },

        combat: {

            data: {
                turn: 0,
                lastTurn: 29,
            },

            start: function() {
                global.data.screen = "ingame";
                P1 = new Player(p1data);
                P2 = new Player(p2data);

                combat.data.turn = 0;

                canvas.node.onkeydown = function(k) {
                    let keys = [P1.keycodes,P2.keycodes];
                    console.log(k.keyCode);
                }

                Audio.music.play(tracks.duel);

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

                Audio.sfx(sounds.shot);
                // Ideally, I'd use Web Audio API with panning for individual shots,
                // but I'll avoid using it right now since it's experimental.
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
                // "sel" is the position (from 1 to 5).
                if(sel > 0 && sel < 6) {
                    if(global.data.ingame === "single") { // REVIEW THIS PART!
                        Graphics.combat.chipSelected(
                            canvas.node.getElementsByClassName(`chip ${player.selected} ${player.tag}`)[0],
                            canvas.node.getElementsByClassName(`chip ${sel} ${player.tag}`)[0]
                        );
                    }
                    player.updateSelection(sel);
                }
                // Else, selection is not valid and nothing will happen.
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
