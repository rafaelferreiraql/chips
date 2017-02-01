function gameAI() {

    return {
        random: function() {

            return {
                choose: function(player) {
                    player.selected = Math.floor(Math.random() * 5);
                },
            }
        },

        basic: function() {

            return {
                choose: function() {

                },
            }
        },

        // Tests every possibility it receives and spits out which is the best option
        test: function() {
            return null;
        },
    }
}
