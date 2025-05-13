import { NgModule, APP_INITIALIZER } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { CommonModule } from '@angular/common'; // Importar CommonModule

// used to create fake backend
import { fakeBackendProvider } from './_helpers';

import { AppRoutingModule } from './app-routing.module';
import { JwtInterceptor, ErrorInterceptor, appInitializer } from './_helpers';
import { AccountService } from './_services';
import { AppComponent } from './app.component';
import { AlertComponent } from './_components';
import { HomeComponent } from './home';
import { FileUploadModule } from 'primeng/fileupload';
import { CarritoComponent } from './carrito/carrito.component';
import { PasarelaComponent } from './pasarela/pasarela.component';



@NgModule({
    declarations: [
        AppComponent,
        AlertComponent,
        CarritoComponent,
        PasarelaComponent,
        HomeComponent
    ],
    bootstrap: [AppComponent],
    imports: [
        BrowserModule,
        BrowserAnimationsModule, // Agregado para animaciones
        ReactiveFormsModule,
        FormsModule, // Agregado para formularios basados en plantillas
        HttpClientModule, // Agregado para compatibilidad con versiones anteriores
        AppRoutingModule,
        CommonModule,
        FileUploadModule
    ],
    providers: [
        { provide: APP_INITIALIZER, useFactory: appInitializer, multi: true, deps: [AccountService] }, // Cambiado a APP_INITIALIZER
        { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
        // provider used to create fake backend
        fakeBackendProvider
    ]
})
export class AppModule { }