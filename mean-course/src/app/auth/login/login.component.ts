import { Component, EventEmitter, AfterViewInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';


@Component({
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent implements AfterViewInit {
    isLoading = false;
    constructor(public authService: AuthService) { }
    public focusSetting = new EventEmitter<boolean>();

    ngAfterViewInit() { // Additional feature for focus
        this.focusSetting.emit(true);
    }

    onLogin(form: NgForm) {
        if (form.invalid) {
            return;
        }
        this.authService.login(form.value.email, form.value.password);
    }


}
