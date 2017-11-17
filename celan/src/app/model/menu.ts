export class SubMenu {
    public title: String;
    public link: String;
    public selected: Boolean;
}

export class MenuModel {
    public menus: SubMenu[];
    public open: Boolean;
    public title: String;
}