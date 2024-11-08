import { Component, ViewChild, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { NgClass, NgIf, DatePipe } from '@angular/common';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { ProductService } from '../../../../services/product.service';
import { productdto } from '../../../../../shared/DTOs/Response/productdto';
import { ProductStatus } from '../../../../../shared/DTOs/ProductStatus';

@Component({
    selector: 'app-draft',
    standalone: true,
    imports: [
        RouterLink,
        MatCardModule,
        MatButtonModule,
        MatTableModule,
        NgIf,
        NgClass,
        MatPaginatorModule,
        DatePipe
    ],
    templateUrl: './draft.component.html',
    styleUrl: './draft.component.scss'
})
export class DraftComponent implements OnInit {
    displayedColumns: string[] = [
        'productId',
        'productPicture',
        'productName',
        'category',
        'status',
        'action',
    ];
    dataSource = new MatTableDataSource<productdto>();
    currentKeyword: string = '';
    totalItems: number = 0;
    pageSize: number = 10;
    pageSizeOptions: number[] = [10, 15, 25];
    pageIndex: number = 0;

    @ViewChild(MatPaginator) paginator!: MatPaginator;

    readonly ProductStatus = ProductStatus;

    constructor(private productService: ProductService) {}

    ngOnInit() {
        this.loadDraftProducts();
    }

    loadDraftProducts() {
        this.productService
            .getDraftProducts(this.pageIndex + 1, this.pageSize, this.currentKeyword)
            .subscribe({
                next: (response) => {
                    this.dataSource = new MatTableDataSource<productdto>(response.items);
                    this.totalItems = response.totalItems;
                },
                error: (error) => {
                    console.error('Error loading draft products:', error);
                },
            });
    }

    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.currentKeyword = filterValue.trim();
        this.pageIndex = 0;
        this.loadDraftProducts();
    }

    onPageChange(event: PageEvent) {
        this.pageIndex = event.pageIndex;
        this.pageSize = event.pageSize;
        this.loadDraftProducts();
    }

    getProductImageUrl(imagePath: string): string {
        return this.productService.getProductImageUrl(imagePath);
    }

    deleteProduct(id: number) {
        if (confirm('Are you sure you want to delete this product?')) {
            this.productService.deleteProduct(id).subscribe({
                next: () => {
                    this.loadDraftProducts();
                },
                error: (error) => console.error('Error deleting product:', error),
            });
        }
    }
}
