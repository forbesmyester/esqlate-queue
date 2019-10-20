# EsqlateQueue - Push to a AsyncIterableIterator

## Why

Sometimes you want to process something, but you're not interested in the result immediately because the task is not a priority to you, or maybe even the user.

For this you may well use a Queue of some variety, something like [RabbitMQ](https://www.rabbitmq.com/), [Amazon AWS's SQS](https://aws.amazon.com/sqs/) or maybe even [ZeroMQ](https://zeromq.org/).

These are all fantastic technologies but:

 * The first two require infrastructure (so perhaps not great for an OSS project you want people to use).
 * The latter, you just get a message out, which is untyped and is perhaps overly complicated / higher barrier to entry for some use cases.

However if your task is mainly just running a few [PostgreSQL](https://www.postgresql.org/) queries:

 * Your CPU requirements for the process are probably small (you're doing mostly IO) and PostgreSQL is taking the load.
 * You can't simply scale to many nodes without complications such as [pgBouncer](https://pgbouncer.github.io/) or similar because of how PostgreSQL handles connections (memory).
 * You want to keep it super simple as you know the demand for the service will be small.
 
If these are your requirements and you're using TypeScript, you may want a typed solution for a really simple queue this may be the answer.

## What it does

This allows you to use one simple worker function (`EsqlateQueueWorker<Q, R> = (item: Q) => Promise<R>`) which has a parameter of a queue item, and transforms it into the item you want as the finished product and the end of the queue.

Passing this `EsqlateQueueWorker` to the `getEsqlateQueue()` function will return an object with two methods, these are:

 * `push()` which you use to add things for processing.
 * `results()`, which will when called, return an `AsyncIterableIterator` which you can use a `for-of` to get the results.

UPDATE: This now performs `n` jobs in parallel by wrapping the excellent the excellent [async](https://caolan.github.io/async/v3/) library!

## Example

```typescript
import { EsqlateQueueWorker as QueueWorker } from '../src/index';
import getQueue from '../src/index';


// Create a worker. This will be used to process the items in the Queue.
const worker: QueueWorker<number,string> = (n) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve("Number: A" + n);
        }, 5);
    });
};

// Create an instance of the Queue
const esqlateQueue = getQueue(worker, 2); // UPDATE: Can do two things at once!

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
for await (const s of esqlateQueue.results()) {
    assert(s == "Number: A" + (n++));
}

```

## Installation

To install, use NPM:

    npm install esqlate-queue

## Versions

 * 1.0.0 - Initial Release
 * 2.0.0 - Supports parallelism

## License

The code is licensed under MIT.
