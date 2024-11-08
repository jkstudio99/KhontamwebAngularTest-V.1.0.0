import { Component, Inject, PLATFORM_ID, ViewChild, ElementRef, OnInit, OnDestroy } from '@angular/core';
import { isPlatformBrowser, NgIf, NgFor } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { NgxEditorModule, Editor, Toolbar } from 'ngx-editor';
import { MatRadioModule } from '@angular/material/radio';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ProductService } from '../../../services/product.service';
import { ProductStatus } from '../../../../shared/DTOs/ProductStatus';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import Swal from 'sweetalert2';
import { EditProductDTO } from '../../../../shared/DTOs/Request/editproductdto';
import { ProductDetailDTO } from '../../../../shared/DTOs/Response/productdetaildto';
import { MatDatepicker, MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { provideNativeDateAdapter } from '@angular/material/core';

@Component({
    selector: 'app-e-edit-product',
    standalone: true,
    imports: [
        RouterLink, NgIf, NgFor, MatCardModule, MatButtonModule,
        MatFormFieldModule, MatInputModule, MatSelectModule,
        NgxEditorModule, MatRadioModule, ReactiveFormsModule,
        MatProgressBarModule, MatDatepickerModule,
        MatNativeDateModule
    ],
    providers: [
        provideNativeDateAdapter()
    ],
    templateUrl: './e-edit-product.component.html',
    styleUrl: './e-edit-product.component.scss'
})
export class EEditProductComponent implements OnInit, OnDestroy {
    editor!: Editor | null;
    toolbar: Toolbar = [
        ['bold', 'italic'],
        ['underline', 'strike'],
        ['code', 'blockquote'],
        ['ordered_list', 'bullet_list'],
        [{ heading: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] }],
        ['link', 'image'],
        ['text_color', 'background_color'],
        ['align_left', 'align_center', 'align_right', 'align_justify'],
    ];

    productForm: FormGroup;
    selectedFile: File | null = null;
    readonly ProductStatus = ProductStatus;
    productId!: number;

    isDragging = false;
    previewUrl: string | null = null;
    isUploading = false;
    submitProgress = 0;
    showSubmitProgress = false;

    uploadProgress = 0;

    @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

    categories: { value: string; viewValue: string }[] = [
        { value: 'Dressing', viewValue: 'Dressing' },
        { value: 'Food', viewValue: 'Food' },
        { value: 'Gadgets', viewValue: 'Gadgets' }
    ];

    constructor(
        private formBuilder: FormBuilder,
        private productService: ProductService,
        private route: ActivatedRoute,
        private router: Router,
        @Inject(PLATFORM_ID) private platformId: Object
    ) {
        this.productForm = this.formBuilder.group({
            productName: ['', Validators.required],
            categoryName: ['', Validators.required],
            productStatus: [ProductStatus.Draft],
            description: ['']
        });
    }

    ngOnInit(): void {
        if (isPlatformBrowser(this.platformId)) {
            this.editor = new Editor();
        }

        // รับ id จาก URL parameter
        this.route.params.subscribe(params => {
            this.productId = +params['id']; // แปลงเป็นตัวเลข
            this.loadProductData();
        });
    }

    ngOnDestroy(): void {
        if (isPlatformBrowser(this.platformId) && this.editor) {
            this.editor.destroy();
        }
    }

    loadProductData() {
        this.productService.getProduct(this.productId).subscribe({
            next: (product: ProductDetailDTO) => {
                if (product) {
                    this.productForm.patchValue({
                        productName: product.productName || '',
                        categoryName: product.categoryName || '',
                        productStatus: product.productStatus === 'Published'
                            ? ProductStatus.Published
                            : ProductStatus.Draft,
                        description: product.description || ''
                    });

                    if (product.productPicture) {
                        this.previewUrl = this.productService.getProductImageUrl(product.productPicture);
                    }
                }
            },
            error: (error) => {
                console.error('Error loading product:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'เกิดข้อผิดพลาด!',
                    text: 'ไม่สามารถโหลดข้อมูลสินค้าได้',
                    confirmButtonText: 'ตกลง',
                    confirmButtonColor: '#114EBC'
                });
            }
        });
    }

    onDragOver(event: DragEvent) {
        event.preventDefault();
        event.stopPropagation();
        this.isDragging = true;
    }

    onDragLeave(event: DragEvent) {
        event.preventDefault();
        event.stopPropagation();
        this.isDragging = false;
    }

    onDrop(event: DragEvent) {
        event.preventDefault();
        event.stopPropagation();
        this.isDragging = false;

        const files = event.dataTransfer?.files;
        if (files?.length) {
            this.handleFile(files[0]);
        }
    }

    onFileSelected(event: Event) {
        const input = event.target as HTMLInputElement;
        if (input.files?.length) {
            this.handleFile(input.files[0]);
        }
    }

    private handleFile(file: File) {
        if (this.isValidImageFile(file)) {
            this.selectedFile = file;
            const reader = new FileReader();
            reader.onload = () => {
                this.previewUrl = reader.result as string;
            };
            reader.readAsDataURL(file);
        }
    }

    private isValidImageFile(file: File): boolean {
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
        const maxSize = 5 * 1024 * 1024; // 5MB

        if (!allowedTypes.includes(file.type)) {
            Swal.fire({
                icon: 'error',
                title: 'ไม่สามารถอัปโหลดได้',
                text: 'กรุณาเลือกไฟล์รูปภาพที่มีนามสกุล .jpg, .png หรือ .gif',
                confirmButtonText: 'ตกลง',
                confirmButtonColor: '#114EBC'
            });
            return false;
        }

        if (file.size > maxSize) {
            Swal.fire({
                icon: 'error',
                title: 'ไม่สามารถอัปโหลดได้',
                text: 'ขนาดไฟล์ต้องไม่เกิน 5MB',
                confirmButtonText: 'ตกลง',
                confirmButtonColor: '#114EBC'
            });
            return false;
        }

        return true;
    }

    onSubmit() {
        if (this.productForm.valid) {
            // สร้าง editproductdto object ตามโครงสร้างที่ Backend ต้องการ
            const editProductDto: EditProductDTO = {
                productName: this.productForm.get('productName')?.value,
                categoryName: this.productForm.get('categoryName')?.value,
                productStatus: this.productForm.get('productStatus')?.value,
                description: this.productForm.get('description')?.value || '',
                // ส่ง productPicture เฉพาะเมื่อมีการเลือกไฟล์ใหม่
                ...(this.selectedFile && { productPicture: this.selectedFile })
            };

            this.isUploading = true;
            this.showSubmitProgress = true;
            this.submitProgress = 0;

            const progressInterval = setInterval(() => {
                if (this.submitProgress < 90) {
                    this.submitProgress += 10;
                }
            }, 150);

            this.productService.editProduct(this.productId, editProductDto).subscribe({
                next: () => {
                    this.submitProgress = 100;
                    setTimeout(() => {
                        clearInterval(progressInterval);
                        this.isUploading = false;
                        this.showSubmitProgress = false;
                        Swal.fire({
                            icon: 'success',
                            title: 'สำเร็จ!',
                            text: 'แก้ไขสินค้าเรียบร้อยแล้ว',
                            confirmButtonText: 'ตกลง',
                            confirmButtonColor: '#114EBC'
                        }).then(() => {
                            this.router.navigate(['/dashboard/ecommerce-page/products-list']);
                        });
                    }, 500);
                },
                error: (error) => {
                    clearInterval(progressInterval);
                    this.isUploading = false;
                    this.showSubmitProgress = false;
                    console.error('Error:', error);
                    Swal.fire({
                        icon: 'error',
                        title: 'เกิดข้อผิดพลาด!',
                        text: error.error || 'ไม่สามารถแก้ไขสินค้าได้ กรุณาลองใหม่อีกครั้ง',
                        confirmButtonText: 'ตกลง',
                        confirmButtonColor: '#114EBC'
                    });
                }
            });
        }
    }

    removeFile(event: Event) {
        event.preventDefault();
        this.selectedFile = null;
        this.previewUrl = null;
        if (this.fileInput) {
            this.fileInput.nativeElement.value = '';
        }
    }
}
