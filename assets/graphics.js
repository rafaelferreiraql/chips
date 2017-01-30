function gameGraphics() {

    let canvas = gameCanvas;
    // Already defined in Engine.init(), but Graphics.combat.data needs this
    // since it's not functional.

    return {

        global: {},

        combat: {

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
                    rect.style.x = player.X;
                    rect.style.y = self.data.positions[index];
                    rect.style.fill = player.chips[index].type.color;

                    lunar.addClass(rect, `chip ${index+1} ${player.tag}`);

                    // Imprints the actual index of the chip, since it's equal
                    // to the position when this below is assigned.
                    rect.onclick = function() {combat.select(index+1,player)}
                })
            },

            newTurnPH: function() {
                // Botão verde debug para mudar a rodada manualmente
                let turner = canvas.node.appendChild(svgDraw("rect"));
                console.log("cheguei");

                turner.setAttribute("height",30);
                turner.setAttribute("width",30);
                turner.setAttribute("fill","green");
                turner.addEventListener("click",combat.newTurn);
            },

            shoot: function(player) {
                let sel = player.selected;
                let chip = canvas.node.getElementsByClassName(`${sel} ${player.tag}`)[0];
                let shot = canvas.node.appendChild(svgDraw("circle"));
                let chipsize = this.data.chipDim;
                let chipType = player.chips[sel-1].type;

                shot.style.cx = (player.left ?
                    player.X + chipsize : player.X);
                shot.style.cy = parseInt(chip.style.y)+chipsize/2;
                shot.style.r = 10;
                shot.style.fill = shots[chipType.shot].color;
                lunar.addClass(shot,"shot");

                this.shotMove(player,shot);
            },

            shotMove: function(player,shot) {
                const self = this;

                // Animate
                let position = parseInt(shot.style.cx);
                const posFinal = 500;
                const frames = 60;
                const frameMov = (posFinal - position)/frames;

                let animation = setInterval(frame,1/60);
                function frame() {
                    if(Math.abs(position - posFinal) < 10) {
                        clearInterval(animation);
                        self.eraseShot(shot);
                    }
                    else {
                        position += frameMov;
                        shot.style.cx = position;
                    }
                }
            },

            eraseShot: function(shot) {
                canvas.node.getElementsByClassName("shot")[0].remove();
            },

            switch: function(chipdata1,chipdata2,player) {
                // "chipdata" references the internal chip data.
                // Not called "chip" to avoid clashing with the DOM chip reference
                const index1 = chipdata1.pos;
                const index2 = chipdata2.pos;
                let data = this.data;
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
            }
        },
    } // Close Return
}
