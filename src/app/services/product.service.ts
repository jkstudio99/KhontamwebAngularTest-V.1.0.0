import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { productdto } from '../../shared/DTOs/Response/productdto';
import { pagingdto } from '../../shared/DTOs/Response/pagingdto';
import { ProductStatus } from '../../shared/DTOs/ProductStatus';
import { Observable } from 'rxjs';
import { ProductDetailDTO } from '../../shared/DTOs/Response/productdetaildto';
import { EditProductDTO } from '../../shared/DTOs/Request/editproductdto';
import { addproductdto } from '../../shared/DTOs/Request/addproductdto';
import { map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) { }

  getProducts(pageIndex: number, pageSize: number, keyword: string) {
    let params = new HttpParams()
      .set('PageIndex', pageIndex.toString())
      .set('PageSize', pageSize.toString())
      .set('Keyword', keyword || '');

    return this.http.get<pagingdto<productdto>>(environment.apiBaseUrl + '/Product', { params });
  }

  getPublishedProducts(pageIndex: number, pageSize: number, keyword: string) {
    let params = new HttpParams()
      .set('PageIndex', pageIndex.toString())
      .set('PageSize', pageSize.toString())
      .set('Keyword', keyword || '')
      .set('Status', ProductStatus.Published);

    return this.http.get<pagingdto<productdto>>(environment.apiBaseUrl + '/Product', { params });
  }

  getDraftProducts(pageIndex: number, pageSize: number, keyword: string) {
    let params = new HttpParams()
      .set('PageIndex', pageIndex.toString())
      .set('PageSize', pageSize.toString())
      .set('Keyword', keyword || '')
      .set('Status', ProductStatus.Draft.toString());

    return this.http.get<pagingdto<productdto>>(environment.apiBaseUrl + '/Product', { params });
  }

  getProduct(id: number): Observable<ProductDetailDTO> {
    return this.http.get<ProductDetailDTO>(`${this.apiUrl}/Product/${id}`).pipe(
        map(response => {
            if (response) {
                return {
                    ...response,
                    productPicture: this.getProductImageUrl(response.productPicture || '')
                };
            }
            throw new Error('Product not found');
        })
    );
  }

  createProduct(productData: addproductdto, file: File): Observable<any> {
    const formData = new FormData();

    // Append product data
    formData.append('productName', productData.productName);
    formData.append('categoryName', productData.categoryName);
    formData.append('productStatus', productData.productStatus.toString());
    if (productData.description) {
        formData.append('description', productData.description);
    }

    // Append file if exists
    if (file) {
        formData.append('productPicture', file);
    }

    return this.http.post(environment.apiBaseUrl + '/Product', formData);
  }

  editProduct(id: number, req: EditProductDTO) {
    const formData = new FormData();

    // ใส่ข้อมูลลงใน FormData ตามโครงสร้างที่ Backend ต้องการ
    formData.append('productName', req.productName);
    formData.append('categoryName', req.categoryName);
    formData.append('productStatus', req.productStatus.toString());

    if (req.description) {
        formData.append('description', req.description);
    }

    // ถ้ามีการอัปโหลดรูปใหม่
    if (req.productPicture) {
        formData.append('productPicture', req.productPicture);
    }

    return this.http.put<void>(environment.apiBaseUrl + '/Product/' + id, formData);
  }

  deleteProduct(id: number) {
    return this.http.delete<void>(environment.apiBaseUrl + '/Product/' + id);
  }

  private isValidImageFile(file: File): boolean {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
    const maxSize = 5 * 1024 * 1024; // 5MB
    return allowedTypes.includes(file.type) && file.size <= maxSize;
  }

  getProductImageUrl(imagePath: string): string {
    if (!imagePath) return 'assets/images/default-product.png';
    return imagePath.includes('cloudinary.com') ?
           imagePath :
           this.apiUrl + '/images/' + imagePath;
  }
}
