export class orderdetail {
    "id": number;
    "orderid": number;
    "price": number;
    "productid": number;
    "productnum": number;
    "productprice": number;
  }
export class detail {
    "code": number;
    "msg": null;
    "data": {
      "order": {
        "id": number;
        "ordernumber": string;
        "ordertime": string;
        "price": number;
        "status": string;
        "type": string;
        "userid": number;
        "visitnumber":number;
        "duration":number;
      },
      "orderdetails": orderdetail[];
    }
  }
  export class orderdata {
      "order": {
        "id": number;
        "ordernumber": string;
        "ordertime": string;
        "price": number;
        "status": string;
        "type": string;
        "userid": number;
        "visitnumber":number;
        "duration":number;
      }
      "orderdetails": orderdetail[];
  }