import { Directive, Input, EventEmitter, ElementRef, Inject } from '@angular/core';

@Directive({
    selector: '[focus]'
})
export class FocusDirective {
    @Input('focus') focusEvent: EventEmitter<boolean>;

    constructor(@Inject(ElementRef) private element: ElementRef) {
    }

    ngOnInit() {
        this.element.nativeElement.focus();
    }
}