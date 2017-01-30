function gameGraphics() {

    let canvas = gameCanvas;
    // Already defined in Engine.init(), but Graphics.combat.data needs this
    // since it's not functional.

    return {

        global: {},

        combat: {

            data: {
                chipDim: 50,
                chipX: (canvas.width)*0.15, // 15%
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
                    //rect.style.x = Game.Graphics.combat.data.chipX;
                    rect.style.x = player.X;
                    rect.style.y = self.data.positions[index];

                    lunar.addClass(rect, `chip ${index+1} ${player.tag}`);

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

                shot.style.cx = (player.left ?
                    player.X + chipsize : player.X);
                shot.style.cy = parseInt(chip.style.y)+chipsize/2;
                shot.style.r = 10;
                shot.style.fill = "blue";
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

            switch: function(sel1,sel2,player) {
                let data = this.data;
                const chip1 = canvas.node.getElementsByClassName(`${sel1} ${player.tag}`)[0];
                const chip2 = canvas.node.getElementsByClassName(`${sel2} ${player.tag}`)[0];
                let position1 = data.positions[sel1-1];
                let position2 = data.positions[sel2-1];

                const step = 5;
                let animation = setInterval(frame,5);

                function frame() {
                    if(Math.abs(position1 - data.positions[sel2-1]) < step+1) {
                        // Stopping the updates
                        clearInterval(animation);

                        // Correcting the positions
                        chip1.style.y = data.positions[sel2-1];
                        chip2.style.y = data.positions[sel1-1];

                        // Re-classing the chips
                        lunar.removeClass(chip1,sel1); lunar.addClass(chip1,sel2);
                        lunar.removeClass(chip2,sel2); lunar.addClass(chip2,sel1);

                        // Remaking the click interactions
                        chip1.onclick = function() {combat.select(sel2,player)};
                        chip2.onclick = function() {combat.select(sel1,player)};
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
