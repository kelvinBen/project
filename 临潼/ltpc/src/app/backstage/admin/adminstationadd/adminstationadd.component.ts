import { Component, OnInit } from '@angular/core';
import { HttpModule, Http } from '@angular/http';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ServerService } from '../../../service/server.service';
import { adminStation } from '../adminstation/adminstation';
@Component({
    selector: 'app-adminstationadd',
    templateUrl: './adminstationadd.component.html',
    styleUrls: ['./adminstationadd.component.css', '../../../../assets/css/backstage.css', '../../../../../node_modules/bootstrap/dist/css/bootstrap.min.css']
})
export class AdminstationaddComponent implements OnInit {
    vm: adminStation = new adminStation();
    msg: string;
    submitUsers() {
        if (this.flag) {//add
            this.serverservice.submitUsers(this.vm)
                .subscribe(
                result => {
                    console.log(result);
                    this.router.navigate(['/backstage/admin/adminstation/']);
                },
                error => { this.msg = error; console.log(this.msg) }
                );
        } else { //edit
            this.serverservice.editUsers(this.vm)
                .subscribe(
                result => {
                    this.router.navigate(['/backstage/admin/adminstation/']);
                },
                error => { this.msg = error; console.log(this.msg) }
                );
        }
    }
    constructor(private route: ActivatedRoute, private serverservice: ServerService, private router: Router) { }

    flag: boolean = false;//true -- add , false -- edit;
    ngOnInit() {
        this.route.params.forEach((params: Params) => {
            let id = params['id'];
            if (id == null) {//add 
                this.flag = true;
            } else {//edit
                this.flag = false;
                this.serverservice.userById(id)
                    .subscribe(
                    result => {
                        if (result.code == 0) {
                            this.vm = result.data as adminStation;
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
