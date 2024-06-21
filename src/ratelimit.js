class RateLimiter {

    constructor() {
        this.limitList = {}
        this.run()
    }

    run() {
        setInterval(() => {
            for (let ip in this.limitList) {
                if (this.limitList[ip] <= 0) {
                    console.log("Removing IP:", ip)
                    delete this.limitList[ip]
                } else {
                    this.limitList[ip]--
                }
            }
        }, 1000)
    }

    check(ip) {
        if (!this.limitList[ip]) {
            console.log("New IP:", ip)
            this.limitList[ip] = 2
            return false
        }
        return true
    }
}

module.exports = { RateLimiter }