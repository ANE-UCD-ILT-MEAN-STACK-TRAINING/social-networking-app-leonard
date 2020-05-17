import { Component, AfterViewInit, EventEmitter } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';


@Component({
    templateUrl: './signup.component.html',
    styleUrls: ['./signup.component.css']
})
export class SignupComponent implements AfterViewInit {
    isLoading = false;
    constructor(public authService: AuthService) { }
    public focusSignup = new EventEmitter<boolean>();
    // Additional feature for focus
    ngAfterViewInit() {
        this.focusSignup.emit(true);
    }

    onSignup(form: NgForm) {
        if (form.invalid) {
            return;
        }
        this.authService.createUser(form.value.email, form.value.password);
    }
}
