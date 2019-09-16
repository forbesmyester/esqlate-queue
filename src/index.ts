import assert = require("assert");

export interface EsqlateQueue<Q, R> {
    results(): AsyncIterableIterator<R>;
    push(q: Q): void;
}

export type EsqlateQueueWorker<Q, R> = (item: Q) => Promise<R>;

export default function getEsqlateQueue<Q, R>(runner: EsqlateQueueWorker<Q, R>): EsqlateQueue<Q, R> {

    const q: Q[] = [];
    let runningCount = 0;
    let resolver: (value?: any) => void;

    async function* results(): AsyncIterableIterator<R> {
        assert(runningCount++ === 0, "QueryRunner.calledCount can only be called once");
        while (true) {
            if (q.length === 0) {
                await new Promise<null>((resolve) => {
                    resolver = resolve;
                });
            }
            yield await runner(q.shift() as Q);
        }
    }

    function push(item: Q) {
        if (resolver) {
            resolver(null);
        }
        q.push(item);
    }

    return { push, results };
}
