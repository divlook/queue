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
npm login --scope=@divlook --registry=https://npm.pkg.github.com
npm install @divlook/queue
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
import Queue from '@divlook/queue'
import { Queue } from '@divlook/queue'
```

#### CommonJs

```ts
const Queue = require('@divlook/queue').default
const { Queue } = require('@divlook/queue')
```

#### Browser

```html
<script src="https://unpkg.com/@divlook/queue/dist/queue.browser.js"></script>
<script>
    var que = new Queue()
</script>
```

## API DOC

https://divlook.github.io/queue
