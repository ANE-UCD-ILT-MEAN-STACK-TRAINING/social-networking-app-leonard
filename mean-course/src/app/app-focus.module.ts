import { Directive, Input, EventEmitter, ElementRef, Inject, OnInit } from '@angular/core';

@Directive({
    selector: '[focus]'
})
export class FocusDirective implements OnInit {
    @Input('focus') focusEvent: EventEmitter<boolean>;

    constructor(@Inject(ElementRef) private element: ElementRef) {
    }

    ngOnInit() {
        this.element.nativeElement.focus();
    }
}
