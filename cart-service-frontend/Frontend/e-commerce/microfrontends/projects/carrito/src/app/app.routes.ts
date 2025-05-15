import { Routes } from '@angular/router';
import { AppComponent } from './app.component';

export const routes: Routes = [

 { path: '', redirectTo: 'carrito', pathMatch: 'full' },
  { path: 'carrito', component: AppComponent },
  
];
