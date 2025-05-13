import { Component, OnInit } from '@angular/core';
import { PedidoCarrito } from '@app/_models/pedidoCarrito';
import { PedidoService } from '@app/_services/pedido.service';
import { AccountService } from '@app/_services/account.service';
import { Account } from '@app/_models/account'; // Asegúrate de importar el modelo de Account
import { Router } from '@angular/router';

@Component({
  selector: 'app-pasarela',
  templateUrl: 'pasarela.component.html',
  styleUrls: ['pasarela.component.css'],
  standalone: false
})
export class PasarelaComponent implements OnInit {
  pedido: PedidoCarrito = new PedidoCarrito(); // Pedido completo
  total: number = 0; // Total del pedido
  nombreCompleto: string = ''; // Nombre completo del usuario
  email: string = ''; // Email del usuario
  account = this.accountService.accountValue;

  constructor(
    private pedidoService: PedidoService,
    private accountService: AccountService,
    private router: Router 
  ) {}

  

  ngOnInit(): void {
    // Obtener los datos del usuario desde AccountService
    //const account = this.accountService.accountValue;
    if (this.account) {
      this.nombreCompleto = `${this.account.nombre}`;
      this.email = this.account.correo || '';
    }

    // Obtener el carrito del usuario
    const usuarioId = this.account?.id;
    if (usuarioId) {
      this.pedidoService.obtenerCarrito(usuarioId).subscribe({
        next: (pedido: PedidoCarrito) => {
          if (pedido && pedido.detalles) {
            this.pedido = pedido;
            this.calcularTotal();
          }
        },
        error: (error) => {
          console.error('Error al obtener el pedido:', error);
        }
      });
    }
  }

  calcularTotal(): void {
    this.total = parseFloat(
      this.pedido.detalles
        .reduce((sum, detalle) => sum + detalle.subtotal, 0)
        .toFixed(2)
    );
  }

    procesarPago(): void {
      if (this.pedido.idPedido) {
          console.log('Procesando el pago para el pedido con ID:', this.pedido.idPedido);
  
          this.pedidoService.terminarPago(this.pedido.idPedido).subscribe({
              next: () => {
                  console.log('Pago procesado exitosamente.');
                  alert('El pago se ha procesado correctamente.');
                  // Aquí puedes redirigir al usuario o limpiar el formulario si es necesario
                  this.router.navigate(['/']);
                },
              error: (error) => {
                  console.error('Error al procesar el pago:', error);
                  alert('Hubo un error al procesar el pago. Por favor, inténtalo de nuevo.');
              }
          });
      } else {
          console.error('No se encontró un ID de pedido para procesar el pago.');
          alert('No se encontró un pedido válido para procesar el pago.');
      }
  }

  logAccountId(): void {
    if (this.account?.id) {
      window.alert(`Account ID: ${this.account.id}`);
    }
  }
}