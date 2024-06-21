function getCanvasData(callback) {
    let request = new XMLHttpRequest()

    request.open("GET", "/api/canvas", true)
    request.setRequestHeader("Content-Type", "application/json;charset=UTF-8")
    request.send()

    request.onload = function () {
        callback(request.responseText)
    }
}

function getPixelData(x, y, callback) {
    let request = new XMLHttpRequest()

    request.open("GET", "/api/pixel", true)
    request.setRequestHeader("Content-Type", "application/json;charset=UTF-8")
    request.send(JSON.stringify({
        "x": x,
        "y": y
    }))

    request.onload = function () {
        callback(request.responseText)
    }
}

function sendPixelData(x, y, color, callback) {
    let request = new XMLHttpRequest()

    request.open("POST", "/api/pixel", true)
    request.setRequestHeader("Content-Type", "application/json;charset=UTF-8")
    request.send(JSON.stringify({
        "x": x,
        "y": y,
        "color": color
    }))

    request.onload = function () {
        callback(request.responseText)
    }
}