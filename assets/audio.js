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

        init: function() {
            Audio.volumes(); // Sets default volume
        },

        volumes: function() {
            Audio.sounds.shot.volume = 1;
            Audio.sounds.burst.volume = 1;
            Audio.tracks.menu.volume = 1;
            Audio.tracks.duel.volume = 0.6;
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
        },

        mute: function() {
            Audio.data.mute = !Audio.data.mute;
            if(Audio.data.mute) {
                Array.from(
                    document.getElementsByTagName("audio")
                ).forEach(element => element.volume = 0);
            }
            else Audio.volumes();
        },
    } // Close Return
}
