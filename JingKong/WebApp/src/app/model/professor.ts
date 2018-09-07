export class Professor {
    constructor(
        public id:number,
        public name:string,
        public professionType:number,
        public depart:string,
        public position:string,
        // public desc:string,
        // public gender:string,
        public phone:string,
        public email:string
    ){}
}

export class ProfessorOper {
    constructor(
        public name:string, 
        public professionType:number,
        public depart:string,
        public position:string,
       
        // public desc:string,
        // public gender:string,
        public phone:string,
        public email:string
    ){}
}