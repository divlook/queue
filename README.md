# README

[![CI](https://github.com/divlook/queue/actions/workflows/ci.yml/badge.svg)](https://github.com/divlook/queue/actions/workflows/ci.yml)
[![CD](https://github.com/divlook/queue/actions/workflows/cd.yml/badge.svg)](https://github.com/divlook/queue/actions/workflows/cd.yml)
[![](https://img.shields.io/github/v/release/divlook/queue)](https://github.com/divlook/queue/releases)

## Install

### npm

https://www.npmjs.com/package/@divlook/queue

```bash
npm install @divlook/queue
```

### gpr

```bash
npm install @divlook/queue --registry=https://npm.pkg.github.com
```

## Usage

### Example

```ts
const delay = (ms) => new Promise((r) => setTimeout(() => r(), ms))
const que = new Queue()

que.next(() => {
    console.log(1)
    return delay(300)
})
que.next(() => {
    console.log(2)
    return delay(300)
})
que.next(() => {
    console.log(3)
    return delay(300)
})
```

### Import

#### Module

```ts
import { Queue } from '@divlook/queue'
```

#### CommonJs

```ts
const { Queue } = require('@divlook/queue')
```

#### Browser

```html
<script src="https://unpkg.com/@divlook/queue/dist/queue.js"></script>
<script>
    var que = new Queue()
</script>
```

### Error handling

```ts
const que = new Queue()

que.addListener('error', (response) => {
    if (response.error) {
        if (Queue.isDefinedError(response.error)) {
            /*
            {
                name: 'QueueError',
                message:
                    | 'Required parameter is missing `typeOrKey`'
                    | 'Listener limit is 1000'
            }
            */
        }

        console.error(response.error)
    }

    // If you want to continue
    que.next()

    // If you want to cancel the remaining tasks
    que.clearQueue()
})
```

## API DOC

### Exports

-   [Queue](https://divlook.github.io/queue/classes/Queue.html)
-   [QueueResponseTypeKeys](https://divlook.github.io/queue/enums/QueueResponseTypeKeys.html)

### Properties

-   [isRunning](https://divlook.github.io/queue/classes/Queue.html#isRunning)
-   [size](https://divlook.github.io/queue/classes/Queue.html#size)

### Methods

-   [next](https://divlook.github.io/queue/classes/Queue.html#next)
-   [addListener](https://divlook.github.io/queue/classes/Queue.html#addListener)
-   [removeAllListener](https://divlook.github.io/queue/classes/Queue.html#removeAllListener)
-   [clearQueue](https://divlook.github.io/queue/classes/Queue.html#clearQueue)
-   static [isDefinedError](https://divlook.github.io/queue/classes/Queue.html#isDefinedError)
-   static [toType](https://divlook.github.io/queue/classes/Queue.html#toType)
