import { Component, OnInit } from '@angular/core';
import { PedidoService } from '@app/_services/pedido.service';
import { Pedido } from '@app/_models/pedido';
import { DetallePedido } from '@app/_models/detallepedido';
import { AccountService } from '@app/_services/account.service';
import { ProductSize } from '@app/_models/productSize';
import { Product } from '@app/_models/product';
import { PedidoCarrito, DetalleCarrito } from '@app/_models/pedidoCarrito';


@Component({
  selector: 'app-carrito',
  templateUrl: 'carrito.component.html',
  styleUrls: ['carrito.component.css'],
  standalone: false
})
export class CarritoComponent implements OnInit {
  pedido: PedidoCarrito = new PedidoCarrito(); // Pedido completo
  total: number = 0; // Total del carrito

  constructor(
    private pedidoService: PedidoService,
    private accountService: AccountService
  ) {}

  ngOnInit(): void {
    const usuarioId = this.accountService.accountValue?.id;
    if (usuarioId) {
      this.pedidoService.obtenerCarrito(usuarioId).subscribe({
        next: (pedido: PedidoCarrito) => {
          if (pedido && pedido.detalles) {
            this.pedido = pedido;
            this.calcularTotal();
          }
        },
        error: (error) => {
          console.error('Error al obtener el carrito:', error);
        }
      });
    }
  }

        eliminarDetalle(detalle: DetalleCarrito): void {
        this.pedidoService.eliminarDetallePedido(detalle.idDetalle).subscribe({
            next: () => {
                // Volver a obtener el carrito actualizado desde el backend
                const usuarioId = this.accountService.accountValue?.id;
                if (usuarioId) {
                    this.pedidoService.obtenerCarrito(usuarioId).subscribe({
                        next: (pedido: PedidoCarrito) => {
                            if (pedido && pedido.detalles) {
                                this.pedido = pedido;
                                this.calcularTotal(); // Recalcular el total
                            }
                        },
                        error: (error) => {
                            console.error('Error al obtener el carrito actualizado:', error);
                        }
                    });
                }
            },
            error: (error) => {
                console.error('Error al eliminar el detalle:', error);
            }
        });
    }

    calcularTotal(): void {
      this.total = parseFloat(
          this.pedido.detalles
              .reduce((sum, detalle) => sum + detalle.subtotal, 0)
              .toFixed(2)
      );
  }

  actualizarCantidad(detalle: DetalleCarrito, incremento: number): void {
    const nuevaCantidad = detalle.cantidad + incremento;
    if (nuevaCantidad > 0) {
      this.pedidoService.actualizarCantidadDetalle(detalle.idDetalle, nuevaCantidad).subscribe({
        next: () => {
          detalle.cantidad = nuevaCantidad;
          detalle.subtotal = detalle.cantidad * detalle.precioUnitario;
          this.calcularTotal();
        },
        error: (error) => {
          console.error('Error al actualizar la cantidad:', error);
        }
      });
    }
  }
}