export class Communication {
    constructor(
        public id: number,
        public name: string,
        public code: string,
        public depart: string,
        public range: string,
        public charge: string,
        public phone: string,
        public telephone: string,
        public latitude: number,
        public longitude: number
    ) { }
}

export class CommunicationOper {
    public name: string;
    public code: string;
    public depart: string;
    public range: string;
    public charge: string;
    public phone: string;
    public telephone: string;
    public latitude: number;
    public longitude: number;
}