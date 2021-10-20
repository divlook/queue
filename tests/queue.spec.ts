import { Queue } from '@/queue'

describe('Queue', () => {
    it('create', () => {
        expect(() => {
            new Queue()
        }).not.toThrow()
    })

    it('defined', () => {
        const que = new Queue()

        expect(que).toBeDefined()
    })

    it('insert', async () => {
        const que = new Queue()
        const cb = jest.fn()

        expect(cb).not.toBeCalled()

        await que.next(cb)
        await que.next(cb)
        await que.next(cb)
        await que.next(cb)

        expect(cb).toBeCalled()

        expect(cb).toHaveBeenCalledTimes(4)
    })

    describe('subscribe', () => {
        it('success', (done) => {
            const que = new Queue()
            const cb = jest.fn()

            que.next(cb)

            que.subscribe((event) => {
                expect(cb).toBeCalled()
                expect(event.type).toBe('success')
                done()
            })
        })

        it('error', (done) => {
            const que = new Queue()
            const cb = () => new Error('TEST')

            que.next(cb)

            que.subscribe((event) => {
                expect(event.type).toBe('error')
                expect(event).toHaveProperty('error')
                done()
            })
        })
    })
})
