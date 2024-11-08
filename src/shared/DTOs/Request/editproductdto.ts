import { ProductStatus } from "../ProductStatus";
import { addproductdto } from "./addproductdto";

export interface EditProductDTO {
    productName: string;
    productPicture?: File;
    categoryName: string;
    productStatus: ProductStatus;
    description?: string;
}

