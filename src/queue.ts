import { QueueError, QueueErrorKey } from '@/error'

export enum QueueResponseTypeKeys {
    start,
    run,
    success,
    done,
    error,
}

export type QueueResponseType = keyof typeof QueueResponseTypeKeys

type TypeOrKey = QueueResponseType | QueueResponseTypeKeys

export interface QueueResponse {
    error?: QueueError | Error
}

export interface QueueListener {
    (response: QueueResponse): void
}

export class Queue {
    static toType(typeOrKey: TypeOrKey) {
        const isMissingParameter = (typeOrKey ?? null) === null

        let type: QueueResponseType

        if (isMissingParameter) {
            throw new QueueError('Required parameter is missing `typeOrKey`')
        }

        if (typeof typeOrKey === 'string') {
            type = typeOrKey
        } else {
            type = QueueResponseTypeKeys[typeOrKey] as QueueResponseType
        }

        return type
    }

    static isDefinedError(error: any) {
        return error?.check?.(QueueErrorKey) ?? false
    }

    #isRunning = false

    #que: Function[] = []

    #listeners: Map<QueueResponseType, Set<QueueListener>> = new Map()

    get isRunning() {
        return this.#isRunning
    }

    get size() {
        return this.#que.length
    }

    async next(cb?: Function) {
        if (!this.size) {
            this.emit(QueueResponseTypeKeys.start)
        }

        if (typeof cb === 'function') {
            this.#que.push(cb)
        }

        if (!this.#isRunning) {
            const current = this.#que.shift()

            this.#isRunning = true

            try {
                this.emit(QueueResponseTypeKeys.run)

                await current?.()

                this.#isRunning = false

                this.emit(QueueResponseTypeKeys.success)

                if (this.size) {
                    await this.next()
                    return
                }

                this.emit(QueueResponseTypeKeys.done)
            } catch (reason) {
                this.#isRunning = false

                this.emit(QueueResponseTypeKeys.error, {
                    error: reason as Error,
                })
            }
        }
    }

    addListener(typeOrKey: TypeOrKey, listener: QueueListener) {
        const type = Queue.toType(typeOrKey)
        const listeners = this.#listeners.get(type) ?? new Set()

        if (listeners.size >= 1000) {
            throw new QueueError('Listener limit is 1000')
        }

        listeners.add(listener)

        this.#listeners.set(type, listeners)

        return {
            remove: () => {
                listeners.delete(listener)
            },
        }
    }

    removeAllListener(typeOrKey?: TypeOrKey) {
        const type = typeOrKey ? Queue.toType(typeOrKey) : undefined

        if (type) {
            const listeners = this.#listeners.get(type) ?? new Set()

            listeners.clear()

            return
        }

        this.#listeners.clear()
    }

    private emit(typeOrKey: TypeOrKey, res: QueueResponse = {}) {
        const type = Queue.toType(typeOrKey)
        const listeners = this.#listeners.get(type) ?? new Set()

        listeners.forEach((listener) => {
            listener?.(res)
        })
    }

    retry() {
        this.next()
    }

    clear() {
        this.#que = []
    }
}

export default Queue
