import {ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Input, OnChanges, SimpleChanges} from '@angular/core';
import {map} from 'rxjs/operators';
import {MaalfridService} from '../../../core/services';

@Component({
  selector: 'app-text',
  templateUrl: './text.component.html',
  styleUrls: ['./text.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TextComponent implements OnChanges {

  @Input()
  text: string;

  displayedColumns = ['code', 'count'];

  visible = false;

  nominations: any[] = [];

  constructor(private maalfridService: MaalfridService, private elementRef: ElementRef,
              private changeDetectorRef: ChangeDetectorRef) { }


  get visibilityIcon() {
    return this.visible ? 'expand_less' : 'expand_more';
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.text) {
      if (!this.visible) {
        this.onToggleVisibility();
      }
      setTimeout(() => this.elementRef.nativeElement.scrollIntoView(), 250);
      this.onIdentifyLanguage(this.text);
    }
  }

  onIdentifyLanguage(text) {
    if (text) {
      this.maalfridService.identifyLanguage(text)
        .pipe(
          map((reply) => reply.value || []),
          map((values) => values.map((value) => ({code: value.code, count: value.count.toPrecision(4)})))
        )
        .subscribe((nominations) => {
          this.nominations = nominations;
          this.changeDetectorRef.markForCheck();
        });
    }
  }

  onToggleVisibility() {
    this.visible = !this.visible;
  }
}
