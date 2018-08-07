import {Injectable, OnDestroy} from '@angular/core';
import {Observable, Observer} from 'rxjs';
import {AggregateText} from '../../shared/models/maalfrid.model';

@Injectable()
export class WorkerService implements OnDestroy {

  private pool: Worker[];

  constructor() {
    this.pool = Array(1).fill(null).map(this.createWorker);
  }

  transform(data): Observable<AggregateText[]> {
    const worker = this.getWorker();
    const workerObservable = Observable.create(function (observer: Observer<any>) {
      worker.onmessage = function onmessage(e: MessageEvent) {
        observer.next(e.data);
        observer.complete();
      };
      worker.onerror = function onerror() {
        observer.error(new Error('worker error'));
        observer.complete();
      };
    });
    worker.postMessage(data);
    return workerObservable;
  }

  ngOnDestroy() {
    this.pool.forEach((worker) => worker.terminate());
  }

  private getWorker(): Worker {
    return this.pool[0];
  }

  private createWorker(): Worker {
    return new Worker('assets/worker.js');
  }
}
