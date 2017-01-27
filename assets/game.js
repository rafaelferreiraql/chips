// Just a quick reference.

// The Game function in fact will work as the object it's returning.
// It's a self-executing function only for variable encapsulation purposes
// to make life easier.
let Game = function() {

    let combat;
    let Graphics;
    // Will be defined in Engine.init()

    let chipData;
    // Will be defined in combat.start()

    return {

        Engine: gameEngine(),

        Graphics: gameGraphics(),

    } // Close Return
}();


Game.Engine.init();
