export class Exercise {
    constructor(
        public id: number,
        public name: string,
        public depart: string,
        public num: string,
        public address: string,
        public require: string,
        public content: string,
        public extime: string,
        public upload: string
    ) { }
}

export class ExerciseOper {
    public name: string;
    public depart: string;
    public num: string;
    public address: string;
    public require: string;
    public content: string;
    public extime: string;
    public upload: string;
}