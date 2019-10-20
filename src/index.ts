import assert = require("assert");
import { queue } from "async";

export interface EsqlateQueue<Q, R> {
    results(): AsyncIterableIterator<R>;
    push(q: Q): void;
}

export type EsqlateQueueWorker<Q, R> = (item: Q) => Promise<R>;

export default function getEsqlateQueue<Q, R>(
    runner: EsqlateQueueWorker<Q, R>,
    parallelism: number = 1,
): EsqlateQueue<Q, R> {

    interface QK { r: R; t: number; }

    const complete: Set<QK> = new Set();
    const errors: Error[] = [];

    function worker(task: Q, cb: (e?: Error) => void) {

        const t = new Date().getTime();

        runner(task)
            .then((r: R) => {
                complete.add({ r, t });
                if (emptyQueueBlocker) {
                    emptyQueueBlocker(null);
                }
                cb();
            })
            .catch((e: Error) => {
                errors.push(e);
                if (emptyQueueBlocker) {
                    emptyQueueBlocker(null);
                }
            });

    }

    const aq = queue(worker, parallelism);

    let runningCount = 0;
    let emptyQueueBlocker: (value?: any) => void;

    async function* results(): AsyncIterableIterator<R> {

        assert(runningCount++ === 0, "QueryRunner.calledCount can only be called once");

        while (true) {
            while (errors.length) {
                throw errors.shift();
            }
            if (complete.size === 0) {
                await new Promise<null>((resolve) => {
                    emptyQueueBlocker = resolve;
                });
            }
            for (const c of complete) {
                complete.delete(c);
                yield c.r;
            }
        }

    }

    function push(item: Q) {
        aq.push(item);
    }

    return { push, results };
}
