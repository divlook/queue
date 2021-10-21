export const QueueErrorKey = Symbol()

export class QueueError extends Error {
    name = 'QueueError'

    check(key: Symbol) {
        return !!key && key === QueueErrorKey
    }
}
