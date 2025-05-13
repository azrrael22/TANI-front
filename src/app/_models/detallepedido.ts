import { ProductSize } from './productSize';

export class DetallePedido {
    idDetalle!: string; // ID del detalle del pedido
    cantidad!: number; // Cantidad de productos
    precioUnitario!: number; // Precio unitario del producto
    subtotal!: number; // Subtotal (cantidad * precioUnitario)
    idProductoTalla!: string; // Puede ser un ID o un objeto ProductSize
    idPedido?: string; // ID del pedido (opcional, lo asigna el backend)
}