import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { trigger, transition, style, animate } from '@angular/animations';


import { AccountService, AlertService } from '@app/_services';
import { MustMatch } from '@app/_helpers';
import { Account } from '@app/_models';

@Component({
    templateUrl: 'register.component.html',
    standalone: false,
    styleUrls: ['register.component.css'],
    
    //standalone: false
})
export class RegisterComponent implements OnInit {
    form!: FormGroup;
    submitting = false;
    submitted = false;

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private accountService: AccountService,
        private alertService: AlertService
    ) { }

    ngOnInit() {
        this.form = this.formBuilder.group({
            nombreCompleto: ['', Validators.required],
            fechaNacimiento: ['', Validators.required], 
            email: ['', [Validators.required, Validators.email]],
            telefono: ['', [Validators.required, Validators.pattern('^[0-9]{10,15}$')]],
            contrasenia: ['', [Validators.required, Validators.minLength(6)]],  // Cambiar de password a contrasenia
            confirmPassword: ['', Validators.required],
            acceptTerms: [false, Validators.requiredTrue]  // Nuevo campo obligatorio
        }, {
            validator: MustMatch('contrasenia', 'confirmPassword')  // Cambiar de password a contrasenia
        });
    }

    // Getter para acceder fácilmente a los campos del formulario
    get f() { return this.form.controls; }

    onSubmit() {
        this.submitted = true;
        this.alertService.clear();
    
        if (this.form.invalid) {
            return;  // No se envía si hay errores
        }
    
        this.submitting = true;
    
        // Crear objeto con los nombres de atributos correctos para el backend
        const account: Account = {
            nombre: this.form.value.nombreCompleto,
            fechaNacimiento: this.form.value.fechaNacimiento,
            telefono: this.form.value.telefono,
            correo: this.form.value.email,
            contrasenia: this.form.value.contrasenia,  // Cambiar de password a contrasenia
            tipoUsuario: 'USUARIO'  // Tipo de usuario siempre 'USUARIO'
        };
    
        this.accountService.register(account)
            .pipe(first())
            .subscribe({
                next: () => {
                    this.alertService.success('Registro exitoso. Verifica tu correo.', { keepAfterRouteChange: true });
                    this.router.navigate(['/crear-cuenta'], { relativeTo: this.route });
                },
                error: error => {
                    this.alertService.error(error);
                    this.submitting = false;
                }
            });
    }
}