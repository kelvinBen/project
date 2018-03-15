export class Goods {
    public id: number;
    public name: string;
    public goodNum: number;
    public startTime: Date;
    public repairTime: string;
    public updateTime: Date;
    public depart: number;
    public emerGroup: number;
    public bigEquip: boolean;
    public rent: boolean;
    public storage: number;
    public longitude: string;
    public latitude: string;
    public goodStatus: string;
    public note: string;
    public buyTime: Date;
    public manufacturer: string;
    public charge: string;
    public telphone: string;
    public phone: string;
    public fax: string;
    public upload: string;
    public type: number;
    public featureid: number;
    public bigtype: number;
    public middletype: number;
    public smalltype: number;
    public assetNum: string;
    public category:number;
}

export class GoodsOper {
    public name: string;
    public goodNum: number;
    public startTime: Date;
    public repairTime: string;
    public updateTime: Date;
    public depart: number;
    public emerGroup: number;
    public bigEquip: boolean;
    public rent: boolean;
    public storage: number;
    public longitude: string;
    public latitude: string;
    public goodStatus: string;
    public note: string;
    public buyTime: Date;
    public manufacturer: string;
    public charge: string;
    public telphone: string;
    public phone: string;
    public fax: string;
    public upload: string;
    public type: number;
    public bigtype: number;
    public middletype: number;
    public smalltype: number;
    public assetNum: string;
    public featureid: number;
    public category: number;
}

export class GoodCate {
    public id: number;
    public name: string;
    public note: string;
}