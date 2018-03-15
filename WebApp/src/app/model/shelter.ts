export class Shelter {
    constructor(
        public id: number,
        public name: string,
        public type: string,
        public area: string,
        public peopleNum: string,
        public address: string,
        public phone: string,
        public latitude: number,
        public longitude: number
    ) { }
}

export class ShelterOper {
    public name: string;
    public type: string;
    public area: string;
    public peopleNum: string;
    public address: string;
    public phone: string;
    public latitude: number;
    public longitude: number;
}