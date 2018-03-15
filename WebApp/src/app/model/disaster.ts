export class Disaster {
    constructor(
        public id: number,
        public dType: number,
        public name: string,
        public address: string,
        public time: Date,
        public injury: string,
        public smallType: number,
        public property: string,
        public note: string,
        public upload: string
    ) { }
}
export class DisasterOper {
    public dType: number;
    public name: string;
    public address: string;
    public time: Date;
    public injury: string;
    public smallType: number;
    public property: string;
    public note: string;
    public upload: string;
}