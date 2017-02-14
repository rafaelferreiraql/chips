function gameGraphics() {

    let canvas = gameCanvas;
    // Already defined in Engine.init(), but Graphics.combat.data needs this
    // since it's not called. Might try to populate it on Engine.init().
    let mid = () => {return canvas.width/2;};

    return {

        global: {

            start: function() {
                let singleButton = this.drawOption(mid,5,"Single Player",
                    global.singlePlayer);

                let multiButton = this.drawOption(mid,7,"Multi Player",
                    global.multiPlayer);

                let cpuButton = this.drawOption(mid,9,"CPU x CPU",
                    global.cpu);

                let configButton = this.drawOption(mid,11,"Config keys (experimental!)",
                    global.keyConfig);
            },

            single: function() {
                let start = this.drawOption(mid,1,"Start!",combat.start);
                this.chipSelect(p1data.chips,"left",3,"P1");
            },

            multi: function() {
                let start = this.drawOption(mid,1,"Start!",combat.start);
                let placeholder = canvas.node.appendChild(svgDraw("text"));
                placeholder.style.fontSize = canvas.height/18;
                placeholder.setAttribute("y",100);

                this.chipSelect(p1data.chips,"left",3,"P1");
                this.chipSelect(p2data.chips,"right",3,"P2");
            },

            cpu: function() {
                let start = this.drawOption(mid,1,"Start!",combat.start);

                this.chipSelect(p1data.chips,"left",3,"P1");
                this.chipSelect(p2data.chips,"right",3,"P2");
            },

            configScreen: function() {
                let back = this.drawOption(mid,1,"Return",global.start);
                let p1config = this.drawOption("left",3,"Config P1 Keys",() => {
                    this.keyConfig("p1");
                });
                let p2config = this.drawOption("right",3,"Config P2 Keys",() => {
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
                let inputHere = this.drawText(mid,5);
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

            drawOption: function(xFunction,yFraction,text,e) {
                const pad = 10; // Padding

                let box = canvas.node.appendChild(svgDraw("rect"));
                let svgText = this.drawText(xFunction,yFraction,text,e,pad*2);

                const round = 10; // Rounded corner radius

                // Text y points to the bottom, so I use getBBox().y instead
                box.style.x = svgText.getAttribute("x") - pad;
                box.style.y = svgText.getBBox().y - pad;
                box.style.width = svgText.getBBox().width + pad*2;
                box.style.height = svgText.getBBox().height + pad*2;
                box.style.opacity = 1;
                box.style.rx, box.style.ry = round;
                box.style.strokeWidth = 2;
                box.style.transition = "fill stroke 0.1s linear";
                function boxColors() { // For reuse in mouseout event
                    box.style.fill = "grey";
                    box.style.stroke = "blue";
                }
                boxColors();
                box.addEventListener("mouseover",() => {
                    box.style.fill = "blue";
                    box.style.stroke = "green"
                });
                box.addEventListener("mouseout",boxColors);

                if(e) {
                    box.addEventListener("click",e)
                }

                // Additional text styling
                svgText.style.fill = "white";
                svgText.setAttribute("pointer-events","none");

                // Classing elements
                lunar.addClass(box,"menuOption box");
                lunar.addClass(svgText,"menuOption");

                onResize(function() {
                    box.style.x = svgText.getAttribute("x") - pad;
                })

                return box;
            },

            drawText: function(xFunction,yFraction,text,e,pad=0) {
                let button = canvas.node.appendChild(svgDraw("text"));
                button.style.fontSize = canvas.height/16;
                button.style.fill = "black";
                button.style.fontFamily = "menuFont";
                button.innerHTML = text;

                function set_X() {
                    if(typeof xFunction === "string") {
                        let original = xFunction;
                        if(xFunction === "left") xFunction = pad;
                        else if (xFunction === "right") xFunction = canvas.width - button.getBBox().width - pad;
                        button.setAttribute("x",xFunction);
                        // The "original" shenanigans is necessary for the function
                        // to receive xFunction always as it should be when it's
                        // invoked by a screen size change.
                        xFunction = original;
                    }
                    else {
                        button.setAttribute("x",xFunction() - button.getBBox().width/2);
                    }
                }
                set_X();

                button.setAttribute("y",canvas.height/12*yFraction);
                onResize(function() {
                    set_X();
                });
                lunar.addClass(button,"text");

                return button;
            },

            chipSelect: function(chips,textX,yFraction,p) {
                let original = textX;
                let padding = 20;
                let pick = 0;
                let dialog =
                    this.drawText(
                        textX,
                        yFraction,`Choose your deck (${p})`,null,padding);

                let textWidth = dialog.getBBox().width;

                // De-centering the chips
                if (typeof textX === "string") textX = () => dialog.getBBox().x;
                else {
                    textX = () => original() - textWidth/2;
                }

                chipWheel.forEach(function(chip,i) { // Representing your options
                    let rect = canvas.node.appendChild(svgDraw("rect"));
                    rect.setAttribute("x",i*textWidth/5+textX());
                    rect.setAttribute("y",canvas.height/12*(yFraction+1));
                    rect.style.fill = chip.color;
                    rect.style.height = 25;
                    rect.style.width = 25;

                    let changeDeck = function() {
                        chips[pick] = chip;
                        if(global.data.menu !== "multi") {
                            canvas.node.getElementsByClassName(p+" "+pick)[0].style.fill =
                                chip.color;
                        }
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
                    onResize(function() {
                        rect.setAttribute("x",i*textWidth/5+textX());
                    })
                });
                chips.forEach(function(chip,i) { // Representing the deck
                    let rect = canvas.node.appendChild(svgDraw("rect"));
                    rect.setAttribute("x",textX());
                    rect.setAttribute("y",canvas.height/12*(yFraction+2.25+(i*1.2)));
                    if(global.data.menu !== "multi") rect.style.fill = chip.color;
                    rect.style.height = 40;
                    rect.style.width = 40;
                    lunar.addClass(rect,p+" "+i)
                    rect.addEventListener("click",function() {
                        pick = i;
                    });
                    onResize(function() {
                        rect.setAttribute("x",textX());
                    })
                });
            },

        },

        combat: {

            start: function() {
                canvas.node.innerHTML = "";
                P1.draw();
                P2.draw();
                P1.drawScore();
                P2.drawScore();
                //this.debug(); // For various debug purposes
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
                chipScale: 10,
                gridPad: canvas.height/12,
                grid: range(1,6).map((v,_,array) => {
                    let gridPad = canvas.height/12;
                    return (gridPad+(canvas.height-2*gridPad)/(array.length+1)*v);
                }),
            },

            drawChips: function(player) {
                const self = this;
                this.data.positions = this.data.grid.map(function(pos) {
                    return pos - self.data.chipDim/2;
                });
                this.data.grid.forEach(function(pos,index) {
                    let scaleFactor = self.data.chipScale;
                    let dim = self.data.chipDim;
                    let rect = canvas.node.appendChild(svgDraw("use"));
                    // The assignment below MUST be different if we introduce chips
                    // whose name is different from its respective shots.
                    let chipname = player.chips[index].type.shot;
                    rect.setAttribute("href","#chip"+chipname);
                    rect.setAttribute("transform",`scale(${1/scaleFactor})`);
                    // Mutliplying by 10 because of the transform!
                    rect.setAttribute("x",(player.left ? player.X : player.X-dim)*scaleFactor);
                    rect.setAttribute("y",self.data.positions[index]*scaleFactor);

                    // Note: the class will refer always to the ID.
                    // When fetching the chip on the DOM, remember it's the ID,
                    // not the position!
                    lunar.addClass(rect, `chip ${index+1} ${player.tag}`);

                    rect.onclick = function() {combat.select(
                        player.chips.findIndex(chip=>chip.id === index+1)+1,player)}

                    onResize(function() {
                        player.X = player.setX();
                        rect.setAttribute("x",(player.left ? player.X : player.X-dim)*10);
                    })
                })
            },

            score: function(player) {
                let score;
                if(!canvas.node.getElementsByClassName(player.tag+" score")[0]) {
                    score = canvas.node.appendChild(svgDraw("text"));
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
                    score = canvas.node.getElementsByClassName(player.tag+" score")[0];
                    score.innerHTML = player.score.value;
                }

                onResize(function() {
                    let pad = 100;
                    score.setAttribute("x",player.left ? canvas.width/2 - pad : canvas.width/2 + pad)
                });

            },

            newTurnPH: function() {
                let turner = canvas.node.getElementsByClassName("nextTurn")[0]
                if(turner) { // Turn button is already rendered
                    let text;
                    if(combat.data.turn === combat.data.lastTurn) text = "End";
                    else if((combat.data.turn + 1) % 5 !== 0) text = "Shoot!";
                    else text = "Switch!";

                    turner.innerHTML = text;
                }

                else { // Turn button is not rendered
                    turner = canvas.node.appendChild(svgDraw("text"));
                    lunar.addClass(turner,"nextTurn");

                    turner.innerHTML = "Shoot!";

                    turner.style.userSelect = "none";
                    turner.style.fontSize = 40;

                    turner.setAttribute("height",30);
                    turner.setAttribute("width",30);
                    turner.setAttribute("fill","green");
                    turner.setAttribute("x",canvas.width/2 - turner.getBBox().width/2);
                    turner.setAttribute("y",40);
                    turner.addEventListener("click",combat.newTurn);
                }

                onResize(function() {
                    turner.setAttribute("x",canvas.width/2 - turner.getBBox().width/2);
                })
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
                // chipY divided by 10 because of transform, again
                shot.style.cy = parseInt(chip.getAttribute("y")/10)+chipsize/2;
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
                        if (half) self.collide([posFinal,shot.style.cy],player.left)
                        self.eraseShot(shot,type);
                        self.score(player);
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

            collide: function(coords,left,color) {
                let burst = canvas.node.appendChild(svgDraw("use"));

                // Copied straight from the original file.
                let dimensions = {width: 31.865231, height: 46.86792}
                burst.setAttribute("width",dimensions.width);
                burst.setAttribute("height",dimensions.height);

                burst.setAttribute("x",coords[0]);
                burst.setAttribute("y",coords[1]);
                burst.setAttribute("href","#shotburst");

                // Troublesome because the gradient is already ID'ed before on the code
                Array.from(burst.getElementsByTagName("stop")).forEach(
                    stop => {
                        stop.setAttribute("stop-color","#5aa");
                    }
                );
                // Troublesome because ???
                Array.from(burst.getElementsByTagName("path")).forEach(
                    path => {
                        path.setAttribute("fill","#48a");
                    }
                );
                lunar.addClass(burst,"burst");

                if(left) {
                    // Horizontal flip and retranslating because of mirroring
                    let x = 2*(burst.getBBox().x + burst.getBBox().width);
                    burst.setAttribute("transform",`scale(-1,1) translate(${-x},0)`);
                    console.log(x);
                    console.log(burst.getBBox().x);
                }

                window.setTimeout(function() {
                    Array.from(canvas.node.getElementsByClassName("burst")).forEach(
                    (el) => el.remove())
                },2000);
            },

            switch: function(chipdata1,chipdata2,player) {
                // "chipdata" references the internal chip data.
                // Not called "chip" to avoid clashing with the DOM chip reference
                const index1 = chipdata1.pos;
                const index2 = chipdata2.pos;
                const data = this.data;
                const chip1 = canvas.node.getElementsByClassName(`${chipdata1.id} ${player.tag}`)[0];
                const chip2 = canvas.node.getElementsByClassName(`${chipdata2.id} ${player.tag}`)[0];
                let position1 = data.positions[index1-1]*10;
                let position2 = data.positions[index2-1]*10;

                const step = 50;
                let animation = setInterval(frame,5);

                function frame() {
                    if(Math.abs(position1 - data.positions[index2-1]*10) < step+1) {
                        // Stopping the updates
                        clearInterval(animation);

                        // Correcting the positions
                        chip1.setAttribute("y",data.positions[index2-1]*10);
                        chip2.setAttribute("y",data.positions[index1-1]*10);

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

                        chip1.setAttribute("y",position1);
                        chip2.setAttribute("y",position2);

                        //chip1.style.y = position1;
                        //chip2.style.y = position2;
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
