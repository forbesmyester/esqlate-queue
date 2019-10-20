export interface EsqlateQueue<Q, R> {
    results(): AsyncIterableIterator<R>;
    push(q: Q): void;
}
export declare type EsqlateQueueWorker<Q, R> = (item: Q) => Promise<R>;
export default function getEsqlateQueue<Q, R>(runner: EsqlateQueueWorker<Q, R>, parallelism?: number): EsqlateQueue<Q, R>;
