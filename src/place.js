require("dotenv").config()

const path = require("path")

const express = require("express")
const app = express()
const http = require("http").Server(app)

app.use(express.json())
app.use("/", express.static(path.join(__dirname, "public")))
app.use("/api", express.static(path.join(__dirname, "..", "doc")))

const COLOR_REGEX = /^#([0-9a-f]{3}){1,2}$/i

const { Canvas } = require("./canvas")
var canvas = new Canvas(200, 150)

const { RateLimiter } = require("./ratelimit")
var rateLimiter = new RateLimiter()

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"))
})

app.get("/api", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "doc", "index.html"))
})

/**
 * @api {get} /api/canvas Request Canvas Data
 * @apiName GetCanvasData
 * @apiGroup Canvas
 * @apiDescription Retrieves the entire canvas data including dimensions and comprehensive pixel colors. The pixels are provided in a single array representing the entire canvas, serialized row by row, starting from the top-left corner. Clients are responsible for splitting this array into rows based on the canvas width provided.
 *
 * @apiSuccess (200 OK) {Number} width The width of the canvas in pixels. This width can be used by clients to split the pixel array into individual rows.
 * @apiSuccess (200 OK) {Number} height The height of the canvas in pixels.
 * @apiSuccess (200 OK) {String[]} pixels A flat array of pixel colors in hexadecimal format, representing the entire canvas. Each pixel color is a string in hexadecimal format (e.g., "#FFFFFF" for white). The array should be split into rows by the client, using the provided width to determine the end of a row.
 * 
 * @apiNote The pixels array contains all the canvas pixels in a single, flat array, covering rows sequentially from top to bottom. Clients need to divide this array into the actual rows based on the 'width' value to reconstruct the 2D canvas layout.
 */
app.get("/api/canvas", (req, res) => {
    res.status(200).json(canvas.getData())
})

/**
 * @api {get} /api/pixel Request Pixel Data
 * @apiName GetPixel
 * @apiGroup Pixel
 * @apiDescription Retrieves data of a single pixel from the canvas based on x and y coordinates.
 *
 * @apiParam (body) {Number} x X-coordinate of the pixel.
 * @apiParam (body) {Number} y Y-coordinate of the pixel.
 *
 * @apiSuccess {String} pixelColor Color of the requested pixel in hexadecimal format.
 * @apiError (400 Bad Request) InvalidXValue The x value is not a valid number, is negative, or exceeds canvas width.
 * @apiError (400 Bad Request) InvalidYValue The y value is not a valid number, is negative, or exceeds canvas height.
 */
app.get("/api/pixel", (req, res) => {
    let x = req.body.x
    let y = req.body.y

    if (typeof x !== "number" || x < 0 || x >= canvas.getWidth()) {
        res.status(400).send("Invalid x value.")
        return
    }

    if (typeof y !== "number" || y < 0 || y >= canvas.getHeight()) {
        res.status(400).send("Invalid y value.")
        return
    }

    let pixel = canvas.getPixel(x, y)
    res.status(200).send(pixel)
})

/**
 * @api {post} /api/pixel Update Pixel Data
 * @apiName PostPixel
 * @apiGroup Pixel
 * @apiDescription Updates the color of a single pixel on the canvas based on x and y coordinates.
 *
 * @apiParam (body) {Number} x X-coordinate of the pixel.
 * @apiParam (body) {Number} y Y-coordinate of the pixel.
 * @apiParam (body) {String} color New color for the pixel in hexadecimal format.
 *
 * @apiSuccess {String} message Confirmation message indicating the pixel was placed successfully.
 * @apiError (400 Bad Request) InvalidXValue The x value is not a valid number, is negative, or exceeds canvas width.
 * @apiError (400 Bad Request) InvalidYValue The y value is not a valid number, is negative, or exceeds canvas height.
 * @apiError (400 Bad Request) InvalidColorValue The color value does not match the expected hexadecimal format.
 */
app.post("/api/pixel", (req, res) => {
    let x = req.body.x
    let y = req.body.y
    let color = req.body.color

    if (typeof x !== "number" || x < 0 || x >= canvas.getWidth()) {
        res.status(400).send("Invalid x value. No pixel placed.")
        return
    }

    if (typeof y !== "number" || y < 0 || y >= canvas.getHeight()) {
        res.status(400).send("Invalid y value. No pixel placed.")
        return
    }

    if (typeof color !== "string" || !COLOR_REGEX.test(color)) {
        res.status(400).send("Invalid color value. No pixel placed.")
        return
    }
    /*
    if (rateLimiter.check(req.ip)) {
        res.status(429).send("Too many requests.")
        return
    }
*/
    canvas.setPixel(x, y, color)
    res.status(200).send("Pixel placed successfully.")
})

http.listen(process.env.PORT, () => {
    console.log(`Listening.. *${process.env.PORT}`)
})