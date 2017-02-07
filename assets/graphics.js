function gameGraphics() {

    let canvas = gameCanvas;
    // Already defined in Engine.init(), but Graphics.combat.data needs this
    // since it's not called. Might try to populate it on Engine.init().

    return {

        global: {

            start: function() {
                let singleButton = this.drawOption(canvas.width/2,3,"Single Player",
                    global.singlePlayer);

                let multiButton = this.drawOption(canvas.width/2,5,"Multi Player",
                    global.multiPlayer);

                let cpuButton = this.drawOption(canvas.width/2,7,"CPU x CPU",
                    global.cpu);

                let configButton = this.drawOption(canvas.width/2,9,"Config keys (experimental!)",
                    global.keyConfig);
            },

            single: function() {
                let start = this.drawOption(canvas.width/2,1,"Start!",combat.start);
                this.chipSelect(p1data.chips,1,3,"P1");
            },

            multi: function() {
                let start = this.drawOption(canvas.width/2,1,"Start!",combat.start);
                let placeholder = canvas.node.appendChild(svgDraw("text"));
                placeholder.style.fontSize = canvas.height/18;
                placeholder.setAttribute("y",100);

                this.chipSelect(p1data.chips,1,3,"P1");
                this.chipSelect(p2data.chips,6.5,3,"P2");
            },

            cpu: function() {
                let start = this.drawOption(canvas.width/2,1,"Start!",combat.start);
            },

            configScreen: function() {
                let back = this.drawOption(canvas.width/2,1,"Return",global.start);
                let p1config = this.drawOption(canvas.width/6,3,"Config P1 Keys",() => {
                    this.keyConfig("p1");
                });
                let p2config = this.drawOption(3.5*canvas.width/6,3,"Config P2 Keys",() => {
                    this.keyConfig("p2");
                });
            },

            keyConfig: function(player) {
                // Rather crude function; I wanted to avoid using for() because
                // a tiny mistake could overload my computer and make me wait for
                // minutes until I can use it again
                const reldata = (player === "p1" ? p1data : p2data)
                const positions = [
                    "top",
                    "top-middle",
                    "middle",
                    "bottom-middle",
                    "bottom",
                ];
                let i = 0;
                let inputHere = this.drawOption(canvas.width/2,5);
                lunar.addClass(inputHere,"inputDialog");
                let currentKey = function() {
                    if(i < 5) {
                        inputHere.innerHTML = `Key for ${positions[i]} chip`;
                        canvas.node.onkeydown = function(k) {
                            console.log("pressed: "+k.keyCode);
                            reldata.keys[i] = k.keyCode;
                            i++;
                            currentKey();
                        }
                    }

                    else {
                        i = 0;
                        canvas.node.removeChild(canvas.node.getElementsByClassName("inputDialog")[0]);
                        canvas.node.onkeydown = null;
                    };
                };
                currentKey();

            },

            drawOption: function(x,yFraction,text,e) {
                let button = canvas.node.appendChild(svgDraw("text"));
                button.style.fontSize = canvas.height/12;
                button.style.fill = "black";
                button.setAttribute("x",x);
                button.setAttribute("y",canvas.height/12*yFraction)
                button.innerHTML = text;
                if(e) {
                    button.addEventListener("click",e)
                }
                return button;
            },

            chipSelect: function(chips,xFraction,yFraction,p) {
                let pick = 0;
                this.drawOption(xFraction*canvas.width/12,yFraction,`Choose your deck (${p})`);
                chipWheel.forEach(function(chip,i) { // Representing your options
                    let rect = canvas.node.appendChild(svgDraw("rect"));
                    rect.setAttribute("x",canvas.width/12*(i+xFraction));
                    rect.setAttribute("y",canvas.height/12*(yFraction+1));
                    rect.style.fill = chip.color;
                    rect.style.height = 25;
                    rect.style.width = 25;

                    let changeDeck = function() {
                        chips[pick] = chip;
                        canvas.node.getElementsByClassName(p+" "+pick)[0].style.fill =
                            chip.color;
                    }
                    rect.addEventListener("click",changeDeck)
                    canvas.node.addEventListener("keydown", function(k) {
                        let data;
                        if(p === "P1") {
                            data = p1data;
                        }
                        else data = p2data;
                        if (data.keys[i] == k.keyCode) {
                            changeDeck();
                        }
                    });
                });
                chips.forEach(function(chip,i) { // Representing the deck
                    let rect = canvas.node.appendChild(svgDraw("rect"));
                    rect.setAttribute("x",xFraction*canvas.width/12);
                    rect.setAttribute("y",canvas.height/12*(yFraction+2.25+(i*1.2)));
                    rect.style.fill = chip.color;
                    rect.style.height = 40;
                    rect.style.width = 40;
                    lunar.addClass(rect,p+" "+i)
                    rect.addEventListener("click",function() {
                        pick = i;
                    })
                })
            },

        },

        combat: {

            start: function() {
                canvas.node.innerHTML = "";
                P1.draw();
                P2.draw();
                P1.drawScore();
                P2.drawScore();
                this.debug(); // For various debug purposes
                Graphics.combat.newTurnPH();
                canvas.node.onkeydown = function(k) {
                    combat.select(P1.keycodes.indexOf(k.keyCode)+1,P1);
                    combat.select(P2.keycodes.indexOf(k.keyCode)+1,P2);
                    // Worth reminding that combat.select(sel,player) will only do anything
                    // when "sel" is 1-5, so if it doesn't belong to player.keycodes,
                    // "sel" will be 0, thus nothing will happen, just as intended.
                };
            },

            data: {
                chipDim: 50,
                grid: range(1,6).map((v,_,array) => {
                    return (canvas.height/(array.length+1))*v;
                }),
            },

            drawChips: function(player) {
                const self = this;
                this.data.positions = this.data.grid.map(function(pos) {
                    return pos - self.data.chipDim/2;
                });
                this.data.grid.forEach(function(pos,index) {
                    let dim = self.data.chipDim;
                    let rect = canvas.node.appendChild(svgDraw("rect"));

                    rect.style.height = dim;
                    rect.style.width = dim;
                    rect.style.x = (player.left ? player.X : player.X-dim);
                    rect.style.y = self.data.positions[index];
                    rect.style.fill = player.chips[index].type.color;

                    // Note: the class will refer always to the ID.
                    // When fetching the chip on the DOM, remember it's the ID,
                    // not the position!
                    lunar.addClass(rect, `chip ${index+1} ${player.tag}`);

                    rect.onclick = function() {combat.select(
                        player.chips.findIndex(chip=>chip.id === index+1)+1,player)}

                    onResize(function() {
                        rect.style.x = (player.left ? player.setX() : player.setX()-dim);
                    })
                })
            },

            score: function(player) {
                if(!canvas.node.getElementsByClassName(player.tag+" score")[0]) {
                    let score = canvas.node.appendChild(svgDraw("text"));
                    let size = 50;
                    score.setAttribute("x",
                        player.left ? canvas.width/2 - 100 : canvas.width/2 + 100);
                    score.setAttribute("y",
                        canvas.height - this.data.chipDim);
                    score.style.fontSize = size;
                    score.style.userSelect = "none";
                    score.innerHTML = player.score.value;
                    lunar.addClass(score,player.tag+" score")
                }
                else {
                    console.log("Já criou!");
                    let score = canvas.node.getElementsByClassName(player.tag+" score")[0];
                    score.innerHTML = player.score.value;
                }

                onResize(function() {
                    score.style.x = (player.left ? canvas.width/2 - 100 : canvas.width/2 + 100);
                })

            },

            newTurnPH: function() {
                if(canvas.node.getElementsByClassName("nextTurn")[0]) {
                    let turner = canvas.node.getElementsByClassName("nextTurn")[0];
                    let text;
                    if(combat.data.turn === combat.data.lastTurn) text = "End";
                    else if((combat.data.turn + 1) % 5 !== 0) text = "Shoot!";
                    else text = "Switch!";

                    turner.innerHTML = text;
                }

                else {
                    // Botão verde debug para mudar a rodada manualmente
                    let turner = canvas.node.appendChild(svgDraw("text"));
                    lunar.addClass(turner,"nextTurn");

                    turner.innerHTML = "Shoot!";

                    turner.style.userSelect = "none";
                    turner.style.fontSize = 40;

                    turner.setAttribute("height",30);
                    turner.setAttribute("width",30);
                    turner.setAttribute("fill","green");
                    turner.setAttribute("x",canvas.width/2);
                    turner.setAttribute("y",40);
                    turner.addEventListener("click",combat.newTurn);
                }
            },

            resize: function() {
                console.log("escutei");
                // Reset all X and Y coordinates of... everything?
            },

            shoot: function(player,half=false) {
                let sel = player.selected;
                let selToID = player.chips[sel-1].id;
                let chip = canvas.node.getElementsByClassName(`${selToID} ${player.tag}`)[0];
                let shot = canvas.node.appendChild(svgDraw("circle"));
                let chipsize = this.data.chipDim;
                let chipType = player.chips[sel-1].type;

                shot.style.cx = (player.left ?
                    player.X + chipsize : player.X);
                shot.style.cy = parseInt(chip.style.y)+chipsize/2;
                shot.style.r = 10;
                shot.style.strokeWidth = 1;
                shot.style.fill = shots[chipType.shot].color;
                lunar.addClass(shot,"shot "+chipType.shot);

                this.shotMove(player,shot,half,chipType.shot);
            },

            shotMove: function(player,shot,half,type) {
                const self = this;
                const oppX = (player === P1 ? P2.X : P1.X);

                // Animate
                let position = parseInt(shot.style.cx);
                const posFinal = (half ? canvas.width/2 : oppX);
                const frames = 60*(half ? 1 : 2);
                const frameMov = (posFinal - position)/frames;

                let animation = setInterval(frame,1/frames);
                function frame() {
                    if(Math.abs(position - posFinal) < 10) {
                        clearInterval(animation);
                        self.eraseShot(shot,type);
                        self.score(player)
                    }
                    else {
                        position += frameMov;
                        shot.style.cx = position;
                    }
                }
            },

            eraseShot: function(shot,type) {
                canvas.node.getElementsByClassName(type)[0].remove();
            },

            switch: function(chipdata1,chipdata2,player) {
                // "chipdata" references the internal chip data.
                // Not called "chip" to avoid clashing with the DOM chip reference
                const index1 = chipdata1.pos;
                const index2 = chipdata2.pos;
                const data = this.data;
                const chip1 = canvas.node.getElementsByClassName(`${chipdata1.id} ${player.tag}`)[0];
                const chip2 = canvas.node.getElementsByClassName(`${chipdata2.id} ${player.tag}`)[0];
                let position1 = data.positions[index1-1];
                let position2 = data.positions[index2-1];

                const step = 5;
                let animation = setInterval(frame,5);

                function frame() {
                    if(Math.abs(position1 - data.positions[index2-1]) < step+1) {
                        // Stopping the updates
                        clearInterval(animation);

                        // Correcting the positions
                        chip1.style.y = data.positions[index2-1];
                        chip2.style.y = data.positions[index1-1];

                        chipdata1.pos = index2;
                        chipdata2.pos = index1;

                        let [backup1, backup2] = [chipdata1,chipdata2];
                        player.chips[index2-1] = chipdata1;
                        player.chips[index1-1] = chipdata2;

                        combat.select(index1,player);
                    }

                    else { // Frame update happens
                        if(chipdata1.pos > chipdata2.pos) {
                            position1 -= step;
                            position2 += step;
                        }
                        else {
                            position1 += step;
                            position2 -= step;
                        }

                        chip1.style.y = position1;
                        chip2.style.y = position2;
                    }
                }
            },

            end: function() {
                let winner;
                if(P1.score.value === P2.score.value) {
                    winner = "Nobody";
                }
                else if (P1.score.value > P2.score.value) {
                    winner = "Player 1";
                }
                else {
                    winner = "Player 2";
                }
                canvas.node.innerHTML = "";
                let endText = canvas.node.appendChild(svgDraw("text"));
                endText.innerHTML = `${winner} won! Try again?`;
                endText.style.fontSize = 50;
                endText.setAttribute("y",50);
                endText.addEventListener("click",combat.start);
                canvas.node.onkeydown = null;
            },

            debug: function() {
                let debug = canvas.node.appendChild(svgDraw("rect"));
                debug.style.width = 50;
                debug.style.height = 50;
                debug.onclick = function() {
                    console.log(P1.chips);
                }
            }
        },
    } // Close Return
}
