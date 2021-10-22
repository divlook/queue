import { QueueError, QueueErrorKey } from '@/error'

export enum QueueResponseTypeKeys {
    start,
    run,
    success,
    done,
    error,
}

export type QueueResponseType = keyof typeof QueueResponseTypeKeys

export type TypeOrKey = QueueResponseType | QueueResponseTypeKeys

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

    /**
     * 작업 실행 여부
     * - default : false
     */
    get isRunning() {
        return this.#isRunning
    }

    /**
     * 대기 중인 작업 수
     * - default : 0
     */
    get size() {
        return this.#que.length
    }

    /**
     * 파라미터 `task`가 있으면 대기열에 추가하고, 대기열에서 가장 앞에 있는 `task`를 꺼낸 뒤 실행합니다.
     */
    async next(task?: Function) {
        if (!this.size) {
            this.emit(QueueResponseTypeKeys.start)
        }

        if (typeof task === 'function') {
            this.#que.push(task)
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
