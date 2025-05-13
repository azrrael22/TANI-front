import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';
import { Pedido } from '@app/_models/pedido';
import { PedidoCarrito } from '@app/_models/pedidoCarrito';
import { RegistroPedidoDTO } from '@app/_models/registroPedido';


const baseUrl = `${environment.apiUrl}/api/pedidos`;

@Injectable({ providedIn: 'root' })
export class PedidoService {
    constructor(private http: HttpClient) {}

    crearPedido(pedido: RegistroPedidoDTO) {
        return this.http.post(`${baseUrl}/crear-pedido`, pedido);
    }

    obtenerCarrito(usuarioId: string) {
        // El endpoint retorna un objeto PedidoCarrito con relaciones completas
        return this.http.get<PedidoCarrito>(`${baseUrl}/usuario/${usuarioId}/carrito`);
    }

    actualizarCantidadDetalle(idDetalle: number, nuevaCantidad: number) {
        // Enviar la cantidad como un parámetro de consulta en la URL
        return this.http.put(`${baseUrl}/detalle/${idDetalle}/cantidad?cantidad=${nuevaCantidad}`, {});
    }

        eliminarDetallePedido(idDetalle: number) {
        // Enviar una solicitud DELETE al backend para eliminar el detalle
        return this.http.delete(`${baseUrl}/detalle/${idDetalle}`);
    }

        terminarPago(idPedido: number) {
        // Llamar al endpoint para terminar el pago del pedido
        return this.http.put(`${baseUrl}/terminar-pago/${idPedido}`, {});
    }
}