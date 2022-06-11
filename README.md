# mul-promise

simple package allow run promises in mul-flow fashion

[https://tachibana-shin.github.io/mul-promise](https://tachibana-shin.github.io/mul-promise)

[![Build](https://github.com/tachibana-shin/mul-promise/actions/workflows/build-docs.yml/badge.svg)](https://github.com/tachibana-shin/mul-promise/actions/workflows/docs.yml)
[![NPM](https://badge.fury.io/js/mul-promise.svg)](http://badge.fury.io/js/mul-promise)
[![Size](https://img.shields.io/bundlephobia/minzip/mul-promise/latest)](https://npmjs.org/package/mul-promise)
[![Languages](https://img.shields.io/github/languages/top/tachibana-shin/mul-promise)](https://npmjs.org/package/mul-promise)
[![License](https://img.shields.io/npm/l/mul-promise)](https://npmjs.org/package/mul-promise)
[![Star](https://img.shields.io/github/stars/tachibana-shin/mul-promise)](https://github.com/tachibana-shin/mul-promise/stargazers)
[![Download](https://img.shields.io/npm/dm/mul-promise)](https://npmjs.org/package/mul-promise)

## Installation

NPM / Yarn / Pnpm

```bash
pnpm add mul-promise
```

CDN:

```html
<script src="https://unpkg.com/"></script>
```

## Usage

```ts
import multiPromise from "mul-promise"


// eslint-disable-next-line no-redeclare
function multiPromise<DataTasks extends unknown[], ResultTask = unknown>(
  dataForTasks: DataTasks, // data for create tasks
  createTask: <Index extends number>(
    data: DataTasks[Index],
    index: Index
  ) => Promise<ResultTask>, // function create task
  concurrent = 5, // count task concurrent run
  onTaskDone?: (resultTask: ResultTask, index: number) => Promise<ResultTask>, // on one task done
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onTaskError?: (error: any, index: number) => Promise<ResultTask>, // on one task error
  skipError?: boolean // no stop tasks on error
): Promise<(ResultTask | null)[]>
```

## Example

```ts
import multiPromise from "mul-promise"

await multiPromise(
  ["Hello World", "Koniichiwa", "Ohayo", "Yahalo", "Kobanwa"],
  (message) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(message)
      }, 1000)
    })
  }
)
```
