export class Transport {
    constructor(
        public id: number,
        public name: string,
        public depart: string,
        public type: string,
        public area: string,
        public ways: string,
        public charge: string,
        public phone: string,
        public telephone: string,
        public latitude: number,
        public longitude: number
    ) { }
}

export class TransportOper {
    public name: string;
    public depart: string;
    public type: string;
    public area: string;
    public ways: string;
    public charge: string;
    public phone: string;
    public telephone: string;
    public latitude: number;
    public longitude: number;
}
