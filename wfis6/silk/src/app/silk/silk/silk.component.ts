import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { SilkForcastParameter } from '../models/silk';
import { MatDialog } from '@angular/material';
//import { SilkProductComponent } from '../dialog/silk-product/silk-product.component';
import { SilkForcastComponent } from '../silk-forcast/silk-forcast.component';
import  moment from 'moment-es6';
declare var echarts: any;

@Component({
  selector: 'app-silk',
  templateUrl: './silk.component.html',
  styleUrls: ['./silk.component.css']
})
export class SilkComponent implements OnInit {
  myChart: any;
  //bmap:any;
  productDate: Date = moment().add(-1, 'days').toDate();
  forcastDate: Date = moment().add(-1, 'days').toDate();
  productType: String = 'T2mTP_CHANGE_SiLu_0to5DAY';
  productHour: String = '20';
  forcastHour: String = '08';
  echartoptions:any;
  @ViewChild('mapDiv') mapDiv: ElementRef;
  constructor(private dialog: MatDialog) { }

  ngOnInit() {
    this.createMap();
  }
  createMap() {
    this.myChart = echarts.init(this.mapDiv.nativeElement);
    this.myChart.parent = this;
    const startPoint = { x: 70.11, y: 26.657 };
    // 地图自定义样式
    const bmap = { center: [startPoint.x, startPoint.y], zoom: 5, roam: true };
    const geoCoordMap = {
      '临洮': [103.9, 35.4],
      '固原': [106.3, 36.0],
      '天水': [105.8, 34.6],
      '西安': [108.9, 34.3],
      '武威': [102.6, 37.9],
      '兰州': [103.7, 36.1],
      '西宁': [101.8, 36.6],
      '张掖': [100.4, 38.9],
      '铁卜加村': [99.6, 37.0],
      '敦煌': [94.7, 40.1],
      '玉门关': [93.9, 40.4],
      '哈密': [93.5, 42.8],
      '楼兰': [89.4, 40.2],
      '若羌': [88.2, 39.0],
      '吐鲁番': [89.2, 43.0],
      '且末': [85.5, 38.1],
      '库尔勒': [86.2, 41.7],
      '乌鲁木齐': [87.6, 43.8],
      '库车': [83.0, 41.7],
      '伊宁': [81.5, 44.0],
      '阿克苏': [80.3, 41.2],
      '和田': [79.8, 37.1],
      '叶城': [77.5, 37.9],
      '喀什': [76.0, 39.5],
      '克什米尔': [75.2, 33.7],
      '阿拉木图': [76.9, 43.2],
      '比什凯克': [74.6, 42.9],
      '奥什': [72.8, 40.5],
      '塔拉兹': [71.4, 42.9],
      '费尔干纳': [71.8, 40.4],
      '奇姆肯特': [69.6, 42.3],
      '喀布尔': [69.2, 34.5],
      '塔什干': [69.2, 41.3],
      '昆都士': [68.9, 36.7],
      '白沙瓦': [71.6, 34.0],
      '卡拉奇': [67.0, 24.9],
      '撒马尔罕': [67.0, 39.7],
      '阿拉尔斯克': [61.7, 46.8],
      '马雷': [61.8, 37.6],
      '赫拉特': [62.2, 34.3],
      '马什哈德': [59.6, 36.3],
      '德黑兰': [51.4, 35.7],
      '阿特劳': [51.9, 47.1],
      '巴格达': [44.4, 33.3],
      '泰德穆尔': [38.3, 34.6],
      '大马士革': [36.3, 33.5],
      '耶路撒冷': [35.2, 31.8],
      '开罗': [31.2, 30.0],
      '拉塔基亚': [35.8, 35.5],
      '阿达纳': [35.3, 37.0],
      '顿涅茨克': [37.8, 48.0],
      '安卡拉': [32.9, 39.9],
      '基希讷乌': [28.9, 47.0],
      '布加勒斯特': [26.1, 44.4],
      '索非亚': [23.3, 42.7],
      '伊斯坦布尔': [29.0, 41.0],
    };
    const geoCoordMap1 = {
      '上海': [121.47, 31.23],
      '天津': [117.2, 39.12],
      '舟山': [122.2, 30.0],
      '广州': [113.27, 23.13],
      '深圳': [114.05, 22.55],
      '香港': [114.08, 22.2],
      '海口': [110.32, 20.03],
      '合浦': [109.2, 21.67],
      '新加坡': [103.824, 1.35],
      '曼谷': [100.517, 13.75],
      '达卡': [90.445, 23.724],
      '斯里兰卡': [80.725, 9.21],
      '印度': [73.532, 15.98],
      '卡拉奇': [67.0, 24.9],
      '霍尔木兹海峡': [57.4, 25.88],
      '阿曼': [55.0082, 17.162],
      '索马里': [49.41, 7.15],
      '开罗': [31.2, 30.0],
      '威海': [122.39, 37.35],
      '福州市': [119.53, 25.9],
      '岘港': [108.09, 16.03],
      '荣市': [105.67, 18.677],
      '归仁': [109.19, 13.935],
      '薄寮': [105.05, 8.826],
      '宁顺': [109.0528, 11.6234],
      '达卡 ': [98.6, 5.75],
      '特里凡得琅': [77.37, 8.4],
      '阿曼湾': [59.86, 22.54],
      '吉布提': [43.15, 11.59],
    };
    const geoCoordMap2 = {
      '科伦坡(斯里兰卡)': [79.86, 6.93],
      '阿斯玛拉(厄立特里亚)': [38.91, 15.31],
      '亚的斯亚贝巴(埃塞俄比亚)': [38.7, 8.97],
      '摩加迪沙(索马里)': [45.34, 2.03],
      '吉布提(吉布提)': [43.15, 11.59],
      '艾顿(也门)': [45.03, 12.8],
      '荷台达(也门)': [42.95, 14.8],
      '萨纳(也门)': [44.19, 15.37],
      '科威特城(科威特)': [43.98, 29.37],
      '利雅得(沙特阿拉伯)': [46.71, 24.64],
      '麦纳麦(巴林)': [50.58, 26.23],
      '多哈(卡塔尔)': [51.53, 25.3],
      '马累(马尔代夫)': [73.51, 4.17],
      '加尔各答(印度)': [88.36, 22.57],
      '孟买(印度)': [72.88, 19.08],
      '雅加达(印度尼西亚)': [106.85, -6.21],
      '斯里巴加湾(文莱)': [114.93, 4.95],
      '吉隆坡(马来西亚)': [101.69, 3.14],
      '胡志明市(越南)': [106.64, 10.83],
      '金边(柬埔寨)': [104.88, 11.57],
      '仰光(缅甸)': [96.15, 16.78],
      '内比都(缅甸)': [96.1, 19.75],
      '阿布扎比(阿拉伯联合酋长国)': [54.37, 24.47],
      '开罗(埃及)': [31.23, 30.04],
      '马斯喀特(阿曼)': [58.53, 23.62],
      '达卡(孟加拉)': [90.41, 23.81],
      '新加坡(新加坡)': [103.85, 1.28],
      '阿拉木图(哈萨克斯坦)': [76.9, 43.28],
      '阿斯坦拉(哈萨克斯坦)': [71.43, 51.17],
      '塔拉兹(哈萨克斯坦)': [71.37, 42.9],
      '奇(西)姆肯特(哈萨克斯坦)': [69.6, 42.32],
      '阿拉尔斯克(科)(哈萨克斯坦)': [61.67, 46.78],
      '阿特劳(哈萨克斯坦)': [51.88, 47.12],
      '杰（热）兹卡兹甘(哈萨克斯坦)': [67.7, 47.48],
      '比什凯克(吉尔吉斯斯坦)': [74.58, 42.89],
      '奥什(吉尔吉斯斯坦)': [72.8, 40.53],
      '杜尚别(塔吉克斯坦)': [68.77, 38.54],
      '伊斯兰堡(巴基斯坦)': [73.09, 33.73],
      '卡拉奇(巴基斯坦)': [67.01, 24.86],
      '白沙瓦(巴基斯坦)': [71.58, 34.01],
      '马尔丹(巴基斯坦)': [75.05, 34.2],
      '喀布尔(阿富汗)': [69.17, 34.53],
      '坎大哈(阿富汗)': [65.68, 31.61],
      '昆都士(阿富汗)': [68.87, 36.73],
      '赫拉特(阿富汗)': [62.2, 34.34],
      '塔什干(乌兹别克斯坦)': [69.2, 41.26],
      '撒马尔罕(乌兹别克斯坦)': [66.97, 39.63],
      '费尔干纳(乌兹别克斯坦)': [71.79, 40.39],
      '阿什哈巴德(土库曼斯坦)': [58.35, 37.94],
      '马雷(土库曼斯坦)': [61.83, 37.6],
      '土库曼巴希(拉斯诺沃茨克)(土库曼斯坦)': [52.97, 40.02],
      '德黑兰(伊朗)': [51.42, 35.7],
      '马什哈德(伊朗)': [59.63, 36.27],
      '伊斯法罕(伊朗)': [51.67, 32.65],
      '安卡拉(土耳其)': [32.85, 39.92],
      '伊斯坦布尔(土耳其)': [28.97, 40.01],
      '阿达纳(土耳其)': [35.32, 37],
      '萨姆松(土耳其)': [36.33, 41.29],
      '伊兹密尔(土耳其)': [27.13, 38.42],
      '巴格达(伊拉克)': [44.42, 33.33],
      '摩苏尔(伊拉克)': [43.13, 36.34],
      '巴士拉(伊拉克)': [30.5, 47.82],
      '巴尔米拉(叙利亚)': [38.28, 34.56],
      '拉塔基亚(叙利亚)': [35.78, 35.53],
      '大马士革(叙利亚)': [36.29, 33.51],
      '安曼(约旦)': [35.95, 31.96],
      '耶路撒冷(以色列)': [35.21, 31.77],
      '基希纳乌(摩尔多瓦)': [28.92, 47.01],
      '顿涅茨克(乌克兰)': [37.8, 48.02],
      '基辅(乌克兰)': [30.52, 50.45],
      '布加勒斯特(罗马尼亚)': [26.1, 44.43],
      '康斯坦察(罗马尼亚)': [28.64, 44.17],
      '克卢日-纳波卡(罗马尼亚)': [23.58, 46.77],
      '索菲亚(保加利亚)': [23.32, 42.7],
      '贝尔格莱德(塞尔维亚)': [20.47, 44.82],
      '萨拉热窝(波黑)': [18.41, 43.87],
      '地拉那(阿尔巴尼亚)': [19.32, 41.33],
      '斯科普里(马其顿)': [21.43, 42],
      '雅典(希腊)': [23.73, 37.98],
      '尼科西亚(塞浦路斯)': [33.37, 35.17],
      '贝鲁特(黎巴嫩)': [39.5, 33.89],
      '布达佩斯(匈牙利)': [19.04, 47.5],
      '维亚纳(奥地利)': [16.38, 48.21],
      '柏林(德国)': [13.4, 52.52],
      '阿姆斯特丹(荷兰)': [4.9, 52.37],
      '莫斯科(俄罗斯)': [37.62, 55.76],
      '华沙(波兰)': [21.01, 52.22],
      '明斯克(白俄罗斯)': [27.55, 53.9],
      '巴黎(法国)': [2.35, 45.86],
      '伦敦(英国)': [0, 51.51],
      '布拉格(捷克)': [14.44, 50.07],
      '布拉迪斯拉发(斯洛伐克)': [17.11, 48.15],
      '罗马(意大利)': [12.51, 41.9],
      '曼谷(泰国)': [100.52, 13.73]
    };

    const silkMap = [
      { name: '西安', n: 'SL002', p: 'XiAn' },
      { name: '固原', n: 'SL003', p: 'GuYuan' },
      { name: '天水', n: 'SL004', p: 'TianShui' },
      { name: '临洮', n: 'SL005', p: 'LinTao' },
      { name: '兰州', n: 'SL006', p: 'LanZhou' },
      { name: '武威', n: 'SL007', p: 'WuWei' },
      { name: '西宁', n: 'SL008', p: 'XiNing' },
      { name: '张掖', n: 'SL009', p: 'ZhangYe' },
      { name: '铁卜加村', n: 'SL0010', p: 'FusiCheng' },
      { name: '敦煌', n: 'SL011', p: 'DunHuang' },
      { name: '玉门关', n: 'SL012', p: 'YumenGuan' },
      { name: '哈密', n: 'SL013', p: 'HaMi' },
      { name: '吐鲁番', n: 'SL014', p: 'Tulufan' },
      { name: '楼兰', n: 'SL015', p: 'LouLan' },
      { name: '若羌', n: 'SL016', p: 'RuoQiang' },
      { name: '且末', n: 'SL017', p: 'QieMo' },
      { name: '库尔勒', n: 'SL018', p: 'KuerLe' },
      { name: '乌鲁木齐', n: 'SL019', p: 'WulumuQi' },
      { name: '库车', n: 'SL020', p: 'KuChe' },
      { name: '伊宁', n: 'SL021', p: 'YiNing' },
      { name: '阿克苏', n: 'SL022', p: 'AkeSu' },
      { name: '和田', n: 'SL023', p: 'HeTian' },
      { name: '叶城', n: 'SL024', p: 'YeCheng' },
      { name: '克什米尔', n: 'SL025', p: 'KeshimiEr' },
      { name: '喀什', n: 'SL026', p: 'KaShi' },
      { name: '阿拉木图', n: 'SL027', p: 'AlamuTu' },
      { name: '比什凯克', n: 'SL028', p: 'BishikaiKe' },
      { name: '奥什', n: 'SL029', p: 'AoShi' },
      { name: '塔拉兹', n: 'SL030', p: 'TalaZi' },
      { name: '费尔干纳', n: 'SL031', p: 'FeierganNa' },
      { name: '奇姆肯特', n: 'SL032', p: 'XimukenTe' },
      { name: '塔什干', n: 'SL033', p: 'TashiGan' },
      { name: '昆都士', n: 'SL034', p: 'KunduShi' },
      { name: '喀布尔', n: 'SL035', p: 'KabuEr' },
      { name: '白沙瓦', n: 'SL036', p: 'BaishaWa' },
      { name: '卡拉奇', n: 'SL037', p: 'KalaQi' },
      { name: '撒马尔罕', n: 'SL038', p: 'SamaerHan' },
      { name: '阿拉尔斯克', n: 'SL039', p: 'AlaersiKe' },
      { name: '马雷', n: 'SL040', p: 'MaLei' },
      { name: '赫拉特', n: 'SL041', p: 'HelaTe' },
      { name: '马什哈德', n: 'SL042', p: 'MashihaDe' },
      { name: '德黑兰', n: 'SL043', p: 'DeheiLan' },
      { name: '阿特劳', n: 'SL044', p: 'AteLao' },
      { name: '巴格达', n: 'SL045', p: 'BageDa' },
      { name: '泰德穆尔', n: 'SL046', p: 'BaermiLa' },
      { name: '大马士革', n: 'SL047', p: 'DamashiGe' },
      { name: '耶路撒冷', n: 'SL048', p: 'YelusaLeng' },
      { name: '开罗', n: 'SL049', p: 'KaiLuo' },
      { name: '拉塔基亚', n: 'SL050', p: 'LatajiYa' },
      { name: '阿达纳', n: 'SL051', p: 'AdaNa' },
      { name: '顿涅茨克', n: 'SL052', p: 'DunnieciKe' },
      { name: '安卡拉', n: 'SL053', p: 'AnkaLa' },
      { name: '基希讷乌', n: 'SL054', p: 'JixineWu' },
      { name: '布加勒斯特', n: 'SL055', p: 'BujialesiTe' },
      { name: '索非亚', n: 'SL056', p: 'SuofeiYa' },
      { name: '伊斯坦布尔', n: 'SL057', p: 'YisitanbuEr' },
    ];

    const seaSilkMap = [
      { name: '上海' },
      { name: '天津' },
      { name: '舟山' },
      { name: '香港' },
      { name: '海口' },
      { name: '合浦' },
      { name: '新加坡' },
      { name: '曼谷' },
      { name: '达卡' },
      { name: '斯里兰卡' },
      { name: '印度' },
      { name: '卡拉奇' },
      { name: '霍尔木兹海峡' },
      { name: '阿曼' },
      { name: '索马里' },
      { name: '开罗' },
      { name: '威海' },
      { name: '特里凡得琅' },
      { name: '福州市' }
    ];

    const forcastSilkMap = [
      { name: '阿拉木图(哈萨克斯坦)', n: '36870', t: '1' },
      { name: '阿斯坦拉(哈萨克斯坦)', n: '35188', t: '1' },
      { name: '塔拉兹(哈萨克斯坦)', n: '38341', t: '1' },
      { name: '奇(西)姆肯特(哈萨克斯坦)', n: '38328', t: '1' },
      { name: '阿拉尔斯克(科)(哈萨克斯坦)', n: '35746', t: '1' },
      { name: '阿特劳(哈萨克斯坦)', n: '35700', t: '1' },
      { name: '杰（热）兹卡兹甘(哈萨克斯坦)', n: '35671', t: '1' },
      { name: '比什凯克(吉尔吉斯斯坦)', n: '38353', t: '1' },
      { name: '奥什(吉尔吉斯斯坦)', n: '38616', t: '1' },
      { name: '杜尚别(塔吉克斯坦)', n: '38836', t: '1' },
      { name: '伊斯兰堡(巴基斯坦)', n: '41577', t: '1' },
      { name: '卡拉奇(巴基斯坦)', n: '41782', t: '1' },
      { name: '白沙瓦(巴基斯坦)', n: '41529', t: '1' },
      { name: '马尔丹(巴基斯坦)', n: '42027', t: '1' },
      { name: '喀布尔(阿富汗)', n: '40948', t: '1' },
      { name: '坎大哈(阿富汗)', n: '40990', t: '1' },
      { name: '昆都士(阿富汗)', n: '40913', t: '1' },
      { name: '赫拉特(阿富汗)', n: '40938', t: '1' },
      { name: '塔什干(乌兹别克斯坦)', n: '38457', t: '1' },
      { name: '撒马尔罕(乌兹别克斯坦)', n: '38696', t: '1' },
      { name: '费尔干纳(乌兹别克斯坦)', n: '38618', t: '1' },
      { name: '阿什哈巴德(土库曼斯坦)', n: '38880', t: '1' },
      { name: '马雷(土库曼斯坦)', n: '38895', t: '1' },
      { name: '土库曼巴希(拉斯诺沃茨克)(土库曼斯坦)', n: '38507', t: '1' },
      { name: '德黑兰(伊朗)', n: '40754', t: '1' },
      { name: '马什哈德(伊朗)', n: '40745', t: '1' },
      { name: '伊斯法罕(伊朗)', n: '40800', t: '1' },
      { name: '安卡拉(土耳其)', n: '17130', t: '1' },
      { name: '伊斯坦布尔(土耳其)', n: '17116', t: '1' },
      { name: '阿达纳(土耳其)', n: '17352', t: '1' },
      { name: '萨姆松(土耳其)', n: '17029', t: '1' },
      { name: '伊兹密尔(土耳其)', n: '17220', t: '1' },
      { name: '巴格达(伊拉克)', n: '40650', t: '1' },
      { name: '摩苏尔(伊拉克)', n: '40608', t: '1' },
      { name: '巴士拉(伊拉克)', n: '33761', t: '1' },
      { name: '巴尔米拉(叙利亚)', n: '40061', t: '1' },
      { name: '拉塔基亚(叙利亚)', n: '40022', t: '1' },
      { name: '大马士革(叙利亚)', n: '40080', t: '1' },
      { name: '安曼(约旦)', n: '40270', t: '1' },
      { name: '耶路撒冷(以色列)', n: '40183', t: '1' },
      { name: '基希纳乌(摩尔多瓦)', n: '33815', t: '1' },
      { name: '顿涅茨克(乌克兰)', n: '34519', t: '1' },
      { name: '基辅(乌克兰)', n: '33345', t: '1' },
      { name: '布加勒斯特(罗马尼亚)', n: '15422', t: '1' },
      { name: '康斯坦察(罗马尼亚)', n: '15480', t: '1' },
      { name: '克卢日-纳波卡(罗马尼亚)', n: '15120', t: '1' },
      { name: '索菲亚(保加利亚)', n: '15614', t: '1' },
      { name: '贝尔格莱德(塞尔维亚)', n: '13274', t: '1' },
      { name: '萨拉热窝(波黑)', n: '14654', t: '1' },
      { name: '地拉那(阿尔巴尼亚)', n: '13611', t: '1' },
      { name: '斯科普里(马其顿)', n: '13588', t: '1' },
      { name: '雅典(希腊)', n: '16701', t: '1' },
      { name: '尼科西亚(塞浦路斯)', n: '17607', t: '1' },
      { name: '贝鲁特(黎巴嫩)', n: '40643', t: '1' },
      { name: '布达佩斯(匈牙利)', n: '12844', t: '1' },
      { name: '维亚纳(奥地利)', n: '11034', t: '1' },
      { name: '柏林(德国)', n: '10384', t: '1' },
      { name: '阿姆斯特丹(荷兰)', n: '6240', t: '1' },
      { name: '莫斯科(俄罗斯)', n: '27612', t: '1' },
      { name: '华沙(波兰)', n: '12372', t: '1' },
      { name: '明斯克(白俄罗斯)', n: '26850', t: '1' },
      { name: '巴黎(法国)', n: '7361', t: '1' },
      { name: '伦敦(英国)', n: '3770', t: '1' },
      { name: '布拉格(捷克)', n: '11520', t: '1' },
      { name: '布拉迪斯拉发(斯洛伐克)', n: '11816', t: '1' },
      { name: '罗马(意大利)', n: '16235', t: '1' },
      { name: '曼谷(泰国)', n: '48455', t: '1' },
      { name: '新加坡(新加坡)', n: '48694', t: '1' },
      { name: '达卡(孟加拉)', n: '41922', t: '1' },
      { name: '马斯喀特(阿曼)', n: '41258', t: '1' },
      { name: '开罗(埃及)', n: '62375', t: '1' },
      { name: '阿布扎比(阿拉伯联合酋长国)', n: '41216', t: '1' },
      { name: '内比都(缅甸)', n: '48074', t: '1' },
      { name: '仰光(缅甸)', n: '48097', t: '1' },
      { name: '金边(柬埔寨)', n: '48991', t: '1' },
      { name: '胡志明市(越南)', n: '48900', t: '1' },
      { name: '吉隆坡(马来西亚)', n: '48648', t: '1' },
      { name: '斯里巴加湾(文莱)', n: '96315', t: '1' },
      { name: '雅加达(印度尼西亚)', n: '96745', t: '1' },
      { name: '孟买(印度)', n: '43003', t: '1' },
      { name: '加尔各答(印度)', n: '42807', t: '1' },
      { name: '马累(马尔代夫)', n: '43555', t: '1' },
      { name: '多哈(卡塔尔)', n: '41168', t: '1' },
      { name: '麦纳麦(巴林)', n: '41150', t: '1' },
      { name: '利雅得(沙特阿拉伯)', n: '40438', t: '1' },
      { name: '科威特城(科威特)', n: '40362', t: '1' },
      { name: '萨纳(也门)', n: '41404', t: '1' },
      { name: '荷台达(也门)', n: '41431', t: '1' },
      { name: '艾顿(也门)', n: '41480', t: '1' },
      { name: '吉布提(吉布提)', n: '63125', t: '1' },
      { name: '摩加迪沙(索马里)', n: '63260', t: '1' },
      { name: '亚的斯亚贝巴(埃塞俄比亚)', n: '63450', t: '1' },
      { name: '阿斯玛拉(厄立特里亚)', n: '63021', t: '1' },
      { name: '科伦坡(斯里兰卡)', n: '43466', t: '1' }
    ];

    const landData = [
      [{ name: '西安' }, { name: '固原' }],
      [{ name: '西安' }, { name: '天水' }],
      [{ name: '天水' }, { name: '临洮' }],
      [{ name: '兰州' }, { name: '武威' }],
      [{ name: '固原' }, { name: '武威' }],
      [{ name: '临洮' }, { name: '兰州' }],
      [{ name: '临洮' }, { name: '西宁' }],
      [{ name: '武威' }, { name: '张掖' }],
      [{ name: '张掖' }, { name: '敦煌' }],
      [{ name: '西宁' }, { name: '铁卜加村' }],
      [{ name: '铁卜加村' }, { name: '敦煌' }],
      [{ name: '敦煌' }, { name: '玉门关' }],
      [{ name: '玉门关' }, { name: '哈密' }],
      [{ name: '敦煌' }, { name: '楼兰' }],
      [{ name: '敦煌' }, { name: '若羌' }],
      [{ name: '楼兰' }, { name: '若羌' }],
      [{ name: '楼兰' }, { name: '吐鲁番' }],
      [{ name: '哈密' }, { name: '吐鲁番' }],
      [{ name: '吐鲁番' }, { name: '乌鲁木齐' }],
      [{ name: '乌鲁木齐' }, { name: '伊宁' }],
      [{ name: '吐鲁番' }, { name: '库尔勒' }],
      [{ name: '楼兰' }, { name: '库尔勒' }],
      [{ name: '库尔勒' }, { name: '库车' }],
      [{ name: '库车' }, { name: '阿克苏' }],
      [{ name: '若羌' }, { name: '且末' }],
      [{ name: '且末' }, { name: '和田' }],
      [{ name: '和田' }, { name: '叶城' }],
      [{ name: '阿克苏' }, { name: '喀什' }],
      [{ name: '和田' }, { name: '克什米尔' }],
      [{ name: '伊宁' }, { name: '阿拉木图' }],
      [{ name: '阿拉木图' }, { name: '比什凯克' }],
      [{ name: '喀什' }, { name: '奥什' }],
      [{ name: '奥什' }, { name: '费尔干纳' }],
      [{ name: '比什凯克' }, { name: '塔拉兹' }],
      [{ name: '塔拉兹' }, { name: '奇姆肯特' }],
      [{ name: '奇姆肯特' }, { name: '塔什干' }],
      [{ name: '奇姆肯特' }, { name: '阿拉尔斯克' }],
      [{ name: '塔什干' }, { name: '撒马尔罕' }],
      [{ name: '费尔干纳' }, { name: '塔什干' }],
      [{ name: '克什米尔' }, { name: '白沙瓦' }],
      [{ name: '叶城' }, { name: '昆都士' }],
      [{ name: '叶城' }, { name: '白沙瓦' }],
      [{ name: '白沙瓦' }, { name: '卡拉奇' }],
      [{ name: '白沙瓦' }, { name: '喀布尔' }],
      [{ name: '昆都士' }, { name: '赫拉特' }],
      [{ name: '喀布尔' }, { name: '赫拉特' }],
      [{ name: '撒马尔罕' }, { name: '马雷' }],
      [{ name: '马雷' }, { name: '马什哈德' }],
      [{ name: '赫拉特' }, { name: '马什哈德' }],
      [{ name: '马什哈德' }, { name: '德黑兰' }],
      [{ name: '德黑兰' }, { name: '巴格达' }],
      [{ name: '巴格达' }, { name: '泰德穆尔' }],
      [{ name: '泰德穆尔' }, { name: '大马士革' }],
      [{ name: '泰德穆尔' }, { name: '拉塔基亚' }],
      [{ name: '拉塔基亚' }, { name: '阿达纳' }],
      [{ name: '大马士革' }, { name: '耶路撒冷' }],
      [{ name: '耶路撒冷' }, { name: '开罗' }],
      [{ name: '阿达纳' }, { name: '安卡拉' }],
      [{ name: '安卡拉' }, { name: '伊斯坦布尔' }],
      [{ name: '索非亚' }, { name: '伊斯坦布尔' }],
      [{ name: '布加勒斯特' }, { name: '索非亚' }],
      [{ name: '基希讷乌' }, { name: '布加勒斯特' }],
      [{ name: '顿涅茨克' }, { name: '基希讷乌' }],
      [{ name: '阿特劳' }, { name: '顿涅茨克' }],
      [{ name: '阿拉尔斯克' }, { name: '阿特劳' }]
    ];

    const seaData = [
      [{ name: '天津' }, { name: '威海' }],
      [{ name: '威海' }, { name: '上海' }],
      [{ name: '上海' }, { name: '舟山' }],
      [{ name: '舟山' }, { name: '福州市' }],
      [{ name: '福州市' }, { name: '香港' }],
      [{ name: '香港' }, { name: '海口' }],
      [{ name: '海口' }, { name: '合浦' }],
      [{ name: '合浦' }, { name: '荣市' }],
      [{ name: '荣市' }, { name: '岘港' }],
      [{ name: '岘港' }, { name: '归仁' }],
      [{ name: '归仁' }, { name: '宁顺' }],
      [{ name: '宁顺' }, { name: '薄寮' }],
      [{ name: '薄寮' }, { name: '曼谷' }],
      [{ name: '宁顺' }, { name: '新加坡' }],
      [{ name: '达卡 ' }, { name: '达卡' }],
      [{ name: '达卡' }, { name: '斯里兰卡' }],
      [{ name: '达卡 ' }, { name: '斯里兰卡' }],
      [{ name: '新加坡' }, { name: '达卡 ' }],
      [{ name: '斯里兰卡' }, { name: '特里凡得琅' }],
      [{ name: '特里凡得琅' }, { name: '印度' }],
      [{ name: '印度' }, { name: '卡拉奇' }],
      [{ name: '卡拉奇' }, { name: '霍尔木兹海峡' }],
      [{ name: '霍尔木兹海峡' }, { name: '阿曼湾' }],
      [{ name: '阿曼湾' }, { name: '阿曼' }],
      [{ name: '阿曼' }, { name: '吉布提' }],
      [{ name: '阿曼' }, { name: '索马里' }],
      [{ name: '吉布提' }, { name: '开罗' }]
    ];
    const convertData = function () {
      const res = [];
      for (let i = 0; i < landData.length; i++) {
        const dataItem = landData[i];
        const fromCoord = geoCoordMap[dataItem[0].name];
        const toCoord = geoCoordMap[dataItem[1].name];
        if (fromCoord && toCoord) {
          res.push({
            fromName: dataItem[0].name,
            toName: dataItem[1].name,
            coords: [fromCoord, toCoord]
          });
        }
      }
      return res;
    };
    const convertPoint = function () {
      const res = [];
      for (let i = 0; i < silkMap.length; i++) {
        const obj = silkMap[i];
        res.push({
          name: obj.name,
          value: geoCoordMap[obj.name],
          n: obj.n,
          p: obj.p
        });
      }

      return res;
    };

    const convertSeaData = function () {
      const res = [];
      for (let i = 0; i < seaData.length; i++) {
        const dataItem = seaData[i];
        const fromCoord = geoCoordMap1[dataItem[0].name];
        const toCoord = geoCoordMap1[dataItem[1].name];
        if (fromCoord && toCoord) {
          res.push({
            fromName: dataItem[0].name,
            toName: dataItem[1].name,
            coords: [fromCoord, toCoord]
          });
        }
      }
      return res;
    };
    const convertSeaPoint = function () {
      const res = [];
      for (let i = 0; i < seaSilkMap.length; i++) {
        const obj = seaSilkMap[i];
        res.push({
          name: obj.name,
          value: geoCoordMap1[obj.name],
          n: null,
          p: null
        });
      }

      return res;
    };
    const convertForcastPoint = function () {
      const res = [];
      for (let i = 0; i < forcastSilkMap.length; i++) {
        const obj = forcastSilkMap[i];
        res.push({
          name: obj.name,
          value: geoCoordMap2[obj.name],
          n: obj.n,
          p: null,
          t: obj.t
        });
      }

      return res;
    };

    const series = [];
    series.push({
      name: '陆地丝绸之路',
      type: 'lines',
      coordinateSystem: 'bmap',
      zlevel: 2,
      effect: {
        show: true,
        period: 2,
        trailLength: 0,
        symbol: 'arrow',
        symbolSize: 10
      },
      lineStyle: {
        normal: {
          color: 'orange',
          width: 2,
          opacity: 1,
          curveness: 0.2
        }
      },
      data: convertData()
    }, {
        type: 'effectScatter',
        coordinateSystem: 'bmap',
        zlevel: 2,
        rippleEffect: {
          period: 4,
          scale: 2.5,
          brushType: 'stroke'
        },
        label: {
          normal: {
            show: false,
            color: '#000',
            position: 'right',
            formatter: '{b}'
          }
        },
        symbolSize: 7,
        itemStyle: {
          normal: {
            color: 'orange',
            borderColor: 'gold'
          }
        },
        data: convertPoint()
      }, {
        name: '海上丝绸之路',
        type: 'lines',
        coordinateSystem: 'bmap',
        zlevel: 2,
        effect: {
          show: true,
          period: 2,
          trailLength: 0,
          symbol: 'arrow',
          symbolSize: 10
        },
        lineStyle: {
          normal: {
            color: 'blue',
            width: 2,
            opacity: 1,
            curveness: 0.2
          }
        },
        data: convertSeaData()
      }, {
        type: 'effectScatter',
        coordinateSystem: 'bmap',
        zlevel: 3,
        rippleEffect: {
          period: 4,
          scale: 2.5,
          brushType: 'stroke'
        },
        symbolSize: 7,
        itemStyle: {
          normal: {
            color: 'blue',
            borderColor: 'gold'
          }
        },
        data: convertSeaPoint()
      }, {
        type: 'scatter',
        coordinateSystem: 'bmap',
        zlevel: 4,
        symbol: 'path://M738.846518 638.07644S580.361971 758.301616 525.039991 951.806771h-38.09769c-55.32505-193.505156-213.81983-313.730331-213.81983-313.730331-128.644939-131.448798-128.644939-344.685343 0-476.134141 128.694057-131.514289 337.111854-131.514289 465.756793 0 128.723733 131.448798 128.723733 344.685343-0.032746 476.134141z',
        symbolSize: [15, 20],
        itemStyle: {
          normal: {
            color: '#0ff',
            borderColor: '#87cefa'
          }
        },
        data: convertForcastPoint()
      });

    this.echartoptions = {
      bmap: bmap,
      color: ['gold', 'aqua', 'lime'],
      //backgroundColor: '#404a59',
      title: {
        text: '',
        subtext: '',
        left: 'center',
        textStyle: {
          color: '#fff'
        }
      },
      tooltip: {
        trigger: 'item'
      },
      legend: {
        show: false
      },
      geo: {
        map: 'bmap',
        polyline: true,
        progressiveThreshold: 500,
        progressive: 200,
        label: {
          emphasis: {
            show: false
          }
        },
        roam: true,
        itemStyle: {
          normal: {
            areaColor: '#323c48',
            borderColor: '#404a59'
          },
          emphasis: {
            areaColor: '#2a333d'
          }
        }
      },
      series: series
    };
    this.myChart.setOption(this.echartoptions);
    
    this.myChart.on('click', function (param) {
      const n = param.data.n;
      const p = param.data.p;
      const t = param.data.t;
      const na = param.data.name;
      if (n && p && !t) {
        this.parent.showProduct(n, p);
      } else if (n && t && !p) { // 七日天气预报
        this.parent.showForcast(n, na);
      }

    });
  }


  // showProduct(num: string, pname: string) {
  //   let imgUrl = 'http://10.172.99.100:8080/JXHFX/' + this.productHour + 'H/EC_thin/' + this.productType + '/';
  //   imgUrl += moment(this.productDate).format('YYMMDD') + this.productHour + '/' + moment(this.productDate).format('YYMMDD');
  //   imgUrl += this.productHour + '_' + pname + '_' + num + '.png';
  //   this.dialog.open(SilkProductComponent, {
  //     data: imgUrl
  //   });
  // }

  showForcast(id: string, name: string) {
    const par = new SilkForcastParameter();
    par.name = name;
    par.id = id;
    par.time = moment(this.forcastDate).format('YYYYMMDD') + this.forcastHour;
    this.dialog.open(SilkForcastComponent, { data: par, panelClass: 'myapp-no-padding-dialog' });
  }
}
