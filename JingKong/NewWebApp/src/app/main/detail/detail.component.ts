import { Component, OnInit, ViewChild } from '@angular/core';
import { FormComponent } from '../form/form.component';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Msg } from '../../model/msg';
import { InputBase} from '../../model/input-base';
import { ApiService } from '../../service/api.service';

@Component({
    selector: 'app-detail',
    templateUrl: './detail.component.html',
    styleUrls: ['./detail.component.css'],
})
export class DetailComponent implements OnInit {
    @ViewChild(FormComponent) child: FormComponent;
    questions =[];
    entity_type_id:Number;
    entity_id:Number;
    type:Number;
    titleList = [];
    head:any={};
    constructor(private _route: ActivatedRoute,private apiService: ApiService) {
    }
    ngOnInit() {
        this._route.params.forEach(param=>{
            this.type = param['type'] as Number;
            this.entity_id = param['item'] as Number;
            this.entity_type_id = param['id'] as Number;
        });
        this.apiService.getMenu(1).subscribe(result=> {
            this.titleList = [];
            let info = result as Msg;
            if(info.errCode == 0){
               info.data.forEach(element => {
                 if(element.childrenList == 0){
                   this.titleList.push({"title":element.title,"stitle":'',"entityTypeId":element.entityTypeId})
                 }else{
                   element.childrenList.forEach(ele => {
                     this.titleList.push({"title":element.title,"stitle":ele.title,"entityTypeId":ele.entityTypeId});
                   });
                 }
               });
              this.head = this.titleList.filter(item=>{
                 return item.entityTypeId==this.entity_type_id;
              })[0];
            }
          })
        this.apiService.getEditData(7).subscribe(result => {
            let info = result as Msg;
            if (info.errCode == 0) {
                this.questions = info.data;
            }
        }) 
    }
    submit() {
        console.log(this.child.form);
    }
    reset() {
        this.child.form.reset();
    }

}
