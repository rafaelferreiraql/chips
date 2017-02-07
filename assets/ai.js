class AI {
    // Interface;
    constructor(player) {
        this.player = player;
    }

    compare() {
        // Meant to be overriden by the respective AIs.
        return "Best course of action decided by AI";
    }

    select() {
        this.player.updateSelection(this.compare());
    }
}

class RandomAI extends AI {
    // This AI is, like the name says, random. It literally chooses any chip randomly.
    // Not intelligent, but it's at least unpredictable.

    compare() {
        return Math.floor(Math.random()*5+1);
    }
}

class BasicAI extends AI {
    // This AI scans all possibilities and chooses the best one, assuming the player
    // will choose between ANY of their chips. Beats the random AI for that reason,
    // but is very predictable and also may not change until the switch turn.

    compare() {
        // "options" will be an array of AI analysis of every possible selection choice,
        // ordered by the chip index (that is, the id minus 1).
        // This compare() function will determine how to set the selection.

        let options;

        if((combat.data.turn + 1)%5 !== 0) {
            options = this.compareShots();
        }

        else {
            options = this.compareSwitch();
        }

        const chosenChip = this.choose(options);

        return this.player.chips[chosenChip].id;
    }

    choose(options) {
        // Receives options and simply chooses the most overall favourable.
        // Since the AI is basic, it doesn't consider the player's options.
        return options.reduce(function(iMax,next,index,a) {
            if (next > a[iMax]) {
                return index;
            }
            else if (next < a[iMax]) {
                return iMax;
            }
            else return [index,iMax][Math.round(Math.random())];
        }, 0);
    }

    compareShots() {
        const me = this.player;
        const enemy = (this.player.tag === "P1" ? P2 : P1);

        let outcomes = [];

        me.chips.forEach(function(chip) {
            outcomes.push([]);

            enemy.chips.forEach(function(opp) {

                let outcome = 0;

                if(!combat.willBreak(chip,opp)) {
                    outcome += chip.shot.dmg;
                }
                if (!combat.willBreak(opp,chip)) {
                    outcome -= (opp.shot.dmg);
                }

                outcomes[outcomes.length-1].push(outcome);
            })
        })

        const results = outcomes.map(function(position) {
            return sum(position);
        })

        return results;
    }

    compareSwitch() {
        const me = this.player;
        const enemy = (this.player.tag === "P1" ? P2 : P1);

        let results = [];

        range(5).forEach(function(index) {

            let outcome = 0;

            // Index is the chip's position (not minus 1 since range() starts from 0)
            // It was previously the ID but I learned from my mistakes.
            if(index < 3) {
                let chip1 = me.chips[index];
                let chip2 = me.chips[index+1];
                let opp1 = enemy.chips[index+1];
                let opp2 = enemy.chips[index];

                // Pasted from compareShots(). Will compare shots
                // between just the chips affected by the switch.
                //
                // Note it doesn't take into account the opponent switching.
                if(!combat.willBreak(chip1,opp1)) {
                    outcome += chip1.shot.dmg;
                }
                if (!combat.willBreak(opp1,chip1)) {
                    outcome -= (opp1.shot.dmg);
                }

                if(!combat.willBreak(chip2,opp2)) {
                    outcome += chip2.shot.dmg;
                }
                if (!combat.willBreak(opp2,chip2)) {
                    outcome -= (opp2.shot.dmg);
                }
            }

            else if(me.chips[index].pos > 3) {
                let chip1 = me.chips[index];
                let chip2 = me.chips[index-1];
                let opp1 = enemy.chips[index-1];
                let opp2 = enemy.chips[index];

                if(!combat.willBreak(chip1,opp1)) {
                    outcome += chip1.shot.dmg;
                }
                if (!combat.willBreak(opp1,chip1)) {
                    outcome -= (opp1.shot.dmg);
                }

                if(!combat.willBreak(chip2,opp2)) {
                    outcome += chip2.shot.dmg;
                }
                if (!combat.willBreak(opp2,chip2)) {
                    outcome -= (opp2.shot.dmg);
                }
            }

            results.push(outcome);
        })

        return results;
    }

}

class BasicAIPlus extends BasicAI {
    // Analyzes the situation exactly the same way the basic AI does, but
    // doesn't simply choose the best option; instead, it chooses by probability.
    // The best it considers a selection, most probably it will choose that one.
    // That guarantees the AI will be "rational" but less predictable.

    choose(options) {
        // sets all values as positive (starting from 0)
        const normalized = options.map(function(option,i) {
            return option - Math.min.apply(0,options);
        });

        // Sets array values as "zones" for the RNG to fit in
        const probabilistic = normalized.map(function(value,index) {
            return value + sum(normalized.slice(0,index));
        });

        let RNG = Math.random() * sum(normalized);
        let choice = probabilistic.findIndex(value => RNG < value);

        return choice;

    }
}
