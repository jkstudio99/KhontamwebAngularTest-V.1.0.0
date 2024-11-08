import { Component } from '@angular/core';
import { WelcomeComponent } from './welcome/welcome.component';
import { TotalOrdersComponent } from './total-orders/total-orders.component';
import { TotalCustomersComponent } from './total-customers/total-customers.component';
import { TotalRevenueComponent } from './total-revenue/total-revenue.component';
import { TopSellingProductsComponent } from './top-selling-products/top-selling-products.component';


@Component({
    selector: 'app-ecommerce',
    standalone: true,
    imports: [WelcomeComponent, TotalOrdersComponent, TotalCustomersComponent, TotalRevenueComponent, TopSellingProductsComponent],
    templateUrl: './ecommerce.component.html',
    styleUrl: './ecommerce.component.scss'
})
export class EcommerceComponent {}
