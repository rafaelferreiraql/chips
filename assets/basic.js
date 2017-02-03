let gameCanvas = {
    node: document.getElementById("game"),
    height: document.getElementById("game").getBoundingClientRect().height,
    width: document.getElementById("game").getBoundingClientRect().width,
}

onResize(function() {
    gameCanvas.height = document.getElementById("game").getBoundingClientRect().height;
    gameCanvas.width = document.getElementById("game").getBoundingClientRect().width;
})
