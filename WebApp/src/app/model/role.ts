import { User } from './user';
import { organization } from './organization';
export class Role {
    public id: number;
    public userid: number;
    public orgid: number;
    public type: number;
}

export class RoleOper {
    public userid: number;
    public orgid: number;
    public type: number;
}

export class RoleView {
    public id: number;
    public userid: number;
    public user: User;
    public orgid: number;
    public org: organization;
    public type: number;
}