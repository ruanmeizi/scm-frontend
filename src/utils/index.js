export function getDay(day) {
  let date = new Date(new Date().getTime() + 1000 * 3600 * 24 * day);

  return `${date.getFullYear()}-${prefixInteger(date.getMonth() + 1)}-${prefixInteger(date.getDate())}`;
}

export function getNowDate() {
  let date = new Date();
  let y = date.getFullYear();
  let m = date.getMonth() + 1;
  let d = date.getDate();
  m = m < 10 ? "0" + m : m;
  d = d < 10 ? "0" + d : d;
  return y + "-" + m + "-" + d;
}

export function prefixInteger(s) {
  return s < 10 ? "0" + s : s;
}

export function debounce(func, wait, immediate) {
  let timeout, args, context, timestamp, result;

  const later = function () {
    // 据上一次触发时间间隔
    const last = +new Date() - timestamp;

    // 上次被包装函数被调用时间间隔 last 小于设定时间间隔 wait
    if (last < wait && last > 0) {
      timeout = setTimeout(later, wait - last);
    } else {
      timeout = null;
      // 如果设定为immediate===true，因为开始边界已经调用过了此处无需调用
      if (!immediate) {
        result = func.apply(context, args);
        if (!timeout) context = args = null;
      }
    }
  };

  return function (...args) {
    context = this;
    timestamp = +new Date();
    const callNow = immediate && !timeout;
    // 如果延时不存在，重新设定延时
    if (!timeout) timeout = setTimeout(later, wait);
    if (callNow) {
      result = func.apply(context, args);
      context = args = null;
    }

    return result;
  };
}

export function timeFormat(UTCTime) {
  return new Date(+new Date(UTCTime) + 8 * 3600 * 1000).toISOString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '');
}

export function timeFormatGMT(date) {
  var y = date.getFullYear();
  var m = date.getMonth() + 1;
  m = m < 10 ? ('0' + m) : m;
  var d = date.getDate();
  d = d < 10 ? ('0' + d) : d;
  var h = date.getHours();
  var minute = date.getMinutes();
  minute = minute < 10 ? ('0' + minute) : minute;
  return y + '-' + m + '-' + d;
}

export function dateToStr(datetime) {
	var dateTime = new Date(datetime);
  var year = dateTime.getFullYear();
  var month = dateTime.getMonth() + 1; //js从0开始取
  var date = dateTime.getDate();
  var hour = dateTime.getHours();
  var minutes = dateTime.getMinutes();
  var second = dateTime.getSeconds();
  if (month < 10) {
    month = "0" + month;
  }
  if (date < 10) {
    date = "0" + date;
  }
  if (hour < 10) {
    hour = "0" + hour;
  }
  if (minutes < 10) {
    minutes = "0" + minutes;
  }
  if (second < 10) {
    second = "0" + second;
  }
  return year + "-" + month + "-" + date + " " + hour + ":" + minutes + ":" + second;
}

// 验证日期格式 yyyy-MM-dd
export function isCheckDate(date) {
  var regex = new RegExp(
    '^(?:(?:([0-9]{4}(-|/)(?:(?:0?[1,3-9]|1[0-2])(-|/)(?:29|30)|((?:0?[13578]|1[02])(-|/)31)))|([0-9]{4}(-|/)(?:0?[1-9]|1[0-2])(-|/)(?:0?[1-9]|1\\d|2[0-8]))|(((?:(\\d\\d(?:0[48]|[2468][048]|[13579][26]))|(?:0[48]00|[2468][048]00|[13579][26]00))(-|/)0?2(-|/)29))))$'
  );
  var dateValue = date;
  if (!regex.test(dateValue)) {
    dateValue = '';
    return false;
  } else {
    return true;
  }
}

// OADate转换为DateTime
export function oaDateToDateTime(oaDate) {
  var date = new Date();
  date.setTime(Math.round(oaDate * 24 * 60 * 60 * 1000) + Date.parse('1899-12-30'));
  var y = date.getFullYear();
  var m = date.getMonth() + 1;
  m = m < 10 ? '0' + m : m;
  var d = date.getDate();
  d = d < 10 ? ('0' + d) : d;
  return y + '-' + m + '-' + d;
}

// Excel日期格式转换
export function excelDateFormatToDate(date) {
  var dateTime = new Date('1900-1-1');
  var resultDate = dateTime.setDate(dateTime.getDate() - 2 + date);
  var standardDate = new Date(resultDate);  // Fri Sep 15 2017 00:00:00 GMT+0800 (中国标准时间)
  // return standardDate.getFullYear() + '-' + (standardDate.getMonth() + 1) + '-' + standardDate.getDate();
  var y = standardDate.getFullYear();
  var m = standardDate.getMonth() + 1;
  m = m < 10 ? '0' + m : m;
  var d = standardDate.getDate();
  d = d < 10 ? ('0' + d) : d;
  return y + '-' + m + '-' + d;
}

// 转换对象中的值对名
export function changeObjKey(list) {
  let keyList = ['value', 'text'];
  let resList = list.map((item, index, arr) => {
    let obj = {};
    let count = 0;
    for (let i in item) {
      obj[keyList[count]] = item[i];
      count++;
    }
    return obj;
  });
  return resList;
}

/**
 * 对源数据截取decimals位小数，不进行四舍五入
 * @param {*} num 源数据
 * @param {*} decimals 保留的小数位数
 */
export const cutOutNum=(num,decimals) => {
	console.log(num, decimals)
	console.log(isNaN(num))
  if (isNaN(num) || (!num && num !== 0)) {
    return '--'
  }
  // 默认为保留的小数点后两位
  let dec = decimals ? decimals : 2
  let tempNum = Number(num)

  let pointIndex = String(tempNum).indexOf('.') + 1 // 获取小数点的位置 + 1
  let pointCount = pointIndex ? String(tempNum).length - pointIndex : 0 // 获取小数点后的个数(需要保证有小数位)
  // 源数据为整数或者小数点后面小于decimals位的作补零处理
  if (pointIndex === 0 || pointCount <= dec) {
    let tempNumA = tempNum
    if (pointIndex === 0) {
      tempNumA = `${tempNumA}.`
      for (let index = 0; index < dec - pointCount; index++) {
        tempNumA = `${tempNumA}0`
      }
    } else {
      for (let index = 0; index < dec - pointCount; index++) {
        tempNumA = `${tempNumA}0`
      }
    }
    return tempNumA
  }
  let realVal = ''
  // 截取当前数据到小数点后decimals位
  realVal = `${String(tempNum).split('.')[0]}.${String(tempNum)
    .split('.')[1]
    .substring(0, dec)}`
  // 判断截取之后数据的数值是否为0
  if (realVal == 0) {
    realVal = 0
  }
  return realVal
}

// 下载
export function ssoPermission(urlPath, title, token) {
  var xhr = new XMLHttpRequest();
  var formData = new FormData();
  xhr.open('get', urlPath);
  xhr.setRequestHeader("Authorization", 'bearer ' + token);
  xhr.responseType = 'blob';
  xhr.onload = function (e) {
    let blob = new Blob([xhr.response], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8'});
    let downloadElement = document.createElement('a');
    let href = window.URL.createObjectURL(blob);  // 创建下载的链接
    downloadElement.href = href;
    downloadElement.download = title + '.xlsx';  // 下载后文件名
    document.body.appendChild(downloadElement);
    downloadElement.click();  // 点击下载
    document.body.removeChild(downloadElement);  // 下载完成移除元素
    window.URL.revokeObjectURL(href);  // 释放掉blob对象
  };
  xhr.send(formData);
}

// 数量值校验
export function verificationQuantity(_this, val, intCount, floatCount, name) {
  // if (val.toString().indexOf('+') !== -1) {
  //   this.$message({
  //     message: `${name}类型错误，请重新输入！`,
  //     type: 'error'
  //   });
  //   return false;
  // }
  // if (val.toString().indexOf('e') !== -1) {
  //   this.$message({
  //     message: `${name}类型错误，请重新输入！`,
  //     type: 'error'
  //   });
  //   return false;
  // }
  if (val && val.toString().indexOf('.') !== -1) {
    let arr = val.toString().split('.');
    if (arr[0].length > intCount) {
      _this.$message({
        message: `${name}仅支持整数位${intCount}位，请重新输入！`,
        type: 'error'
      });
      return false;
    }
    if (arr[1].length > floatCount) {
      _this.$message({
        message: `${name}仅支持小数位${floatCount}位，请重新输入！`,
        type: 'error'
      });
      return false;
    }
  } else if (val && val.toString().length > intCount) {
    _this.$message({
      message: `${name}仅支持整数位${intCount}位，请重新输入！`,
      type: 'error'
    });
    return false;
  }
  return true;
}

 //固定展示为n天前的时间范围（num为天数,eg:num为7代表一周后,-7为一周前）
 export function getTimeRange(num){
  var date1 = new Date();
  var month=date1.getMonth()+1;
  var date=date1.getDate();
  if (month < 10) {
    month = "0" + month;
  }
  if (date < 10) {
    date = "0" + date;
  }
  var time1=date1.getFullYear()+"-"+month+"-"+date;//time1表示当前时间
  var date2 = new Date(date1);
  date2.setDate(date1.getDate()+num);
  var month2=date2.getMonth()+1;
  var day2=date2.getDate();
  if (month2 < 10) {
    month2 = "0" + month2;
  }
  if (day2 < 10) {
    day2 = "0" + day2;
  }
  var time2 = date2.getFullYear()+"-"+month2+"-"+day2;
  console.log(time1);
  console.log(time2)
  let time=[];
  if(num<0){
     time=[time2,time1];
  }else{
     time=[time1,time2]
  }
  return time;
}

/*
 * 日期增加或减少几天
 * date 当前日期 例：2020-11-30
 * days 增加的天数 例：30
 * return 增加天数后的日期
 */
export function addDate(date, days) {
  var d = new Date(date);
  d.setDate(d.getDate() + days);
  var month = d.getMonth() + 1;
  var day = d.getDate();
  if (month < 10) {
    month = '0' + month;
  }
  if (day < 10) {
    day = '0' + day;
  }
  var val = d.getFullYear() + '-' + month + '-' + day;
  return val;
}

/*
 * 正则去除字符首尾空格
 */
export function trimStr(str) {
  return str.replace(/(^\s*)|(\s*$)/g, '');
}

/*
 * 导出Excel
 */
export function exportExcel(headers, fields, list, filename, autoWidth, bookType) {
  import('@/vendor/Export2Excel').then(excel => {
    const data = formatJson(fields, list);
    excel.export_json_to_excel({
      header: headers,
      data,
      filename: filename,
      autoWidth: autoWidth ? autoWidth : true,
      bookType: bookType
    });
  });
}
export const getNowTimetp = () => {
  let date = new Date();
  let year = date.getFullYear();
  let month = date.getMonth() + 1;
  let date1 = date.getDate();
  let hour = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
  let minute =
    date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
  let second =
    date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
  let milliSeconds = date.getMilliseconds();
  var currentTime =
    year +
    "-" +
    month +
    "-" +
    date1 +
    " " +
    hour +
    ":" +
    minute +
    ":" +
    second +
    "." +
    milliSeconds;
  return currentTime;
};
export function formatJson(filterVal, jsonData) {
  return jsonData.map(v => filterVal.map(j => v[j]));
}