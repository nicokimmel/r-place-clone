const BASE_COLOR = "#FFFFFF"

class Canvas {
    constructor(width, height) {
        this.width = width
        this.height = height
        this.canvas = new Array(width * height).fill(BASE_COLOR)
    }

    getWidth() {
        return this.width
    }

    setWidth(width) {
        const newCanvas = new Array(width * this.height).fill(BASE_COLOR)
        const cols = Math.min(this.width, width)
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < cols; x++) {
                const oldIndex = y * this.width + x
                const newIndex = y * width + x
                newCanvas[newIndex] = this.canvas[oldIndex]
            }
        }
        this.width = width
        this.canvas = newCanvas
    }

    getHeight() {
        return this.height
    }

    setHeight(height) {
        const newCanvas = new Array(this.width * height).fill(BASE_COLOR)
        const rows = Math.min(this.height, height)
        for (let y = 0; y < rows; y++) {
            for (let x = 0; x < this.width; x++) {
                const index = y * this.width + x
                newCanvas[index] = this.canvas[index]
            }
        }
        this.height = height
        this.canvas = newCanvas
    }

    getCanvas() {
        return this.canvas
    }

    getData() {
        let data = {
            width: this.width,
            height: this.height,
            pixels: this.canvas
        }
        return data
    }

    clearCanvas() {
        this.canvas = new Array(this.width * this.height).fill(BASE_COLOR)
    }

    getPixel(x, y) {
        return this.canvas[y * this.width + x]
    }

    setPixel(x, y, color) {
        this.canvas[y * this.width + x] = color
    }
}

module.exports = { Canvas }