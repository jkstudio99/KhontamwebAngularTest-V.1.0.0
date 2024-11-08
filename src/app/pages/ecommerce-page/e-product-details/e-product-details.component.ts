import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProductService } from '../../../services/product.service';
import { ProductDetailDTO } from '../../../../shared/DTOs/Response/productdetaildto';
import { CustomizerSettingsService } from '../../../customizer-settings/customizer-settings.service';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import Swal from 'sweetalert2';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { DatePipe } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';

@Component({
    standalone: true,
    imports: [
        CommonModule,
        MatCardModule,
        MatIconModule,
        MatButtonModule,
        RouterLink,
        MatProgressSpinnerModule,
        MatTabsModule,
        DatePipe
    ],
    selector: 'app-e-product-details',
    templateUrl: './e-product-details.component.html',
    styleUrls: ['./e-product-details.component.scss']
})
export class EProductDetailsComponent implements OnInit {
    product?: ProductDetailDTO;
    loading = true;
    error = false;

    // เพิ่ม properties สำหรับ UI states
    inStock = true;
    rating = 5;
    reviews = 76;
    originalPrice = 3799;
    discountedPrice = 3499;
    viewCount = 565;

    // สำหรับ carousel images
    productImages = [
        { url: this.product?.productPicture || 'assets/images/default-product.png' }
    ];

    // สำหรับ specifications
    specifications = {
        general: {
            brand: 'Apple',
            model: 'MacBook Pro',
            dimensions: '304.10 x 212.40 x 14.90',
            weight: '1.37',
            color: 'Space Grey',
            os: 'macOS'
        },
        // ... add more specifications
    };

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private productService: ProductService,
        public themeService: CustomizerSettingsService
    ) {}

    ngOnInit() {
        this.route.params.subscribe(params => {
            const productId = params['id'];
            if (productId) {
                this.loadProductDetails(+productId);
            }
        });
    }

    loadProductDetails(id: number) {
        this.loading = true;
        this.error = false;

        this.productService.getProduct(id).subscribe({
            next: (response) => {
                if (response) {
                    this.product = response;
                    this.loading = false;
                } else {
                    this.error = true;
                    this.loading = false;
                }
            },
            error: (error) => {
                console.error('Error loading product:', error);
                this.loading = false;
                this.error = true;
                Swal.fire({
                    title: 'เกิดข้อผิดพลาด!',
                    text: 'ไม่สามารถโหลดข้อมูลสินค้าได้',
                    icon: 'error',
                    confirmButtonText: 'ตกลง'
                }).then(() => {
                    this.router.navigate(['/dashboard/ecommerce-page/products-list']);
                });
            }
        });
    }

    onEdit(id: number) {
        this.router.navigate(['/dashboard/ecommerce-page/edit-product', id]);
    }

    onDelete(id: number) {
        Swal.fire({
            title: 'คุณแน่ใจหรือไม่?',
            text: 'การลบสินค้าไม่สามารถกู้คืนได้!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'ใช่, ลบเลย!',
            cancelButtonText: 'ยกเลิก'
        }).then((result) => {
            if (result.isConfirmed) {
                this.productService.deleteProduct(id).subscribe({
                    next: () => {
                        Swal.fire({
                            title: 'ลบสำเร็จ!',
                            text: 'สินค้าถูกลบเรียบร้อยแล้ว',
                            icon: 'success',
                            confirmButtonText: 'ตกลง'
                        }).then(() => {
                            this.router.navigate(['/dashboard/ecommerce-page/products-list']);
                        });
                    },
                    error: (error) => {
                        console.error('Error deleting product:', error);
                        Swal.fire({
                            title: 'เกิดข้อผิดพลาด!',
                            text: 'ไม่สามารถลบสินค้าได้',
                            icon: 'error',
                            confirmButtonText: 'ตกลง'
                        });
                    }
                });
            }
        });
    }
}
