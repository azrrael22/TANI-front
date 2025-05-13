import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { AccountService } from '@app/_services';
import { Account } from '@app/_models';

@Component({
    selector: 'app-profile',
    templateUrl: './details.component.html',
    styleUrls: ['./details.component.css'],
    standalone: false
  })
export class DetailsComponent implements OnInit {
  account: Account | null = null;
  form!: FormGroup;
  loading = false;
  submitted = false;
  success = false;
  error = '';

  constructor(
    private formBuilder: FormBuilder,
    private accountService: AccountService
  ) { }

  ngOnInit() {
    this.loadUserData();
    this.initForm();
  }

  private loadUserData() {
    this.account = this.accountService.accountValue;

    // Si no hay datos en el BehaviorSubject, intentamos obtenerlos del servidor
    if (!this.account && this.accountService.accountValue?.id) {
      this.accountService.getById(this.accountService.accountValue.id)
        .pipe(first())
        .subscribe(account => {
          this.account = account;
          this.updateForm();
        });
    }
  }

  private initForm() {
    this.form = this.formBuilder.group({
      nombre: ['', Validators.required],
      fechaNacimiento: ['', Validators.required],
      telefono: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      correo: ['', [Validators.required, Validators.email]],
    });

    this.updateForm();
  }

  private updateForm() {
    if (this.account) {
      this.form.patchValue({
        nombre: this.account.nombre,
        fechaNacimiento: this.formatDate(this.account.fechaNacimiento),
        telefono: this.account.telefono,
        correo: this.account.correo
      });
    }
  }

  // Formatea la fecha para el input type="date"
  private formatDate(date: string | Date | undefined): string {
    if (!date) return '';

    const d = new Date(date);
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    const year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
  }

  // Getter para acceder fácilmente a los campos del formulario
  get f() { return this.form.controls; }

  onSubmit() {
    this.submitted = true;
    this.success = false;
    this.error = '';

    // Detener si el formulario es inválido
    if (this.form.invalid) {
      return;
    }

    this.loading = true;

    // Solo actualizar si tenemos un ID de usuario
    if (this.account && this.account.id) {
      const updatedAccount = {
        ...this.form.value,
        tipoUsuario: this.account.tipoUsuario // Mantener el tipo de usuario
      };

      this.accountService.update(this.account.id, updatedAccount)
        .pipe(first())
        .subscribe({
          next: (account) => {
            this.success = true;
            this.loading = false;
            // Actualizar los datos locales
            this.account = account;
          },
          error: error => {
            this.error = error;
            this.loading = false;
          }
        });
    } else {
      this.error = 'No se pudo identificar al usuario';
      this.loading = false;
    }
  }
}
