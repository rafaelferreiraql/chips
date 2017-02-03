function gameGraphics() {

    let canvas = gameCanvas;
    // Already defined in Engine.init(), but Graphics.combat.data needs this
    // since it's not called. Might try to populate it on Engine.init().

    return {

        global: {

            start: function() {
                let startButton = canvas.node.appendChild(svgDraw("g"));

                let startRect = startButton.appendChild(svgDraw("rect"));
                startRect.style.height = canvas.height/10;
                startRect.style.width = canvas.width/5;
                startRect.style.x = canvas.width/2 - canvas.width/10;

                let startText = startButton.appendChild(svgDraw("text"));
                startText.style.fontSize = canvas.height/12;
                startText.style.fill = "white";
                startText.setAttribute("x",startRect.style.x);
                startText.setAttribute("y",startRect.style.height)
                startText.innerHTML = "START!";

                startButton.addEventListener("click",function() {
                    combat.start();
                });
            }
        },

        combat: {

            start: function() {
                canvas.node.innerHTML = "";
                P1.draw();
                P2.draw();
                P1.drawScore();
                P2.drawScore();
                Graphics.combat.newTurnPH();
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

                    lunar.addClass(rect, `chip ${index+1} ${player.tag}`);

                    // Imprints the actual index of the chip, since it's equal
                    // to the position when this below is assigned.
                    rect.onclick = function() {combat.select(index+1,player)}

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
                let chip = canvas.node.getElementsByClassName(`${sel} ${player.tag}`)[0];
                let shot = canvas.node.appendChild(svgDraw("circle"));
                let chipsize = this.data.chipDim;
                let chipType = player.chips[sel-1].type;

                shot.style.cx = (player.left ?
                    player.X + chipsize : player.X);
                shot.style.cy = parseInt(chip.style.y)+chipsize/2;
                shot.style.r = 10;
                shot.style.stroke = 
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

                        combat.select(chipdata2.id,player);
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

            }
        },
    } // Close Return
}
