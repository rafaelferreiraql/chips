function gameAudio() {

    return {
        data: {
            activeMusic: null,
            mute: false,
        },

        sounds: {
            shot: document.getElementById("sfx_shot"),
            burst: document.getElementById("sfx_burst"),
        },

        tracks: {
            menu: document.getElementById("music_menu"),
            duel: document.getElementById("music_duel"),
        },

        sfx: function(sound) {
            sound.play();
        },

        music: {
            play: function(track) {
                let current = Audio.data.activeMusic;
                if(current) {current.pause(); current.currentTime = 0;}
                track.loop = true;
                track.play();
                Audio.data.activeMusic = track;
            },

            mute: function() {

            },

        },
    } // Close Return
}
