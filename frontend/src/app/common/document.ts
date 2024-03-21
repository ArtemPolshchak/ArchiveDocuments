import {Category} from "./category";

export class Document {
    id!: number;
    title!: string;
    textContent!: string;
    category!: Category;
    dateCreated!: Date;
}
