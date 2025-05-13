import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '@app/_services/product.service';
import { Product } from '@app/_models/product';



@Component({
  templateUrl: 'product-edit.component.html',
  styleUrls: ['product-edit.component.css'],
  standalone: false
})
export class ProductEditComponent implements OnInit {
  form!: FormGroup;
  product = this.productService.productoElegidoValue;

  submitting = false;
  submitted = false;
  selectedFile: File | null = null;
  previewUrl: string | ArrayBuffer | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    // Obtener el producto seleccionado desde el servicio
    this.product = this.productService.productoElegidoValue;
    console.log('Producto recibido en editar:', this.product);
  
    if (!this.product) {
      // Si no hay producto seleccionado, redirigir a la página principal
      this.router.navigate(['/']);
      return;
    }
  
    // Inicializar el formulario con los datos del producto
    this.form = this.formBuilder.group({
      nombre: [this.product.registroProductoDTO?.nombre || '', Validators.required],
      descripcion: [this.product.registroProductoDTO?.descripcion || '', Validators.required],
      tipoCalzado: [this.product.registroProductoDTO?.tipoCalzado || '', Validators.required],
      precio: [this.product.registroProductoDTO?.precio || 0, [Validators.required, Validators.min(0)]],
      tallas: this.formBuilder.array([])
    });
  
    this.loadTallas();
    this.previewUrl = this.product.registroProductoDTO?.imagen || null;
  }

  get f() { return this.form.controls; }
  get tallas() { return this.f.tallas as FormArray; }

  loadTallas(): void {
  this.product?.tallas?.forEach(talla => {
    this.tallas.push(this.formBuilder.group({
      talla: [talla.talla, Validators.required],
      cantidad: [talla.cantidad, [Validators.required, Validators.min(0)]]
    }));
  });
}

  addTalla(): void {
    this.tallas.push(this.formBuilder.group({
      talla: ['', Validators.required],
      cantidad: [0, [Validators.required, Validators.min(0)]]
    }));
  }

  removeTalla(index: number): void {
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

  

  onSubmit(): void {
    this.submitted = true;

    if (this.form.invalid) {
        return;
    }

    this.submitting = true;

    // Construir el objeto ProductoConTallasDTO
    const productoConTallasDTO = {
        registroProductoDTO: {
            nombre: this.form.value.nombre,
            descripcion: this.form.value.descripcion,
            tipoCalzado: this.form.value.tipoCalzado,
            imagen: this.product?.registroProductoDTO?.imagen, // Mantener la imagen actual
            precio: this.form.value.precio
        },
        tallas: this.form.value.tallas
    };

    // Nombre del producto anterior
    const productoNombre = this.product?.registroProductoDTO?.nombre || '';

    // Llamar al servicio para actualizar el producto
    this.productService.update(productoNombre, productoConTallasDTO)
        .subscribe({
            next: () => {
                console.log('Producto actualizado exitosamente');
                this.router.navigate(['/']); // Redirigir a la página principal
            },
            error: (error) => {
                console.error('Error al actualizar el producto:', error);
                this.submitting = false;
            }
        });
}
}