export class Group {
    constructor(
        public id:number,
        public name:string,
        public type:number,
        public peopleNum:number,
        public desc:string,
        public depart:string,
        public charge:string,
        public phone:string,
        public latitude:number,
        public longtitude:number
    ){}
}

export class GroupOper {
    constructor(
        public name:string,
        public type:number,
        public peopleNum:number,
        public desc:string,
        public depart:string,
        public charge:string,
        public phone:string,
        public latitude:number,
        public longtitude:number
    ){}
}