import test from "ava";

import { EsqlateQueueWorker } from "../src/index";
import getEsqlateQueue from "../src/index";

test("success", (assert) => {

    assert.plan(1);

    return new Promise(async (resolve) => {

        // Create a worker. This will be used to process the items in the Queue.
        const queueWorker: EsqlateQueueWorker<number, string> = (n) => {
            return new Promise((workerResolver) => {
                setTimeout(() => {
                    workerResolver("Number: A" + n);
                }, 5);
            });
        };

        const expectedResults = [
            "WAIT",
            "ADD",
            "Number: A1",
            "Number: A2",
            "Number: A3",
        ];
        const results = [];
        let answer = 1;
        let addedOne = false;

        // Create an instance of the Queue
        const esqlateQueue = getEsqlateQueue(queueWorker);

        // Push items onto the Queue... afterwards, otherwise we'd never get to the loop
        setTimeout(
            async () => {
                results.push("ADD");
                esqlateQueue.push(1);
                esqlateQueue.push(2);
            },
            500,
        );

        const queue = esqlateQueue.results();

        results.push("WAIT");

        // Process the Queue Results (which also start the queue processing)
        // NOTE: If not for the resolve(), this will never actually end.
        for await (const s of queue) {
            results.push(s);
            if (!addedOne) {
                addedOne = true;
                esqlateQueue.push(3);
            }
            if (answer++ === 3) {
                assert.deepEqual(results, expectedResults);
                return resolve();
            }
        }

    });

});

test("promise rejection", (assert) => {

    assert.plan(5);

    const queueWorker: EsqlateQueueWorker<number, string> = (n) => {
        return new Promise((resolve, reject) => {
            if (n > 4) { return reject(new Error("Cannot process: B" + n)); }
            setTimeout(() => {
                resolve("Number: B" + n);
            }, 5);
        });
    };

    let i = 0;
    let answer = 1;

    const esqlateQueue = getEsqlateQueue(queueWorker);
    esqlateQueue.push(++i);
    esqlateQueue.push(++i);
    esqlateQueue.push(++i);
    esqlateQueue.push(++i);

    return new Promise(async (resolve) => {
    try {
    for await (const s of esqlateQueue.results()) {
        assert.is(s, "Number: B" + answer++);
        if (i <= 9) {
            esqlateQueue.push(++i);
        }
    }
    } catch (e) {
        assert.is(e.message, "Cannot process: B5");
        resolve();
    }
    });

});

test("parallelism", (assert) => {

    assert.plan(1);

    const queueWorker: EsqlateQueueWorker<number, string> = (n) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve("Number " + n);
            }, 100 * (6 - n));
        });
    };

    let i = 0;

    const expected = [
        "Number 5",
        "Number 4",
        "Number 3",
        "Number 2",
        "Number 1",
    ];

    const result: string[] = [];

    const esqlateQueue = getEsqlateQueue(queueWorker, 5);
    esqlateQueue.push(++i);
    esqlateQueue.push(++i);
    esqlateQueue.push(++i);
    esqlateQueue.push(++i);
    esqlateQueue.push(++i);

    return new Promise(async (resolve) => {
    for await (const s of esqlateQueue.results()) {
        result.push(s);
        if (result.length === 5) {
            assert.deepEqual(result, expected);
            resolve();
        }
    }
    });

});
