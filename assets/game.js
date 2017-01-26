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
    // Will be defined in Engine.init()

    return {

        Engine: gameEngine(),

        Graphics: gameGraphics(),

    } // Close Return
}();


Game.Engine.init();
