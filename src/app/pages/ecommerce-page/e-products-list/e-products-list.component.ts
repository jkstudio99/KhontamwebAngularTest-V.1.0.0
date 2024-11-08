import { Component, inject, OnInit, ViewChild, LOCALE_ID } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { NgClass, NgIf, DatePipe } from '@angular/common';
import {
    MatPaginator,
    MatPaginatorModule,
    PageEvent,
} from '@angular/material/paginator';
import { MatTabsModule } from '@angular/material/tabs';
import { PublishedComponent } from './published/published.component';
import { DraftComponent } from './draft/draft.component';
import { CustomizerSettingsService } from '../../../customizer-settings/customizer-settings.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ProductService } from '../../../services/product.service';
import { productdto } from '../../../../shared/DTOs/Response/productdto';
import { registerLocaleData } from '@angular/common';
import localeTh from '@angular/common/locales/th';
import { ProductStatus } from '../../../../shared/DTOs/ProductStatus';
import Swal from 'sweetalert2';

registerLocaleData(localeTh);

@Component({
    selector: 'app-e-products-list',
    standalone: true,
    imports: [
        RouterLink,
        MatCardModule,
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule,
        MatTabsModule,
        MatTableModule,
        NgIf,
        NgClass,
        MatPaginatorModule,
        PublishedComponent,
        DraftComponent,
        DatePipe,
    ],
    templateUrl: './e-products-list.component.html',
    styleUrl: './e-products-list.component.scss',
    providers: [{ provide: LOCALE_ID, useValue: 'th-TH' }],
})
export class EProductsListComponent implements OnInit {
    displayedColumns: string[] = [
        'productId',
        'productPicture',
        'productName',
        'category',
        'status',
        'action',
    ];
    dataSource = new MatTableDataSource<productdto>();
    themeService = inject(CustomizerSettingsService);
    currentKeyword: string = '';
    totalItems: number = 0;
    pageSize: number = 10;
    pageSizeOptions: number[] = [10, 15, 25];
    pageIndex: number = 0;

    @ViewChild(MatPaginator) paginator!: MatPaginator;

    readonly ProductStatus = ProductStatus;

    constructor(private productService: ProductService) {}

    ngOnInit() {
        this.loadProducts();
    }

    loadProducts() {
        this.productService
            .getProducts(this.pageIndex + 1, this.pageSize, this.currentKeyword)
            .subscribe({
                next: (response) => {
                    this.dataSource = new MatTableDataSource<productdto>(response.items);
                    this.totalItems = response.totalItems;
                },
                error: (error) => {
                    console.error('Error loading products:', error);
                },
            });
    }

    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.currentKeyword = filterValue.trim();
        this.pageIndex = 0; // Reset to first page when filtering
        this.loadProducts();
    }

    onPageChange(event: PageEvent) {
        this.pageIndex = event.pageIndex;
        this.pageSize = event.pageSize;
        this.loadProducts();
    }

    deleteProduct(id: number) {
        Swal.fire({
            title: 'คุณแน่ใจหรือไม่?',
            text: "การลบสินค้าไม่สามารถกู้คืนได้!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#1a73e8',
            cancelButtonColor: '#d33',
            confirmButtonText: 'ลบเลย!',
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
                        });
                        this.loadProducts();
                    },
                    error: (error) => {
                        console.error('Error deleting product:', error);
                        Swal.fire({
                            title: 'เกิดข้อผิดพลาด!',
                            text: 'ไม่สามารถลบสินค้าได้ กรุณาลองใหม่อีกครั้ง',
                            icon: 'error',
                            confirmButtonText: 'ตกลง'
                        });
                    }
                });
            }
        });
    }

    getProductImageUrl(imagePath: string): string {
        return this.productService.getProductImageUrl(imagePath);
    }
}
