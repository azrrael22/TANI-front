import { ProductSize } from "./productSize";

export class Product {
    registroProductoDTO?: {
        nombre: string;
        descripcion: string;
        tipoCalzado: string;
        imagen: string;
        precio: number;
    };
    tallas?: ProductSize[];
    selectedSize?: string; // Agregado para rastrear la talla seleccionada
}