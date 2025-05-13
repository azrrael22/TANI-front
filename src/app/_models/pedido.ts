import { DetallePedido } from './detallepedido';

export class Pedido {
    idPedido!: string; // ID del pedido
    usuarioId!: string; // ID del usuario
    fechaPedido!: string; // Fecha en formato ISO (LocalDateTime)
    estado!: string; // Estado del pedido (PENDIENTE, COMPLETADO, etc.)
    detalles!: DetallePedido[]; // Lista de detalles del pedido
}