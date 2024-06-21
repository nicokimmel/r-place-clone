var canvas = null
var canvasElement = document.getElementById("canvas")
var infoElement = document.getElementById("info")

function updateCanvas() {
    getCanvasData((data) => {
        canvas = JSON.parse(data)
        console.log(canvas)
        canvasElement.width = canvas.width
        canvasElement.height = canvas.height
        infoElement.innerText = `Canvas Size: ${canvas.width}x${canvas.height}`
        drawCanvas()
    })
}

function drawCanvas() {
    let canvasContext = canvasElement.getContext("2d")
    for (let x = 0; x < canvas.width; x++) {
        for (let y = 0; y < canvas.height; y++) {
            let index = y * canvas.width + x
            canvasContext.fillStyle = canvas.pixels[index]
            canvasContext.fillRect(x, y, 1, 1)
        }
    }
}

window.setInterval(updateCanvas, 1000)