import {ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Input, OnChanges, SimpleChanges} from '@angular/core';
import {MaalfridService} from '../maalfrid-service/maalfrid.service';
import {map} from 'rxjs/operators';

@Component({
  selector: 'app-text',
  templateUrl: './text.component.html',
  styleUrls: ['./text.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TextComponent implements OnChanges {

  @Input()
  text: string;

  displayedColumns = ['code', 'count'];

  hidden = true;

  nominations: any[] = [];

  constructor(private maalfridService: MaalfridService, private elementRef: ElementRef,
              private changeDetectorRef: ChangeDetectorRef) { }

  ngOnChanges(changes: SimpleChanges) {
    if (this.text) {
      this.hidden = false;
      this.elementRef.nativeElement.scrollIntoView();
      this.onIdentifyLanguage(this.text);
    }
    // this.changeDetectorRef.markForCheck();
  }

  onIdentifyLanguage(text) {
    if (text) {
      this.maalfridService.identifyLanguage(text)
        .pipe(
          map((reply) => reply['value'] || []),
          map((values) => values.map((value) => ({code: value.code, count: value.count.toPrecision(4)})))
        )
        .subscribe((nominations) => {
          this.nominations = nominations;
          this.changeDetectorRef.markForCheck();
        });
    }
  }

  onClear() {
    this.hidden = true;
  }
}
