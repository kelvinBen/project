export class Msg {
    public code: number;
    public msg: string;
    public data: any;
}
export class order {
    public code: number;
    public msg: any;
    data:orderitem;
}
export class orderitem {
    id: number;
    ordernumber:string;
    userid:number;
    type:string;
    ordertime:string;
    price:number;
    status:string;
}
export class orders{
    public code: number;
    public msg: any;
    data:orderitem[];
}