import { Component, OnInit, OnDestroy, EventEmitter, AfterViewInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Subscription } from 'rxjs';


@Component({
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent implements AfterViewInit, OnInit, OnDestroy {
    isLoading = false;
    private authStatusSub: Subscription;
    public focusLogin = new EventEmitter<boolean>();

    constructor(public authService: AuthService) { }

    ngAfterViewInit() {
        this.focusLogin.emit(true);
    }

    ngOnInit() {
        this.authStatusSub = this.authService.getAuthStatusListener().subscribe(
            authStatus => {
                this.isLoading = false;
            }
        );
    }

    ngOnDestroy() {
        this.authStatusSub.unsubscribe();
    }


    onLogin(form: NgForm) {
        if (form.invalid) {
            return;
        }
        this.authService.login(form.value.email, form.value.password);
    }


}
