import { Directive, HostListener, Optional } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[onlyNumbers]',
  standalone: true,
})
export class OnlyNumbersDirective {
  constructor(@Optional() private ngControl: NgControl) {} // 👈 @Optional

  @HostListener('input', ['$event'])
  onInput(event: Event) {
    const input = event.target as HTMLInputElement;
    const clean = input.value.replace(/[^0-9]/g, '');

    if (input.value !== clean) {
      input.value = clean;

      if (this.ngControl?.control) {
        this.ngControl.control.setValue(clean, { emitEvent: false });
      }
    }
  }
}
