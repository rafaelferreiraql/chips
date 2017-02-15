// The Game function in fact will work as the object it's returning.
// It's a self-executing function only for variable encapsulation purposes
// to make life easier.
let Game = function() {

    let combat, Graphics, Audio;
    // Will be defined in Engine.init()

    let sounds, tracks;
    // Will be defined in Engine.init()

    let chipData;
    // Will be defined in combat.start()

    let canvas;
    // The game container, defined in Engine.init()

    let p1data, p2data;
    // Player data, defines unique properties of each player

    let shots, types;
    // data on types of shots and chips

    let P1, P2;
    // The players, defined in combat.start()

    return {

        Engine: gameEngine(),

        Graphics: gameGraphics(),

        Audio: gameAudio(),

    } // Close Return
}();

Game.Engine.init();
