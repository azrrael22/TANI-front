export class PedidoCarrito {
    idPedido!: number; // ID del pedido
    usuarioId!: number; // ID del usuario
    fechaPedido!: string; // Fecha del pedido en formato ISO
    estado!: string; // Estado del pedido (PENDIENTE, PAGADO, etc.)
    detalles: DetalleCarrito[] = []; // Inicializado como un array vacío
}

export class DetalleCarrito {
    productoDTO!: ProductoCarrito; // Información del producto
    tallaDTO!: TallaCarrito; // Información de la talla
    idDetalle!: number; // ID del detalle del pedido
    cantidad!: number; // Cantidad de productos
    precioUnitario!: number; // Precio unitario del producto
    subtotal!: number; // Subtotal (cantidad * precioUnitario)
    productoTallaId!: number; // ID de la relación producto-talla
}

export class ProductoCarrito {
    idProducto!: number; // ID del producto
    nombre!: string; // Nombre del producto
    descripcion!: string; // Descripción del producto
    tipoCalzado!: string; // Tipo de calzado (SANDALIA, ZAPATO, etc.)
    imagen!: string; // URL de la imagen del producto
    precio!: number; // Precio del producto
}

export class TallaCarrito {
    id!: number; // ID de la talla
    productoId!: number; // ID del producto asociado
    talla!: string; // Talla del producto
    cantidad!: number; // Cantidad disponible
}