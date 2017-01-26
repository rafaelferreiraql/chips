function gameGraphics() {

    let canvas = document.getElementById("game");

    return {

        global: {},

        combat: {

            data: {
                chipDim: 50,
                chipX: (DOM.width)*0.15, // 15%
                grid: range(1,6).map((v,_,array) => {
                    return (DOM.height/(array.length+1))*v;
                }),
            },

            grid: range(1,6).map((v,_,array) => {
                return (DOM.height/(array.length+1))*v;
            }),

            draw: function() {
                canvas.innerHTML = "";
                this.drawChips();
                this.newTurnPH();
            },

            drawChips: function() {
                const self = this;
                this.data.positions = this.data.grid.map(function(pos) {
                    return pos - self.data.chipDim/2;
                });
                this.data.grid.forEach(function(pos,index) {
                    let dim = self.data.chipDim;
                    let rect = canvas.appendChild(svgDraw("rect"));

                    rect.style.height = dim;
                    rect.style.width = dim;
                    rect.style.x = Game.Graphics.combat.data.chipX;
                    rect.style.y = self.data.positions[index];

                    // rect.setAttribute("height",dim);
                    // rect.setAttribute("width",dim);
                    // rect.setAttribute("x",Game.Graphics.combat.data.chipX);
                    // rect.setAttribute("y",self.data.positions[index]);
                    rect.setAttribute("class",index+1);
                    rect.onclick = function() {combat.select(index+1)}
                })
            },

            newTurnPH: function() {
                // Botão verde debug para mudar a rodada manualmente
                let turner = canvas.appendChild(svgDraw("rect"));
                console.log("cheguei");

                turner.setAttribute("height",30);
                turner.setAttribute("width",30);
                turner.setAttribute("fill","green");
                turner.addEventListener("click",combat.newTurn);
            },

            shoot: function(sel) {
                let chip = canvas.getElementsByClassName(sel)[0];
                let shot = canvas.appendChild(svgDraw("circle"));
                let chipsize = this.data.chipDim;

                shot.style.cx = 20;
                shot.style.cy = parseInt(chip.style.y)+chipsize/2;
                shot.style.r = 10;
                shot.style.fill = "blue"
                shot.setAttribute("class","shot");

                this.shotMove();
            },

            shotMove: function() {
                const self = this;
                let shot = canvas.getElementsByClassName("shot")[0];

                // Animate
                let position = parseInt(shot.style.cx);
                const posFinal = 500;
                let animation = setInterval(frame,5);
                function frame() {
                    if(position > posFinal) {
                        clearInterval(animation);
                        self.eraseShot();
                    }
                    else {
                        position += 5;
                        shot.style.cx = position;
                    }
                }
            },

            eraseShot: function() {
                canvas.getElementsByClassName("shot")[0].remove();
            },

            switch: function(sel1,sel2) {
                let data = this.data;
                const chip1 = canvas.getElementsByClassName(sel1)[0];
                const chip2 = canvas.getElementsByClassName(sel2)[0];
                let position1 = data.positions[sel1-1];
                let position2 = data.positions[sel2-1];

                const step = 5;
                let animation = setInterval(frame,5);

                function frame() {
                    if(Math.abs(position1 - data.positions[sel2-1]) < step+1) {
                        clearInterval(animation);
                        position1 = data.positions[sel2-1];
                        position2 = data.positions[sel1-1];
                        chip1.setAttribute("class",sel2);
                        chip2.setAttribute("class",sel1);
                        chip1.onclick = function() {combat.select(sel2)};
                        chip2.onclick = function() {combat.select(sel1)};
                    }

                    else {
                        if(data.positions[sel1-1] > data.positions[sel2-1]) {
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
