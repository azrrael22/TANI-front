import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ProductService } from '@app/_services/product.service';

@Component({
    templateUrl: 'product-create.component.html',
    selector: 'app-product-create',
    standalone: false
})
export class ProductCreateComponent implements OnInit {
    form!: FormGroup;
    submitting = false;
    submitted = false;
    selectedFile: File | null = null; // Propiedad para el archivo seleccionado
    previewUrl: string | ArrayBuffer | null = null;


    constructor(
        private formBuilder: FormBuilder,
        private router: Router,
        private productService: ProductService
    ) { }

    ngOnInit() {
        this.form = this.formBuilder.group({
            nombre: ['', Validators.required],
            descripcion: ['', Validators.required],
            tipoCalzado: ['', Validators.required],
            precio: [0, [Validators.required, Validators.min(0)]],
            tallas: this.formBuilder.array([])
        });
    }

    get f() { return this.form.controls; }
    get tallas() { return this.f.tallas as FormArray; }

    addTalla() {
        this.tallas.push(this.formBuilder.group({
            talla: ['', Validators.required],
            cantidad: [0, [Validators.required, Validators.min(0)]]
        }));
    }

    removeTalla(index: number) {
        this.tallas.removeAt(index);
    }

    onFileSelected(event: any): void {
        const file = event.target.files[0];
        if (file) {
            this.selectedFile = file;
    
            const reader = new FileReader();
            reader.onload = () => {
                this.previewUrl = reader.result;
            };
            reader.readAsDataURL(file);
        }
    }

        onSubmit() {
        this.submitted = true;
    
        if (this.form.invalid || !this.selectedFile) {
            return;
        }
    
        this.submitting = true;
    
        // Construimos el objeto que corresponde al DTO de Java
        const product = {
            registroProductoDTO: {
                nombre: this.form.value.nombre,
                descripcion: this.form.value.descripcion,
                tipoCalzado: this.form.value.tipoCalzado,
                imagen: "", // El backend asignará la imagen después de subirla
                precio: this.form.value.precio
            },
            tallas: this.form.value.tallas
        };
    
        // Construimos el FormData para enviar tanto el JSON como el archivo
        const formData = new FormData();
        formData.append('producto', new Blob([JSON.stringify(product)], { type: 'application/json' }));
        formData.append('file', this.selectedFile); // Adjuntamos el archivo seleccionado
    
        // Llamamos al servicio para enviar los datos al backend
        this.productService.create(formData)
            .subscribe({
                next: () => {
                    this.router.navigate(['/']); // Redirigir a la página principal
                },
                error: error => {
                    console.error(error);
                    this.submitting = false;
                }
            });
    }
}