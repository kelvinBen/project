export class Law {
    constructor(
        public id: number,
        public name: string,
        public source: string,
        public reportTime: Date,
        public validTime: Date,
        public content: string,
        public upload: string,
        public type: number
    ) { }
}

export class LawOper {
    public name: string;
    public source: string;
    public reportTime: Date;
    public validTime: Date;
    public content: string;
    public upload: string;
    public type: number;
}

export class LawType {
    public id: number;
    public name: string;
    public note: string;
}