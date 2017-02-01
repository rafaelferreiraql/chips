// The Game function in fact will work as the object it's returning.
// It's a self-executing function only for variable encapsulation purposes
// to make life easier.
let Game = function() {

    let combat, Graphics;
    // Will be defined in Engine.init()

    let chipData;
    // Will be defined in combat.start()

    let canvas;
    // The game container, defined in Engine.init()

    // The players, defined in combat.start();
    let P1, P2;

    // Artificial Intelligence, assigned in 
    let AI;

    return {

        Engine: gameEngine(),

        Graphics: gameGraphics(),

        AI: gameAI(),

    } // Close Return
}();

Game.Engine.init();
