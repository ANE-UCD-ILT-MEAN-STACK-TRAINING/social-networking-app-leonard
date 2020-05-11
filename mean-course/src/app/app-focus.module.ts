import { Directive, Input, EventEmitter, ElementRef, Inject, Renderer2 } from '@angular/core';

@Directive({
    selector: '[focus]'
})
export class FocusDirective {
    @Input('focus') focusEvent: EventEmitter<boolean>;

    constructor(@Inject(ElementRef) private element: ElementRef, private renderer: Renderer2) {
    }

    ngOnInit() {
        this.element.nativeElement.focus();
    }
}