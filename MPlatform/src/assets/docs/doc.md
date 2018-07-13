#7天天气预报
**简要描述：** 

- 7天天气预报数据


**请求URL：** 
- `http://api.extraweather.com/api/weather/forecast`

  
**请求方式：**
- GET 

**参数：** 

|参数	|描述	|选择	|示例值
| ------------ | ------------ | ------------ | ------------ |
|location|需要查询的城市或地区，可输入以下值：</br>1. 城市ID：城市列表</br>2. 经纬度格式：经度,纬度（经度在前纬度在后，英文,分隔，十进制格式，北纬东经为正，南纬西经为负</br>3. 城市名称，支持中英文和汉语拼音</br>4. 城市名称，上级城市 或 省 或 国家，英文,分隔，此方式可以在重名的情况下只获取想要的地区的天气数据，例如 西安,陕西|必选|1. location=CN101010100</br>2. location=116.40,39.9</br>3. location=北京、 location=北京市、 location=beijing</br>4. location=朝阳,北京、 location=chaoyang,beijing|
|userid|用户ID，登录控制台可查看|必选|userid=YM2018061513064060050
|t|时间戳，秒级|必选|t=1477455132|
|appkey|数字签名，签名算法|必选|appkey=a0092325de742635309f09fcc6|


返回字段和数值说明
location 基础信息

|参数	|描述|	示例值|
| ------------ | ------------ | ------------ | ------------ |
|cnname|	地区／城市名称	|卓资|
|cid|	地区／城市ID	|CN101080402|
|lat	|地区／城市纬度	|40.89576|
|lon	|地区／城市经度	|112.577702|
|cnparent	|该地区／城市的上级城市|	乌兰察布|
|cnprovince|	该地区／城市所属行政区域|	内蒙古|
|cncountry	|该地区／城市所属国家名称|	中国|


daily_forecast 天气预报

|参数	|描述	|示例值|
| - | - | - |
|forecastdate	|预报日期	|2013-12-30|
|daytemp|	最高温度|	4|
|nighttemp	|最低温度|	-5|
|cond_code_n|	晚间天气状况描述	|晴|
|nightwesc	|晚间天气状况描述	|晴|
|daydirect	|风向	|西北风|
|daypower	|风力|	1-2|

satuts 接口状态

|参数	|描述	|示例值|
| - | - | - |
|errcode|	接口状态，具体含义请参考接口状态码及错误码|	ok|

 **返回示例**
``` 
{
    "errcode": 0,
    "errmsg": "成功",
    "data": {
        "location": {
            "cncountry": "中国",
            "cnname": "安庆",
            "cnparent": "安庆",
            "lon": "117.043551",
            "lat": "30.50883",
            "cid": "CN101220601"
        },
        "daily_forecast": [
            {
                "pubtime": "2018-06-15 00:00:00",
                "daywdesc": "晴",
                "daytemp": "31℃",
                "daydirect": "东北风",
                "daypower": "3~4级",
                "nightwdesc": "多云",
                "nighttemp": "23℃",
                "nightdirect": "东风",
                "nightpower": "微风",
                "forecastdate": "2018-07-14 16:00:00"
            },
            {
                "pubtime": "2018-06-15 00:00:00",
                "daywdesc": "多云",
                "daytemp": "30℃",
                "daydirect": "东风",
                "daypower": "微风",
                "nightwdesc": "多云",
                "nighttemp": "22℃",
                "nightdirect": "东南风",
                "nightpower": "微风",
                "forecastdate": "2018-06-15 16:00:00"
            },
            {
                "pubtime": "2018-06-15 00:00:00",
                "daywdesc": "多云",
                "daytemp": "30℃",
                "daydirect": "东南风",
                "daypower": "微风",
                "nightwdesc": "多云",
                "nighttemp": "24℃",
                "nightdirect": "东南风",
                "nightpower": "微风",
                "forecastdate": "2018-06-16 16:00:00"
            },
            {
                "pubtime": "2018-06-15 00:00:00",
                "daywdesc": "小雨",
                "daytemp": "30℃",
                "daydirect": "东北风",
                "daypower": "微风",
                "nightwdesc": "小雨",
                "nighttemp": "22℃",
                "nightdirect": "东北风",
                "nightpower": "微风",
                "forecastdate": "2018-06-17 16:00:00"
            },
            {
                "pubtime": "2018-06-15 00:00:00",
                "daywdesc": "大雨",
                "daytemp": "28℃",
                "daydirect": "东北风",
                "daypower": "3~4级",
                "nightwdesc": "小雨",
                "nighttemp": "22℃",
                "nightdirect": "东北风",
                "nightpower": "微风",
                "forecastdate": "2018-06-18 16:00:00"
            },
            {
                "pubtime": "2018-06-15 00:00:00",
                "daywdesc": "中雨",
                "daytemp": "27℃",
                "daydirect": "东北风",
                "daypower": "微风",
                "nightwdesc": "小雨",
                "nighttemp": "23℃",
                "nightdirect": "东北风",
                "nightpower": "微风",
                "forecastdate": "2018-06-19 16:00:00"
            },
            {
                "pubtime": "2018-06-15 00:00:00",
                "daywdesc": "小雨",
                "daytemp": "27℃",
                "daydirect": "东风",
                "daypower": "微风",
                "nightwdesc": "中雨",
                "nighttemp": "24℃",
                "nightdirect": "东北风",
                "nightpower": "微风",
                "forecastdate": "2018-06-20 16:00:00"
            }
        ]
    }
}

```
 **返回参数说明** 

无

 **备注** 


#逐3小时天气预报
    
**简要描述：** 

- 3小时预报数据

**请求URL：** 
- ` http://api.extraweather.com/weather/hourly `
  
**请求方式：**
- GET 

**参数：** 

|参数名|必选|类型|说明|
|:----    |:---|:----- |-----   |
|location|需要查询的城市或地区，可输入以下值：</br>1. 城市ID：城市列表</br>2. 经纬度格式：经度,纬度（经度在前纬度在后，英文,分隔，十进制格式，北纬东经为正，南纬西经为负</br>3. 城市名称，支持中英文和汉语拼音</br>4. 城市名称，上级城市 或 省 或 国家，英文,分隔，此方式可以在重名的情况下只获取想要的地区的天气数据，例如 西安,陕西|必选|1. location=CN101010100</br>2. location=116.40,39.9</br>3. location=北京、 location=北京市、 location=beijing</br>4. location=朝阳,北京、 location=chaoyang,beijing|
|userid|用户ID，登录控制台可查看|必选|userid=YM2018061513064060050
|t|时间戳，秒级|必选|t=1477455132|
|appkey|数字签名，签名算法|必选|appkey=a0092325de742635309f09fcc6|

返回字段和数值说明
location 基础信息

|参数	|描述|	示例值|
| ------------ | ------------ | ------------ | ------------ |
|cnname|	地区／城市名称	|卓资|
|cid|	地区／城市ID	|CN101080402|
|lat	|地区／城市纬度	|40.89576|
|lon	|地区／城市经度	|112.577702|
|cnparent	|该地区／城市的上级城市|	乌兰察布|
|cnprovince|	该地区／城市所属行政区域|	内蒙古|
|cncountry	|该地区／城市所属国家名称|	中国|

hourly 天气预报

|参数	|描述	|示例值|
| - | - | - |
|forecasttime	|预报日期	|2018-06-15 06:00:00|
|windd|	风向|	南风|
|tqxx	|天气现象|	-5|
|yl|	云量	|80%|
|winds	|风速	|1.6米/秒|
|xdsd	|相对湿度	|35.3%|
|qy	|气压|	888.1hPa|
|js	|降水|	无降水|
|njd	|能见度|	-|
|wd	|气温|	32.3℃|

satuts 接口状态

|参数	|描述	|示例值|
| - | - | - |
|errcode|	接口状态，具体含义请参考接口状态码及错误码|	ok|

 **返回示例**

``` 
{
    "errcode": 0,
    "errmsg": "成功",
    "data": {
        "location": {
            "cncountry": "中国",
            "cnname": "西安",
            "cnparent": "西安",
            "cnprovince": "陕西",
            "lon": "108.948024",
            "lat": "34.263161",
            "cid": "CN101110101"
        },
        "hourly": [
            {
                "forecasttime": "2018-06-15 06:00:00",
                "windd": "南风",
                "tqxx": "",
                "yl": "80%",
                "winds": "1.6米/秒",
                "xdsd": "35.3%",
                "qy": "888.1hPa",
                "js": "无降水",
                "njd": "-",
                "wd": "32.3℃"
            },
            {
                "forecasttime": "2018-06-15 09:00:00",
                "windd": "南风",
                "tqxx": "",
                "yl": "84.6%",
                "winds": "2米/秒",
                "xdsd": "25%",
                "qy": "886.7hPa",
                "js": "无降水",
                "njd": "-",
                "wd": "35.3℃"
            },
            {
                "forecasttime": "2018-06-15 12:00:00",
                "windd": "南风",
                "tqxx": "",
                "yl": "89.6%",
                "winds": "2.4米/秒",
                "xdsd": "22.3%",
                "qy": "886hPa",
                "js": "无降水",
                "njd": "-",
                "wd": "35.6℃"
            },
            {
                "forecasttime": "2018-06-15 15:00:00",
                "windd": "南风",
                "tqxx": "",
                "yl": "100%",
                "winds": "2.2米/秒",
                "xdsd": "32.6%",
                "qy": "886.7hPa",
                "js": "无降水",
                "njd": "-",
                "wd": "31.5℃"
            },
            {
                "forecasttime": "2018-06-15 18:00:00",
                "windd": "西南风",
                "tqxx": "",
                "yl": "98.1%",
                "winds": "1.6米/秒",
                "xdsd": "48.7%",
                "qy": "888.1hPa",
                "js": "无降水",
                "njd": "-",
                "wd": "28.5℃"
            },
            {
                "forecasttime": "2018-06-15 21:00:00",
                "windd": "西南风",
                "tqxx": "",
                "yl": "99%",
                "winds": "1.3米/秒",
                "xdsd": "56.5%",
                "qy": "887.5hPa",
                "js": "无降水",
                "njd": "-",
                "wd": "25.8℃"
            },
            {
                "forecasttime": "2018-06-16 00:00:00",
                "windd": "西风",
                "tqxx": "",
                "yl": "100%",
                "winds": "1.3米/秒",
                "xdsd": "64.7%",
                "qy": "887.3hPa",
                "js": "无降水",
                "njd": "-",
                "wd": "24.1℃"
            },
            {
                "forecasttime": "2018-06-16 00:00:00",
                "windd": "风向",
                "tqxx": "天气现象",
                "yl": "云量",
                "winds": "风速",
                "xdsd": "相对湿度",
                "qy": "气压",
                "js": "降水",
                "njd": "能见度",
                "wd": "气温"
            },
            {
                "forecasttime": "2018-06-16 03:00:00",
                "windd": "西南风",
                "tqxx": "",
                "yl": "98.9%",
                "winds": "0.5米/秒",
                "xdsd": "75.8%",
                "qy": "888.1hPa",
                "js": "无降水",
                "njd": "-",
                "wd": "23.1℃"
            },
            {
                "forecasttime": "2018-06-16 06:00:00",
                "windd": "南风",
                "tqxx": "",
                "yl": "99.9%",
                "winds": "1.1米/秒",
                "xdsd": "51.4%",
                "qy": "888.4hPa",
                "js": "1.4毫米",
                "njd": "-",
                "wd": "29.3℃"
            },
            {
                "forecasttime": "2018-06-16 09:00:00",
                "windd": "南风",
                "tqxx": "",
                "yl": "100%",
                "winds": "1.3米/秒",
                "xdsd": "67.8%",
                "qy": "886.7hPa",
                "js": "0.9毫米",
                "njd": "-",
                "wd": "30.1℃"
            },
            {
                "forecasttime": "2018-06-16 12:00:00",
                "windd": "东南风",
                "tqxx": "",
                "yl": "75.5%",
                "winds": "1.8米/秒",
                "xdsd": "63.3%",
                "qy": "885.3hPa",
                "js": "0.3毫米",
                "njd": "-",
                "wd": "29.3℃"
            },
            {
                "forecasttime": "2018-06-16 15:00:00",
                "windd": "东风",
                "tqxx": "",
                "yl": "85%",
                "winds": "1.1米/秒",
                "xdsd": "67.9%",
                "qy": "885.6hPa",
                "js": "0.1毫米",
                "njd": "-",
                "wd": "25.1℃"
            },
            {
                "forecasttime": "2018-06-16 18:00:00",
                "windd": "东风",
                "tqxx": "",
                "yl": "79.9%",
                "winds": "0.8米/秒",
                "xdsd": "77.1%",
                "qy": "886.5hPa",
                "js": "无降水",
                "njd": "-",
                "wd": "23.3℃"
            },
            {
                "forecasttime": "2018-06-16 21:00:00",
                "windd": "东风",
                "tqxx": "",
                "yl": "79.9%",
                "winds": "0.4米/秒",
                "xdsd": "81.2%",
                "qy": "885.7hPa",
                "js": "无降水",
                "njd": "-",
                "wd": "22.2℃"
            },
            {
                "forecasttime": "2018-06-17 00:00:00",
                "windd": "风向",
                "tqxx": "天气现象",
                "yl": "云量",
                "winds": "风速",
                "xdsd": "相对湿度",
                "qy": "气压",
                "js": "降水",
                "njd": "能见度",
                "wd": "气温"
            },
            {
                "forecasttime": "2018-06-17 03:00:00",
                "windd": "东风",
                "tqxx": "",
                "yl": "79.9%",
                "winds": "0.5米/秒",
                "xdsd": "71.2%",
                "qy": "886.4hPa",
                "js": "无降水",
                "njd": "-",
                "wd": "24.6℃"
            },
            {
                "forecasttime": "2018-06-17 06:00:00",
                "windd": "东南风",
                "tqxx": "",
                "yl": "62.6%",
                "winds": "0.9米/秒",
                "xdsd": "58%",
                "qy": "886.3hPa",
                "js": "无降水",
                "njd": "-",
                "wd": "30.9℃"
            },
            {
                "forecasttime": "2018-06-17 09:00:00",
                "windd": "南风",
                "tqxx": "",
                "yl": "64.3%",
                "winds": "1米/秒",
                "xdsd": "65.2%",
                "qy": "884.8hPa",
                "js": "无降水",
                "njd": "-",
                "wd": "32.8℃"
            },
            {
                "forecasttime": "2018-06-17 12:00:00",
                "windd": "南风",
                "tqxx": "",
                "yl": "79.9%",
                "winds": "2.5米/秒",
                "xdsd": "68.5%",
                "qy": "884.1hPa",
                "js": "无降水",
                "njd": "-",
                "wd": "31.7℃"
            },
            {
                "forecasttime": "2018-06-17 15:00:00",
                "windd": "南风",
                "tqxx": "",
                "yl": "54%",
                "winds": "2米/秒",
                "xdsd": "75.7%",
                "qy": "885.1hPa",
                "js": "无降水",
                "njd": "-",
                "wd": "27.1℃"
            },
            {
                "forecasttime": "2018-06-17 18:00:00",
                "windd": "东南风",
                "tqxx": "",
                "yl": "91.8%",
                "winds": "1.1米/秒",
                "xdsd": "84.1%",
                "qy": "886.2hPa",
                "js": "无降水",
                "njd": "-",
                "wd": "23.5℃"
            },
            {
                "forecasttime": "2018-06-17 21:00:00",
                "windd": "东风",
                "tqxx": "",
                "yl": "90.3%",
                "winds": "1米/秒",
                "xdsd": "89.2%",
                "qy": "885.1hPa",
                "js": "0.1毫米",
                "njd": "-",
                "wd": "21.6℃"
            },
            {
                "forecasttime": "2018-06-18 00:00:00",
                "windd": "风向",
                "tqxx": "天气现象",
                "yl": "云量",
                "winds": "风速",
                "xdsd": "相对湿度",
                "qy": "气压",
                "js": "降水",
                "njd": "能见度",
                "wd": "气温"
            },
            {
                "forecasttime": "2018-06-18 03:00:00",
                "windd": "东风",
                "tqxx": "",
                "yl": "80%",
                "winds": "1.1米/秒",
                "xdsd": "86.1%",
                "qy": "886.1hPa",
                "js": "3.4毫米",
                "njd": "-",
                "wd": "22.7℃"
            },
            {
                "forecasttime": "2018-06-18 06:00:00",
                "windd": "东南风",
                "tqxx": "",
                "yl": "88.5%",
                "winds": "1.4米/秒",
                "xdsd": "71.8%",
                "qy": "886.3hPa",
                "js": "1.8毫米",
                "njd": "-",
                "wd": "23.2℃"
            },
            {
                "forecasttime": "2018-06-18 09:00:00",
                "windd": "东南风",
                "tqxx": "",
                "yl": "91.8%",
                "winds": "2.1米/秒",
                "xdsd": "78.2%",
                "qy": "884.7hPa",
                "js": "1.1毫米",
                "njd": "-",
                "wd": "25.3℃"
            },
            {
                "forecasttime": "2018-06-18 12:00:00",
                "windd": "东南风",
                "tqxx": "",
                "yl": "72.9%",
                "winds": "2.1米/秒",
                "xdsd": "79.3%",
                "qy": "884.4hPa",
                "js": "无降水",
                "njd": "-",
                "wd": "24.5℃"
            },
            {
                "forecasttime": "2018-06-18 15:00:00",
                "windd": "东南风",
                "tqxx": "",
                "yl": "62%",
                "winds": "1.4米/秒",
                "xdsd": "86%",
                "qy": "885.3hPa",
                "js": "无降水",
                "njd": "-",
                "wd": "21.6℃"
            },
            {
                "forecasttime": "2018-06-18 18:00:00",
                "windd": "东风",
                "tqxx": "",
                "yl": "10%",
                "winds": "1.1米/秒",
                "xdsd": "90.1%",
                "qy": "885.9hPa",
                "js": "无降水",
                "njd": "-",
                "wd": "19.8℃"
            },
            {
                "forecasttime": "2018-06-18 21:00:00",
                "windd": "东风",
                "tqxx": "",
                "yl": "10%",
                "winds": "1米/秒",
                "xdsd": "93.3%",
                "qy": "885.3hPa",
                "js": "无降水",
                "njd": "-",
                "wd": "18.1℃"
            },
            {
                "forecasttime": "2018-06-19 00:00:00",
                "windd": "风向",
                "tqxx": "天气现象",
                "yl": "云量",
                "winds": "风速",
                "xdsd": "相对湿度",
                "qy": "气压",
                "js": "降水",
                "njd": "能见度",
                "wd": "气温"
            },
            {
                "forecasttime": "2018-06-19 03:00:00",
                "windd": "东风",
                "tqxx": "",
                "yl": "10%",
                "winds": "1.8米/秒",
                "xdsd": "89.2%",
                "qy": "887.6hPa",
                "js": "无降水",
                "njd": "-",
                "wd": "19.4℃"
            },
            {
                "forecasttime": "2018-06-19 06:00:00",
                "windd": "东风",
                "tqxx": "",
                "yl": "79.9%",
                "winds": "1.6米/秒",
                "xdsd": "88.6%",
                "qy": "887.7hPa",
                "js": "无降水",
                "njd": "-",
                "wd": "21.9℃"
            },
            {
                "forecasttime": "2018-06-19 09:00:00",
                "windd": "东风",
                "tqxx": "",
                "yl": "79.9%",
                "winds": "1.5米/秒",
                "xdsd": "89.4%",
                "qy": "885.7hPa",
                "js": "无降水",
                "njd": "-",
                "wd": "22.1℃"
            },
            {
                "forecasttime": "2018-06-19 12:00:00",
                "windd": "东风",
                "tqxx": "",
                "yl": "79.9%",
                "winds": "2米/秒",
                "xdsd": "89.6%",
                "qy": "884.7hPa",
                "js": "无降水",
                "njd": "-",
                "wd": "20.4℃"
            },
            {
                "forecasttime": "2018-06-19 15:00:00",
                "windd": "东风",
                "tqxx": "",
                "yl": "79.9%",
                "winds": "1.9米/秒",
                "xdsd": "89.9%",
                "qy": "886hPa",
                "js": "无降水",
                "njd": "-",
                "wd": "18.4℃"
            },
            {
                "forecasttime": "2018-06-19 18:00:00",
                "windd": "东南风",
                "tqxx": "",
                "yl": "80%",
                "winds": "2.5米/秒",
                "xdsd": "87.5%",
                "qy": "887.3hPa",
                "js": "无降水",
                "njd": "-",
                "wd": "18℃"
            },
            {
                "forecasttime": "2018-06-19 21:00:00",
                "windd": "东风",
                "tqxx": "",
                "yl": "100%",
                "winds": "1.1米/秒",
                "xdsd": "94.3%",
                "qy": "887hPa",
                "js": "无降水",
                "njd": "-",
                "wd": "17.5℃"
            },
            {
                "forecasttime": "2018-06-20 00:00:00",
                "windd": "风向",
                "tqxx": "天气现象",
                "yl": "云量",
                "winds": "风速",
                "xdsd": "相对湿度",
                "qy": "气压",
                "js": "降水",
                "njd": "能见度",
                "wd": "气温"
            },
            {
                "forecasttime": "2018-06-20 03:00:00",
                "windd": "东风",
                "tqxx": "",
                "yl": "100%",
                "winds": "1.4米/秒",
                "xdsd": "83.2%",
                "qy": "888.5hPa",
                "js": "无降水",
                "njd": "-",
                "wd": "18.7℃"
            },
            {
                "forecasttime": "2018-06-20 06:00:00",
                "windd": "东风",
                "tqxx": "",
                "yl": "62.8%",
                "winds": "2.7米/秒",
                "xdsd": "61.7%",
                "qy": "888hPa",
                "js": "无降水",
                "njd": "-",
                "wd": "22.5℃"
            },
            {
                "forecasttime": "2018-06-20 09:00:00",
                "windd": "东南风",
                "tqxx": "",
                "yl": "75.7%",
                "winds": "1.7米/秒",
                "xdsd": "64.8%",
                "qy": "886hPa",
                "js": "无降水",
                "njd": "-",
                "wd": "26.8℃"
            },
            {
                "forecasttime": "2018-06-20 12:00:00",
                "windd": "东南风",
                "tqxx": "",
                "yl": "79.9%",
                "winds": "4.5米/秒",
                "xdsd": "68%",
                "qy": "884.7hPa",
                "js": "无降水",
                "njd": "-",
                "wd": "24.9℃"
            },
            {
                "forecasttime": "2018-06-20 15:00:00",
                "windd": "东南风",
                "tqxx": "",
                "yl": "68.2%",
                "winds": "1.6米/秒",
                "xdsd": "73.8%",
                "qy": "885.4hPa",
                "js": "无降水",
                "njd": "-",
                "wd": "23℃"
            },
            {
                "forecasttime": "2018-06-20 18:00:00",
                "windd": "东南风",
                "tqxx": "",
                "yl": "10%",
                "winds": "4米/秒",
                "xdsd": "79%",
                "qy": "886.6hPa",
                "js": "无降水",
                "njd": "-",
                "wd": "21℃"
            },
            {
                "forecasttime": "2018-06-20 21:00:00",
                "windd": "东风",
                "tqxx": "",
                "yl": "10%",
                "winds": "1米/秒",
                "xdsd": "89.2%",
                "qy": "885.5hPa",
                "js": "无降水",
                "njd": "-",
                "wd": "19.1℃"
            },
            {
                "forecasttime": "2018-06-21 00:00:00",
                "windd": "风向",
                "tqxx": "天气现象",
                "yl": "云量",
                "winds": "风速",
                "xdsd": "相对湿度",
                "qy": "气压",
                "js": "降水",
                "njd": "能见度",
                "wd": "气温"
            },
            {
                "forecasttime": "2018-06-21 03:00:00",
                "windd": "东风",
                "tqxx": "",
                "yl": "10%",
                "winds": "1米/秒",
                "xdsd": "68.8%",
                "qy": "887.1hPa",
                "js": "无降水",
                "njd": "-",
                "wd": "21℃"
            },
            {
                "forecasttime": "2018-06-21 06:00:00",
                "windd": "东南风",
                "tqxx": "",
                "yl": "10%",
                "winds": "3.4米/秒",
                "xdsd": "62.4%",
                "qy": "887.1hPa",
                "js": "无降水",
                "njd": "-",
                "wd": "25.3℃"
            },
            {
                "forecasttime": "2018-06-21 09:00:00",
                "windd": "东风",
                "tqxx": "",
                "yl": "10%",
                "winds": "0.7米/秒",
                "xdsd": "70.1%",
                "qy": "885.9hPa",
                "js": "无降水",
                "njd": "-",
                "wd": "25.7℃"
            },
            {
                "forecasttime": "2018-06-21 12:00:00",
                "windd": "东南风",
                "tqxx": "",
                "yl": "10%",
                "winds": "4.1米/秒",
                "xdsd": "66.3%",
                "qy": "884.7hPa",
                "js": "无降水",
                "njd": "-",
                "wd": "27.9℃"
            },
            {
                "forecasttime": "2018-06-21 15:00:00",
                "windd": "东北风",
                "tqxx": "",
                "yl": "10%",
                "winds": "1米/秒",
                "xdsd": "74.1%",
                "qy": "885.5hPa",
                "js": "无降水",
                "njd": "-",
                "wd": "21.5℃"
            },
            {
                "forecasttime": "2018-06-21 18:00:00",
                "windd": "南风",
                "tqxx": "",
                "yl": "0%",
                "winds": "3.8米/秒",
                "xdsd": "81.6%",
                "qy": "886.7hPa",
                "js": "无降水",
                "njd": "-",
                "wd": "21.5℃"
            },
            {
                "forecasttime": "2018-06-21 21:00:00",
                "windd": "南风",
                "tqxx": "",
                "yl": "3.4%",
                "winds": "2.4米/秒",
                "xdsd": "83.7%",
                "qy": "886.1hPa",
                "js": "无降水",
                "njd": "-",
                "wd": "20.3℃"
            }
        ]
    }
}
```

 **返回参数说明** 

|参数名|类型|说明|
|:-----  |:-----|-----                           |
|groupid |int   |用户组id，1：超级管理员；2：普通用户  |

 **备注** 

- 更多返回错误代码请看首页的错误代码描述


欢迎使用ShowDoc！