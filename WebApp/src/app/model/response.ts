export class Response {
    public id: number;
    public status: boolean;
    public time: Date;
    public level: string;
    public eventName: string;
    public address: string;
    public reason: string;
    public range: string;
    public injury: string;
    public goup: string;
    public material: string;
    public otherFiles: string;
    public persons: string;
}

export class ResponseOper {
    public status: boolean;
    public time: Date;
    public level: string;
    public eventName: string;
    public address: string;
    public reason: string;
    public range: string;
    public injury: string;
    public goup: string;
    public material: string;
    public otherFiles: string;
    public persons: string;
}

export class ResponseGroup {
    public groupid: number;
    public groupname: string;
    public mode: string;
    public conductor: string;
    public contact: string;
}

export class MaterialGroup {
    public materialid: number;
    public featureid: number;
    public materialname: string;
    public materialtype: string;//物资类型，shipex,helicopter,goodstype
    public typename: string;
    public function: string;//物资功能
    public num: number;//调用数量
    public numex: number;//消耗的数量
}