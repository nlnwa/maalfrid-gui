import * as noUiSlider from 'nouislider';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  forwardRef,
  HostBinding,
  Input,
  NgModule,
  OnChanges,
  OnInit,
  Output,
  Renderer2
} from '@angular/core';
import {ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR} from '@angular/forms';

export interface NouiFormatter {
  to(value: number): string;

  from(value: string): number;
}

export class DefaultFormatter implements NouiFormatter {
  to(value: number): string {
    // formatting with http://stackoverflow.com/a/26463364/478584
    return String(parseFloat(parseFloat(String(value)).toFixed(2)));
  }

  from(value: string): number {
    return parseFloat(value);
  }
}

@Component({
  selector: 'app-nouislider',
  template: '<div [attr.disabled]="disabled ? true : undefined"></div>',
  styles: [`
    :host {
      display: block;
      margin-top: 1rem;
      margin-bottom: 1rem;
    }
  `],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NouisliderComponent),
      multi: true
    }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NouisliderComponent implements ControlValueAccessor, OnInit, OnChanges {

  public slider: any;
  public handles: any[];
  @Input() public disabled: boolean;
  @Input() public behaviour: string;
  @Input() public connect: boolean[];
  @Input() public limit: number;
  @Input() public min: number;
  @Input() public max: number;
  @Input() public snap: boolean;
  @Input() public animate: boolean | boolean[];
  @Input() public range: { [key: string]: number | number[] };
  @Input() public step: number;
  @Input() public format: NouiFormatter;
  @Input() public pageSteps: number;
  @Input() public config: any = {};
  @Input() public ngModel: number | number[];
  @Input() public keyboard: boolean;
  @Input() public onKeydown: any;
  @Input() public formControl: FormControl;
  @Input() public tooltips: Array<any>;
  @Output() public change: EventEmitter<any> = new EventEmitter(true);
  @Output() public update: EventEmitter<any> = new EventEmitter(true);
  @Output() public slide: EventEmitter<any> = new EventEmitter(true);
  @Output() public set: EventEmitter<any> = new EventEmitter(true);
  @Output() public start: EventEmitter<any> = new EventEmitter(true);
  @Output() public end: EventEmitter<any> = new EventEmitter(true);
  private value: any;
  private onChange: any = Function.prototype;
  private onTouched: any = Function.prototype;

  @HostBinding('class.ng2-nouislider') hasClassNg2Nouislider = true;

  constructor(private el: ElementRef, private renderer: Renderer2, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    const inputsConfig = {
      behaviour: this.behaviour,
      connect: this.connect,
      limit: this.limit,
      start: this.formControl !== undefined ? this.formControl.value : this.ngModel,
      step: this.step,
      pageSteps: this.pageSteps,
      keyboard: this.keyboard,
      onKeydown: this.onKeydown,
      range: this.range || this.config.range || {min: this.min, max: this.max},
      tooltips: this.tooltips || this.config.tooltips,
      snap: this.snap,
      animate: this.animate,
      format: this.format || this.config.format || new DefaultFormatter()
    };
    const options: noUiSlider.Options = Object.assign(this.config, inputsConfig);

    this.slider = noUiSlider.create(
      this.el.nativeElement,
      options
    );

    this.handles = [].slice.call(this.el.nativeElement.querySelectorAll('.noUi-handle'));

    if (this.config.keyboard) {
      if (this.config.pageSteps === undefined) {
        this.config.pageSteps = 10;
      }
      for (const handle of this.handles) {
        handle.setAttribute('tabindex', 0);
        handle.addEventListener('click', () => {
          handle.focus();
        });
        if (this.config.onKeydown === undefined) {
          handle.addEventListener('keydown', this.defaultKeyHandler);
        } else {
          handle.addEventListener('keydown', this.config.onKeydown);
        }
      }
    }

    this.slider.on('set', (values: string[], handle: number, unencoded: number[]) => {
      this.eventHandler(this.set, values, handle, unencoded);
    });

    this.slider.on('update', (values: string[], handle: number, unencoded: number[]) => {
      this.update.emit(this.toValues(values));
    });

    this.slider.on('change', (values: string[], handle: number, unencoded: number[]) => {
      this.change.emit(this.toValues(values));
    });

    this.slider.on('slide', (values: string[], handle: number, unencoded: number[]) => {
      this.eventHandler(this.slide, values, handle, unencoded);
    });

    this.slider.on('start', (values: string[], handle: number, unencoded: number[]) => {
      this.start.emit(this.toValues(values));
    });

    this.slider.on('end', (values: string[], handle: number, unencoded: number[]) => {
      this.end.emit(this.toValues(values));
    });
  }

  ngOnChanges(changes: any) {
    if (this.slider) {
      const newOptions: noUiSlider.Options | any = {};
      if (changes.range) {
        newOptions.range = this.range;
      } else if (changes.min && changes.max) {
        newOptions.range = {
          max: this.max,
          min: this.min,
        };
      }
      if (changes.step) {
        newOptions.step = this.step;
      }
      if (changes.ngModel) {
        newOptions.start = this.ngModel;
      }
      if (Object.keys(newOptions).length) {
        this.slider.updateOptions(newOptions);
      }
    }
  }

  toValues(values: string[]): any | any[] {
    const v = values.map(this.config.format.from);
    return (v.length === 1 ? v[0] : v);
  }

  writeValue(value: any): void {
    if (this.slider) {
      this.slider.set(value);
    }
  }

  registerOnChange(fn: (value: any) => void) {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => {}): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    isDisabled
      ? this.renderer.setAttribute(this.el.nativeElement.childNodes[0], 'disabled', 'true')
      : this.renderer.removeAttribute(this.el.nativeElement.childNodes[0], 'disabled');
  }

  private eventHandler = (emitter: EventEmitter<any>, values: string[], handle: number, unencoded: number[]) => {
    const v = this.toValues(values);
    let emitEvents = false;
    if (this.value === undefined) {
      this.value = v;
      return;
    }
    if (Array.isArray(v) && this.value[handle] !== v[handle]) {
      emitEvents = true;
    }
    if (!Array.isArray(v) && this.value !== v) {
      emitEvents = true;
    }
    if (emitEvents) {
      emitter.emit(v);
      this.onChange(v);
    }
    if (Array.isArray(v)) {
      this.value[handle] = v[handle];
    } else {
      this.value = v;
    }
  }

  private defaultKeyHandler = (e: KeyboardEvent) => {
    const stepSize: any[] = this.slider.steps();
    const index = parseInt((<HTMLElement>e.target).getAttribute('data-handle'), 10);
    let sign = 1;
    let multiplier = 1;
    let step = 0;

    switch (e.key) {
      case 'PageDown':
        multiplier = this.config.pageSteps;
      /* falls through */
      case 'ArrowDown':
      /* falls through */
      case 'ArrowLeft':
        sign = -1;
        step = stepSize[index][0];
        e.preventDefault();
        break;
      case 'PageUp':
        multiplier = this.config.pageSteps;
      /* falls through */
      case 'ArrowUp':
      /* falls through */
      case 'ArrowRight':
        step = stepSize[index][1];
        e.preventDefault();
        break;

      default:
        break;
    }

    const delta = sign * multiplier * step;
    let newValue: number | number[];

    if (Array.isArray(this.value)) {
      newValue = [].concat(this.value);
      newValue[index] = newValue[index] + delta;
    } else {
      newValue = this.value + delta;
    }

    this.slider.set(newValue);
  }
}

@NgModule({
  imports: [],
  exports: [NouisliderComponent],
  declarations: [NouisliderComponent],
})
export class NouisliderModule {}
