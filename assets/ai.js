class AI {
    // Interface;
    constructor(player) {
        this.player = player;
    }

    reach() {
        // Only for testing purposes. See if class works as intended
        console.log("Ich bin hier!");
    }

    compare() {
        return "Best course of action decided by AI";
    }

    select() {
        this.player.updateSelection(this.compare());
        console.log(this.player.selected);
    }
}

class RandomAI extends AI {

    compare() {
        return Math.floor(Math.random()*5+1);
    }
}

class BasicAI extends AI {

}
