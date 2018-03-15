export class Professor {
    constructor(
        public id:number,
        public name:string,
        public birthday:Date,
        public depart:string,
        public position:string,
        public professionType:number,
        public desc:string,
        public gender:string,
        public phone:string,
        public telephone:string,
        public email:string
    ){}
}

export class ProfessorOper {
    constructor(
        public name:string,
        public birthday:Date,
        public depart:string,
        public position:string,
        public professionType:number,
        public desc:string,
        public gender:string,
        public phone:string,
        public telephone:string,
        public email:string
    ){}
}