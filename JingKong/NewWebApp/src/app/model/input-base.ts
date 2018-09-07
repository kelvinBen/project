// export class InputBase<T> {
//     value: T;
//     key: string;
//     label: string;
//     required: boolean;
//     order: number;
//     controlType: string;
  
//     constructor(options: {
//         value?: T,
//         key?: string,
//         label?: string,
//         required?: boolean,
//         order?: number,
//         controlType?: string
//       } = {}) {
//       this.value = options.value;
//       this.key = options.key || '';
//       this.label = options.label || '';
//       this.required = !!options.required;
//       this.order = options.order === undefined ? 1 : options.order;
//       this.controlType = options.controlType || '';
//     }
//   }


export class InputBase {
 public attributeId:number;
 public  dataType: string;
 public  format: any;
 public  attributeCode: string;
 public  attributeName: string;
 public  options: any;
 public  defaultValue: any;
 public  relation: any;
 public  unit: any;
 public  isRequired: boolean;
 public  isSearchable: boolean;
 public  isList: boolean;
 public sort:number;
}