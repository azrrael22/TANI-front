import { RegistroDetallePedidoDTO } from './registroDetallePedido';

export class RegistroPedidoDTO {
    
    idUsuario!: string; // ID del usuario
    fechaPedido!: string; // Fecha en formato ISO (LocalDateTime)
    estado!: string; // Estado del pedido (PENDIENTE, COMPLETADO, etc.)
    detalles!: RegistroDetallePedidoDTO[]; // Lista de detalles del pedido
}