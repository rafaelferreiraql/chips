# Chips
A small horizontally-responsive HTML5 turn-based game I'm making. It's now mostly finished, but there's still a few adjustments remaining and browser compatibility may be low. It's unlikely I touch these files again, though, and if I ever resume development on "Chips" (which is somewhat likely), I'll rather restart from scratch while the game is still this simple.
It's made with almost vanilla JS, no Phaser or Babylon, not even jQuery or React, just some tiny libraries here and there for specific purposes.

## Known bugs
* In a few select situations, the AI may crash. I still haven't found out why, but it's related to how it decides which chip it'll activate. *Probably fixed! May need more playtesting*
* When configuring your keys, keep in mind that keys like Page Down, End and Down Arrow don't lose their default function on the browser, meaning they'll keep moving the window, so avoid using those for now.
* If you click the new turn button before shots hit or vanish, there may be minor glitches.
* In a more technical note, registered event handlers are never removed until the page is closed or refreshed.