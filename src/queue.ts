export class Queue {
    #isRunning = false

    #que: Function[] = []

    get isRunnin() {
        return this.#isRunning
    }

    get size() {
        return this.#que.length
    }

    async next(cb?: Function) {
        if (typeof cb === 'function') {
            this.#que.push(cb)
        }

        if (!this.#isRunning) {
            const current = this.#que.shift()

            this.#isRunning = true

            await current?.()

            this.#isRunning = false

            if (this.size) {
                await this.next()
            }
        }
    }
}

export default Queue
