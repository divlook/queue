interface QueueEvent {
    type: 'success' | 'run' | 'error'
    error?: Error
}

interface QueueEventListener {
    (event: QueueEvent): void
}

export class Queue {
    #isRunning = false

    #que: Function[] = []

    #listeners: Set<QueueEventListener> = new Set()

    get isRunning() {
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

            try {
                this.emit({ type: 'run' })

                await current?.()

                this.emit({ type: 'success' })
            } catch (reason) {
                this.emit({
                    type: 'error',
                    error: reason as Error,
                })
            }

            this.#isRunning = false

            if (this.size) {
                await this.next()
            }
        }
    }

    subscribe(listener: QueueEventListener) {
        if (this.#listeners.size >= 1000) {
            return
        }

        this.#listeners.add(listener)

        return {
            unsubscribe: () => {
                this.#listeners.delete(listener)
            },
        }
    }

    unsubscribeAll() {
        this.#listeners.clear()
    }

    private emit(event: QueueEvent) {
        this.#listeners.forEach((listener) => {
            listener?.(event)
        })
    }
}

export default Queue
