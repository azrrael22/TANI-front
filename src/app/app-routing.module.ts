import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ResetPasswordComponent } from './account/reset-password.component';
import { TermsComponent } from './terms/terms.component';


import { HomeComponent } from './home';
import { AuthGuard } from './_helpers';
import { Role } from './_models';

import { PasarelaComponent } from './pasarela/pasarela.component';
const accountModule = () => import('./account/account.module').then(x => x.AccountModule);
const adminModule = () => import('./admin/admin.module').then(x => x.AdminModule);
const profileModule = () => import('./profile/profile.module').then(x => x.ProfileModule);
const productModule = () => import('./product/product.module').then(x => x.ProductModule);
import { CarritoComponent } from './carrito/carrito.component';


const routes: Routes = [
    { path: '', component: HomeComponent, canActivate: [AuthGuard] },
    { path: 'account', loadChildren: accountModule },
    { path: 'profile', loadChildren: profileModule, canActivate: [AuthGuard] },
    { path: 'admin', loadChildren: adminModule, canActivate: [AuthGuard], data: { roles: [Role.Admin] } },
    { path: 'productos', loadChildren: productModule, canActivate: [AuthGuard], data: { roles: [Role.Admin] } },
    { path: 'reset-password', component: ResetPasswordComponent },
    { path: 'mi-carrito', component: CarritoComponent },
    { path: 'pasarela', component: PasarelaComponent },
    { path: 'condiciones', component: TermsComponent },

    // otherwise redirect to home
    { path: '**', redirectTo: '' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
