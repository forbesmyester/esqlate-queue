# EsqlateQueue - Push to a AsyncIterableIterator

Simple TypeScript based Queue for work to be processed using a user supplied worker.

Currently it does not support any form of parallelism, but is well typed and has
zero dependencies.

```typescript
import { EsqlateQueueWorker } from '../src/index';
import getEsqlateQueue from '../src/index';


// Create a worker. This will be used to process the items in the Queue.
const queueWorker: EsqlateQueueWorker<number,string> = (n) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve("Number: A" + n);
        }, 5);
    });
};

// Create an instance of the Queue
const esqlateQueue = getEsqlateQueue(queueWorker);

// Push items onto the Queue... afterwards, otherwise we'd never get to the loop
setTimeout(
    async () => {
        results.push("ADD");
        esqlateQueue.push(1);
        esqlateQueue.push(2);
    },
    500
);

let n = 1;

// Process the Queue Results (which also start the queue processing)
// NOTE: If not for the resolve(), this will never actually end.
for await (const s of esqlateQueue.results()) {
    assert(s == "Number: A" + (n++));
}

```

## Installation

To install, use NPM:

    npm install esqlate-queue

## License

The code is licensed under MIT.
