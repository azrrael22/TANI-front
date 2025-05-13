import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { AccountService, AlertService } from '@app/_services';
import { MustMatch } from '@app/_helpers';

enum TokenStatus {
    Validating,
    Valid,
    Invalid
}

@Component({
    selector: 'app-reset-password',
    templateUrl: './reset-password.component.html',
    standalone: false
})
export class ResetPasswordComponent implements OnInit {
    form!: FormGroup;
    submitted = false;
    loading = false;

    token?: string;
    tokenStatus = TokenStatus.Validating;
    TokenStatus = TokenStatus; // para usar el enum en HTML

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private formBuilder: FormBuilder,
        private accountService: AccountService,
        private alertService: AlertService
    ) {}

    ngOnInit(): void {
        this.form = this.formBuilder.group({
            password: ['', [Validators.required, Validators.minLength(6)]],
            confirmPassword: ['', Validators.required]
        }, {
            validator: MustMatch('password', 'confirmPassword')
        });
    
        this.token = this.route.snapshot.queryParams['token'];
        this.tokenStatus = this.token ? TokenStatus.Valid : TokenStatus.Invalid;
    }
    

    get f() {
        return this.form.controls;
    }

    onSubmit(): void {
        this.submitted = true;
        this.alertService.clear();

        if (this.form.invalid || !this.token) return;

        this.loading = true;

        this.accountService.resetPassword(this.token, this.f.password.value)
            .pipe(first())
            .subscribe({
                next: () => {
                    this.alertService.success('Password reset successful, you can now login.', { keepAfterRouteChange: true });
                    this.router.navigate(['/account/login']);
                },
                error: err => {
                    this.alertService.error(err);
                    this.loading = false;
                }
            });
    }
}