export class Storage {
    public id: number;
    public name: string;
    public address: string;
    public depart: number;
    public charge: string;
    public phone: string;
    public type: string;
    public longitude: string;
    public latitude: string;
    public telephone: string;
    public fax: string;
    public capacity: string;
    public capacityUnit: string;
    public note: string;
}

export class StorageOper {
    public name: string;
    public address: string;
    public depart: number;
    public charge: string;
    public phone: string;
    public type: string;
    public longitude: string;
    public latitude: string;
    public telephone: string;
    public fax: string;
    public capacity: string;
    public capacityUnit: string;
    public note: string;
}


export class StorageLayer {
    public parent: any;
    public data: Storage;
}