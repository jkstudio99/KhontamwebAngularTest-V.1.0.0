import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { EcommerceComponent } from './dashboard/ecommerce/ecommerce.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { EcommercePageComponent } from './pages/ecommerce-page/ecommerce-page.component';
import { EProductsListComponent } from './pages/ecommerce-page/e-products-list/e-products-list.component';
import { EProductDetailsComponent } from './pages/ecommerce-page/e-product-details/e-product-details.component';
import { ECreateProductComponent } from './pages/ecommerce-page/e-create-product/e-create-product.component';
import { EEditProductComponent } from './pages/ecommerce-page/e-edit-product/e-edit-product.component';
import { AuthenticationComponent } from './authentication/authentication.component';
import { SignInComponent } from './authentication/sign-in/sign-in.component';
import { SignUpComponent } from './authentication/sign-up/sign-up.component';

export const routes: Routes = [
    { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
    {
        path: 'dashboard',
        component: DashboardComponent,
        children: [
            { path: '', component: EcommerceComponent },
            {
                path: 'ecommerce-page',
                component: EcommercePageComponent,
                children: [
                    {
                        path: 'products-list',
                        component: EProductsListComponent,
                    },
                    {
                        path: 'product-details/:id',
                        component: EProductDetailsComponent,
                    },
                    {
                        path: 'create-product',
                        component: ECreateProductComponent,
                    },
                    {
                        path: 'edit-product/:id',
                        component: EEditProductComponent,
                    },
                ],
            },
        ],
    },
    {
        path: 'authentication',
        component: AuthenticationComponent,
        children: [
            { path: '', component: SignInComponent },
            { path: 'sign-up', component: SignUpComponent },
        ],
    },
    // Here add new pages component

    { path: '**', component: NotFoundComponent }, // This line will remain down from the whole pages component list
];
