import { Component, OnInit, Input } from '@angular/core';
import { RouterModule, Routes } from "@angular/router";
import { LocalStorageService } from 'ng2-webstorage';
import { User } from '../../models/User';
@Component({
    selector: 'app-accordion-menu',
    templateUrl: './accordion-menu.component.html',
    styleUrls: ['./accordion-menu.component.css']
})

export class AccordionMenuComponent implements OnInit {
    constructor(private localSto: LocalStorageService) { }
    ngOnInit() {
        let usr = this.localSto.retrieve('user') as User;
        if (usr.Type == 1){//admin
            this.mDatas = this.mDatas1;
            this.seletItem = this.mDatas[0];
        }else{
            this.mDatas = this.mDatas2;
            this.seletItem = this.mDatas[0];
        }
    }

    onMenuClick(item) {
        this.seletItem = item;
    }

    onSubMenuClic(item) {
        this.subSelectItem = item;
    }
    mDatas = [];

    mDatas1 = [
        {
            name: '用户管理', routerLink: "adminstation"
        },
        {
            name: '内容管理', routerLink: "adminnews"
        },
        {
            name: '工作日志审核', routerLink: 'adminlog'
        }
    ];

    mDatas2 = [
        {
            name: '工作日志', routerLink: "stationlog"
        }
    ];

    seletItem = null;
    subSelectItem = null;
}
