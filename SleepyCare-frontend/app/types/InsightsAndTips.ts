export interface Insight {
    _id: string;
    topic : string;
    text: string;
    idClient: string;
    createdAt: Date;
}
export interface Tip {
    _id: string;
    topic : string;
    text: string;
    idClient: string;
    createdAt: Date;
    url?:URL;
}