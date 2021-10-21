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
        const task = jest.fn()

        expect(task).not.toBeCalled()

        await que.next(task)
        await que.next(task)
        await que.next(task)
        await que.next(task)

        expect(task).toBeCalled()

        expect(task).toHaveBeenCalledTimes(4)
    })

    describe('listener', () => {
        jest.setTimeout(500)

        it('default flow', (done) => {
            const que = new Queue()
            const task = jest.fn()

            que.addListener('start', () => {
                expect(que.size).toBe(0)
            })

            que.addListener('run', () => {
                expect(task).not.toBeCalled()
            })

            que.addListener('success', () => {
                expect(task).toBeCalled()
            })

            que.addListener('done', () => {
                expect(que.size).toBe(0)

                que.next(() => {
                    throw new Error('TEST')
                })
            })

            que.addListener('error', (response) => {
                expect(response).toHaveProperty('error')
                done()
            })

            que.next(task)
        })

        describe('error', () => {
            it('unknown error', (done) => {
                const que = new Queue()

                que.addListener('error', (response) => {
                    expect(Queue.isDefinedError(response.error)).toBe(false)
                    done()
                })

                que.next(() => {
                    throw new Error('TEST')
                })
            })

            describe('defined error', () => {
                it('Queue.toType(typeOrKey)', (done) => {
                    const que = new Queue()

                    que.addListener('error', (response) => {
                        expect(Queue.isDefinedError(response.error)).toBe(true)
                        done()
                    })

                    que.next(() => {
                        // @ts-ignore
                        Queue.toType()
                    })
                })

                it('.addListener', (done) => {
                    const que = new Queue()

                    try {
                        Array(1001)
                            .fill(null)
                            .forEach(() => {
                                que.addListener('run', () => {})
                            })
                        done('이 메시지가 보이면 안됨')
                    } catch (error) {
                        expect(Queue.isDefinedError(error)).toBe(true)
                        done()
                    }
                })
            })
        })
    })
})
