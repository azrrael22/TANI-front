import { Product } from './product';

export class ProductSize {
    productoid?: string; // Puede ser un ID o un objeto Product
    productoTallaId?: string; // ID de la talla del producto
    talla?: string; // Talla del producto
    cantidad?: number; // Cantidad disponible
}