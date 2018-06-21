export class Station {
    constructor(
        public id: number,
        public station: string,
        public stationNum: string,
        public address: string,
        public longitude: string,
        public latitude: string
    ) { }
}
export class Horn {
    constructor(
        public lat: number,
        public lon: number,
        public name: string
    ) { }
}

