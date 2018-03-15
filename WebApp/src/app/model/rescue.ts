export class Rescue {
    public id: number;
    public rescueTime: Date;
    public area: string;
    public note: string;
    public ship: string; // 船舶json string
    public helicopter: string; // 直升机 json string
    public apply: string; // 救助申请 upload file json string
    public images: string; // 照片 upload image files json string
    public reward: string; // 奖励 upload file json string
}

export class RescueOper {
    public rescueTime: Date;
    public area: string;
    public note: string;
    public ship: string; // 船舶json string
    public helicopter: string; // 直升机 json string
    public apply: string; // 救助申请 upload file json string
    public images: string; // 照片 upload image files json string
    public reward: string; // 奖励 upload file json string
}

export class RescueShip {
    public id: string;
    public name: string;
    public cost: number; // 日费用
    public fuelPrice: number; // 燃油价格（元/吨）
    public area: string; // 搜救海区（海事局）
    public stime: Date; // 搜救开始时间
    public etime: Date; // 搜救结束时间
    public oil: number; // 搜救耗油（吨）
    public person: number; // 搜救人数（人）
    public num: number; // 搜救船次（次）
}

export class RescueHelicopter {
    public id: string;
    public name: string;
    public cost: number; // 日费用
    public area: string; // 搜救海区（海事局）
    public stime: Date; // 搜救开始时间
    public etime: Date; // 搜救结束时间
    public person: number; // 搜救人数（人）
    public num: number; // 搜救架次（次）
}