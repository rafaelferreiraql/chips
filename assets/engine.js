// Just a quick reference.
let DOM = {
    height: document.getElementById("game").getBoundingClientRect().height,
}

// The Engine function in fact will work as the object it's returning.
// It's a self-executing function only for variable encapsulation purposes
// to make life easier.
let Engine = function() {

    let combat;
    let GUI;

    return {

        accessTest: "hOI!",

        init: function() {
            combat = this.combat;
            GUI = this.GUI;
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
                GUI.combat.draw();
            },

            newTurn: function() {
                combat.data.turn += 1;
                combat.shoot();
                setTimeout(GUI.combat.eraseShot,1000);
            },

            shoot: function() {
                GUI.combat.shoot(combat.data.selected);
            },

            select: function(sel) {
                combat.data.selected = sel;
                console.log(sel);
            }
        },



        GUI: function() {

            let canvas = document.getElementById("game");

            return {

                combat: {
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
                            rect.setAttribute("x",100);
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

                        shot.setAttribute("cx",parseInt(chip.getAttribute("x"))+chipsize);
                        shot.setAttribute("cy",parseInt(chip.getAttribute("y"))+chipsize/2);
                        shot.setAttribute("r",10);
                        shot.setAttribute("fill","blue");
                        shot.setAttribute("class","shot");

                        this.shotMove();
                    },

                    shotMove: function() {
                        let shot = canvas.getElementsByClassName("shot")[0];
                    },

                    eraseShot: function() {
                        canvas.getElementsByClassName("shot")[0].remove();
                    }
                }
            }
        }()
    }
}();

Engine.init();
