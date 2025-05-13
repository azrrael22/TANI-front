import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FileUploadModule } from 'primeng/fileupload'; // Importar FileUploadModule

import { ProductEditComponent } from './product-edit.component';

import { ProductRoutingModule } from './product-routing.module';
import { LayoutComponent } from './layout.component';
import { ProductCreateComponent } from './product-create.component';

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        ProductRoutingModule,
        FileUploadModule // Agregar FileUploadModule aquí
    ],
    declarations: [
        LayoutComponent,
        ProductEditComponent,
        ProductCreateComponent
    ]
})
export class ProductModule { }