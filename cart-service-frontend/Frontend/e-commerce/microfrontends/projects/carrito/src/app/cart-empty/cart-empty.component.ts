import { HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { AppComponent } from '../app.component';

@Component({
  selector: 'app-cart-empty',
  standalone: true,
  imports: [HttpClientModule],
  templateUrl: './cart-empty.component.html',
  styleUrl: './cart-empty.component.scss'
})
export class CartEmptyComponent {

}
