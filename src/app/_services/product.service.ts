import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

import { environment } from '@environments/environment';
import { Product } from '@app/_models/product';

const baseUrl = `${environment.apiUrl}/api/productos`;

@Injectable({ providedIn: 'root' })
export class ProductService {
    private productoElegidoSubject: BehaviorSubject<Product | null>;
    public productoElegido: Observable<Product | null>;

    constructor(private http: HttpClient) { 
        this.productoElegidoSubject = new BehaviorSubject<Product | null>(null);
        this.productoElegido = this.productoElegidoSubject.asObservable();
    }

    // Getter para obtener el valor actual del producto seleccionado
    public get productoElegidoValue(): Product | null {
        return this.productoElegidoSubject.value;
    }

    // Método para actualizar el producto seleccionado
    public setProductoElegido(product: Product): void {
        this.productoElegidoSubject.next(product);
    }

    // Método para limpiar el producto seleccionado
    public clearProductoElegido(): void {
        this.productoElegidoSubject.next(null);
    }


    create(formData: FormData) {
        return this.http.post(`${baseUrl}/crear-producto`, formData);
    }

    getAll() {
        return this.http.get<Product[]>(baseUrl);
    }
    
    getById(id: string) {
      return this.http.get<Product>(`${baseUrl}/${id}`);
    }
    
    update(productoNombre: string, productoConTallasDTO: any) {
        const formData = new FormData();
        formData.append('productoNombre', productoNombre); // Nombre del producto anterior
        formData.append('productoConTallasDTO', new Blob([JSON.stringify(productoConTallasDTO)], { type: 'application/json' })); // Objeto ProductoConTallasDTO
    
        return this.http.put(`${baseUrl}/editar-producto`, formData);
    }

                 delete(product: Product) {
                    const productName = product.registroProductoDTO?.nombre; // Obtener el nombre del producto
                    console.log('Nombre del producto enviado al backend para eliminar:', productName); // Verifica el valor aquí
                    if (!productName) {
                        throw new Error('El nombre del producto no puede ser undefined');
                    }
                    return this.http.delete(`${baseUrl}/eliminar-producto`, {
                        params: { nombre: productName } // Enviar el nombre como parámetro de consulta
                    });
        }

}