export const navigation = [{
    name: '丝路预报',
    url: '/',
    icon: 'fa fa-home fa-fw',
},
{
    name: '实况监测',
    url: '/dashboard',
    icon: 'fa  fa-home fa-fw',
    badge: {
        variant: 'info',
    },
    children: [
        {
            name: '小时监测',
            url: '',
            icon: 'icon-speedometer',
        },
        {
            name: '分钟监测',
            url: '',
            icon: 'icon-speedometer',
        }
    ]
},
{
    name: '物理量诊断',
    url: '/abc',
    icon: 'fa fa-home fa-fw',
},
{
    name: '实况监测',
    url: '/dashboard',
    icon: 'fa fa-home fa-fw',
    badge: {
        variant: 'info',
    },
    children: [
        {
            name: '小时监测',
            url: '',
            icon: 'icon-speedometer',
        },
        {
            name: '分钟监测',
            url: '',
            icon: 'icon-speedometer',
        }
    ]
}
]