import { ObjectId } from "mongodb";

export class Cars{
    _id!: ObjectId;
    make!: string;
    model!: string;
    year!: number;
    color!: string;
    odometer!: number;
    price!: number;
}