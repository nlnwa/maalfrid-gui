import {Injectable, OnDestroy} from '@angular/core';
import {Observable, Observer, of} from 'rxjs';
import {AggregateText} from '../../shared/';

@Injectable()
export class WorkerService implements OnDestroy {

  private readonly pool: Worker[];

  private static createWorker(): Worker {
    return new Worker('assets/worker.js');
  }

  constructor() {
    this.pool = [WorkerService.createWorker()];
  }

  transform(data: AggregateText[]): Observable<any> {
    if (data.length === 0) {
      return of([]);
    }
    const worker = this.getWorker();
    return new Observable((observer: Observer<any>) => {
      worker.onmessage = function onmessage(e: MessageEvent) {
        observer.next(e.data);
        observer.complete();
      };
      worker.onerror = function onerror() {
        observer.error(new Error('worker error'));
        observer.complete();
      };
      worker.postMessage(data);
    });
  }

  ngOnDestroy() {
    this.pool.forEach((worker) => worker.terminate());
  }

  private getWorker(): Worker {
    return this.pool[0];
  }

}
