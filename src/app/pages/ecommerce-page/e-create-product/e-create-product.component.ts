import { Component, Inject, PLATFORM_ID, ViewChild, ElementRef } from '@angular/core';
import { isPlatformBrowser, NgIf, NgFor } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { RouterLink } from '@angular/router';
import { NgxEditorModule, Editor, Toolbar } from 'ngx-editor';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { FileUploadModule } from '@iplab/ngx-file-upload';
import { MatIconModule } from '@angular/material/icon';
import { MatRadioModule } from '@angular/material/radio';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ProductService } from '../../../services/product.service';
import { Router } from '@angular/router';
import { ProductStatus } from '../../../../shared/DTOs/ProductStatus';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-e-create-product',
    standalone: true,
    imports: [RouterLink, NgIf, NgFor, MatCardModule, MatButtonModule, MatFormFieldModule, MatInputModule, MatSelectModule, NgxEditorModule, FileUploadModule, MatDatepickerModule, MatNativeDateModule, MatIconModule, MatRadioModule, ReactiveFormsModule, MatProgressBarModule],
    templateUrl: './e-create-product.component.html',
    styleUrl: './e-create-product.component.scss'
})
export class ECreateProductComponent {

    // Text Editor
    editor!: Editor | null;  // Make it nullable
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

    isDragging = false;
    previewUrl: string | null = null;
    isUploading = false;
    uploadProgress = 0;

    submitProgress = 0;
    showSubmitProgress = false;

    @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

    // ปรับปรุงค่าคงที่สำหรับหมวดหมู่
    categories: { value: string; viewValue: string }[] = [
        { value: 'Dressing', viewValue: 'Dressing' },
        { value: 'Food', viewValue: 'Food' },
        { value: 'Gadgets', viewValue: 'Gadgets' }
    ];

    constructor(
        @Inject(PLATFORM_ID) private platformId: Object,
        private fb: FormBuilder,
        private productService: ProductService,
        private router: Router
    ) {
        this.productForm = this.fb.group({
            productName: ['', Validators.required],
            categoryName: ['', Validators.required],
            productStatus: [ProductStatus.Draft],
            description: [''],
            productPicture: [null]
        });
    }

    ngOnInit() {
        if (isPlatformBrowser(this.platformId)) {
            this.editor = new Editor();
        }
    }

    ngOnDestroy(): void {
        if (isPlatformBrowser(this.platformId) && this.editor) {
            this.editor.destroy();
        }
    }

    // File Uploader
    public multiple: boolean = true;

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
        if (files && files.length > 0) {
            const file = files[0];
            if (this.isValidImageFile(file)) {
                this.handleFile(file);
            }
        }
    }

    onFileSelected(event: any) {
        const file = event.target.files[0];
        if (file && this.isValidImageFile(file)) {
            this.handleFile(file);
        }
    }

    private handleFile(file: File) {
        if (this.isValidImageFile(file)) {
            this.selectedFile = file;
            this.productForm.patchValue({
                image: file
            });

            // Create preview
            const reader = new FileReader();
            reader.onload = () => {
                this.previewUrl = reader.result as string;
            };
            reader.readAsDataURL(file);

            // Show upload progress
            this.simulateUploadProgress();
        }
    }

    private simulateUploadProgress() {
        this.isUploading = true;
        this.uploadProgress = 0;
        const interval = setInterval(() => {
            this.uploadProgress += 15;
            if (this.uploadProgress >= 100) {
                clearInterval(interval);
                this.isUploading = false;
            }
        }, 150);
    }

    removeFile(event: Event) {
        event.stopPropagation();
        this.selectedFile = null;
        this.previewUrl = null;
        this.uploadProgress = 0;
        this.isUploading = false;
        this.productForm.patchValue({
            productPicture: null
        });
        if (this.fileInput) {
            this.fileInput.nativeElement.value = '';
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
                confirmButtonText: 'ตกลง'
            });
            return false;
        }

        if (file.size > maxSize) {
            Swal.fire({
                icon: 'error',
                title: 'ไม่สามารถอัปโหลดได้',
                text: 'ขนาดไฟล์ต้องไม่เกิน 5MB',
                confirmButtonText: 'ตกลง'
            });
            return false;
        }

        return true;
    }

    onSubmit() {
        if (this.productForm.valid && this.selectedFile) {
            const formValue = {
                productName: this.productForm.get('productName')?.value,
                categoryName: this.productForm.get('categoryName')?.value,
                productStatus: this.productForm.get('productStatus')?.value,
                description: this.productForm.get('description')?.value || '',
                productPicture: this.selectedFile
            };

            this.isUploading = true;
            this.showSubmitProgress = true;
            this.submitProgress = 0;

            // เริ่ม progress simulation
            const progressInterval = setInterval(() => {
                if (this.submitProgress < 90) {
                    this.submitProgress += 10;
                }
            }, 200);

            this.productService.createProduct(formValue, this.selectedFile)
                .subscribe({
                    next: (response) => {
                        this.submitProgress = 100;
                        setTimeout(() => {
                            clearInterval(progressInterval);
                            this.isUploading = false;
                            this.showSubmitProgress = false;
                            Swal.fire({
                                icon: 'success',
                                title: 'สำเร็จ!',
                                text: 'เพิ่มสินค้าเรียบร้อยแล้ว',
                                confirmButtonText: 'ตกลง'
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
                            text: error.error || 'ไม่สามารถเพิ่มสินค้าได้ กรุณาลองใหม่อีกคั้ง',
                            confirmButtonText: 'ตกลง'
                        });
                    }
                });
        }
    }

    get categoryNameControl() {
        return this.productForm.get('categoryName');
    }

}
