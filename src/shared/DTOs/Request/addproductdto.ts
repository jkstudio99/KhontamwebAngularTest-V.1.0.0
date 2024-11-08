import { ProductStatus } from "../ProductStatus";

export interface addproductdto {
    productName: string;
    productPicture?: File;
    categoryName: string;
    productStatus: ProductStatus;
    description?: string;
}
