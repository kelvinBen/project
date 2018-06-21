import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Http } from '@angular/http';
import { ServerService } from '../../../service/server.service';
import { Category } from '../../../index/list/category';
import { subCategory } from '../../../index/list/subcategory';
import { List } from '../../../index/list/list';
import { Add } from "./add";
import { Result } from '../../../service/result';
import * as moment from 'moment';
@Component({
    selector: 'app-adminnewsadd',
    templateUrl: './adminnewsadd.component.html',
    styleUrls: ['./adminnewsadd.component.css', '../../../../assets/css/backstage.css', '../../../../../node_modules/bootstrap/dist/css/bootstrap.min.css']
})
export class AdminnewsaddComponent implements OnInit {
    vm: Add;
    msg: string;
    list: List[];
    submitNews() {
        if (this.flag) {//add
            this.serverService.submitNews(this.vm)
                .subscribe(
                result => {
                    this.router.navigate(['/backstage/admin/adminnews/']);
                },
                error => { this.msg = error; console.log(this.msg) }
                );
        } else { //edit
            this.serverService.editNews(this.vm)
                .subscribe(
                result => {
                    this.router.navigate(['/backstage/admin/adminnews/']);
                },
                error => { this.msg = error; console.log(this.msg) }
                );
        }
    }
    cancel() {
        this.router.navigate(['/backstage/admin/adminnews/']);
    }
    getSubCateName(id) {
        for (var i = 0; i < this.subCates.length; ++i) {
            if (this.subCates[i].Id == id) {
                return this.subCates[i].SmallClassName;
            }
        }
    }
    subCates: subCategory[];
    cates: Category[];
    getSubCateList() {
        this.serverService.subCategoryEx(this.vm.BigClassID)
            .subscribe(
            result => {
                if (result.code == 0) {
                    this.subCates = result.data as subCategory[];
                    this.vm.SmallClassID = this.subCates[0].Id;
                } else {
                    console.log(result.msg);
                }
            },
            error => { this.msg = error; console.log(this.msg) }
            );
    }
    constructor(private route: ActivatedRoute,
        private serverService: ServerService,
        private router: Router,
        private http: Http) {
        let dt = moment();
        this.vm = new Add(0, 1, 1, '', dt.format('YYYY-MM-DDTHH:mm'), '', '', '');
    }

    flag: boolean = false;//true -- add , false -- edit;
    ngOnInit() {
        this.serverService.category().subscribe(result => {
            let temps = [];
            (result.data as Category[]).forEach(element => {
                if (element.Id != 7 && element.Id != 4) temps.push(element);
            });
            this.cates = temps;
            this.getSubCateList();
        });
        this.route.params.forEach((params: Params) => {
            let id = params['id'];//category id
            if (id == null) {//add 
                this.flag = true;
            } else {//edit
                this.flag = false;
                this.serverService.detailById(id)
                    .subscribe(
                    result => {
                        if (result.code == 0) {
                            let dt = result.data as Add;
                            dt.Time = moment(new Date(dt.Time)).format("YYYY-MM-DDTHH:mm");
                            this.vm = dt;
                        } else {
                            console.log(result.msg);
                        }
                    },
                    msg => { console.log(msg); }
                    )
            }
        });
    }
}
