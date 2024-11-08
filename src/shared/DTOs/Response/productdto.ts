export interface productdto {
    productId: number;
    productName: string;
    productPicture?: string;
    categoryName: string;
    productStatus: string;
    description?: string;
    createdDate: Date;
    modifiedDate: Date;
}
