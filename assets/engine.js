// Just a quick reference.
let DOM = {
    height: document.getElementById("game").getBoundingClientRect().height,
    width: document.getElementById("game").getBoundingClientRect().width,
}

// The Game function in fact will work as the object it's returning.
// It's a self-executing function only for variable encapsulation purposes
// to make life easier.
let Game = function() {

    let combat;
    let Graphics;
    let matchData;

    return {

        Engine: function() {

            return {
                init: function() {
                    combat = Game.Engine.combat;
                    Graphics = Game.Graphics;
                    matchData = Game.Graphics.combat.data;

                    combat.start();
                },

                global: {

                },

                combat: {

                    data: {
                        turn: 0,
                        selected: 3,
                    },

                    start: function() {
                        Graphics.combat.draw();
                    },

                    newTurn: function() {
                        let selected = combat.data.selected;
                        combat.data.turn += 1;
                        if(combat.data.turn%5 === 0) {
                            if(selected < 3) combat.switch(selected,selected+1);
                            else if (selected > 3) combat.switch(selected,selected-1);
                        }
                        else {
                            combat.shoot();
                        }
                    },

                    shoot: function() {
                        Graphics.combat.shoot(combat.data.selected);
                    },

                    select: function(sel) {
                        combat.data.selected = sel;
                        console.log(sel);
                    },

                    switch: function(sel1,sel2) {
                        console.log(`${sel1} ${sel2} Switch`);
                        Graphics.combat.switch(sel1,sel2);
                    }
                },
            } // Close Return
        }(),

        Graphics: function() {

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

                    // Clean later, it's dirty
                    switch: function(sel1,sel2) {

                        let data = this.data;
                        let selections = [sel1,sel2];
                        const chip1 = canvas.getElementsByClassName(sel1)[0];
                        const chip2 = canvas.getElementsByClassName(sel2)[0];
                        let position1 = data.positions[sel1-1];
                        let position2 = data.positions[sel2-1];
                        const step = 5;
                        let animation = setInterval(frame,5);

                        function frame() {
                            if(Math.abs(position1 - data.positions[sel2-1]) < step+1) {
                                clearInterval(animation);
                                chip1.setAttribute("class",sel2);
                                chip2.setAttribute("class",sel1);
                                chip1.onclick = function() {combat.select(sel2)};
                                chip2.onclick = function() {combat.select(sel1)};
                                console.log(`Position1: ${position1}, Position2: ${position2}`);
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
                        /*
                        chip1.setAttribute("class",sel2);
                        chip2.setAttribute("class",sel1);
                        */
                    }
                },
            } // Close Return
        }(),
    } // Close Return
}();

function GUI() {

    let canvas = document.getElementById("game");
    let data;

    return {

        global: {},

        combat: {

            data: {
                chipX: (DOM.width)*15/100,
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
                this.grid.forEach(function(pos,index) {
                    let dim = 50;
                    let rect = canvas.appendChild(svgDraw("rect"));

                    rect.setAttribute("height",dim);
                    rect.setAttribute("width",dim);
                    rect.setAttribute("x",Game.Graphics.combat.data.chipX);
                    rect.setAttribute("y",pos-dim/2);
                    rect.setAttribute("class",index+1);
                    rect.addEventListener("click",()=>combat.select(index+1))
                })
            },

            newTurnPH: function() {
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
                let chipsize = parseInt(chip.getAttribute("height"));
                console.log(chipsize);

                console.log("bang!");

                shot.setAttribute("cx",parseInt(chip.getBoundingClientRect().width)+chipsize);
                shot.setAttribute("cy",parseInt(chip.getAttribute("y"))+chipsize/2);
                shot.setAttribute("r",10);
                shot.setAttribute("fill","blue");
                shot.setAttribute("class","shot");

                this.shotMove();

                setTimeout(this.eraseShot,1000);
            },

            shotMove: function() {
                let shot = canvas.getElementsByClassName("shot")[0];
                //shot.style.
            },

            eraseShot: function() {
                canvas.getElementsByClassName("shot")[0].remove();
            }
        },
    } // Close Return
}

Game.Engine.init();
