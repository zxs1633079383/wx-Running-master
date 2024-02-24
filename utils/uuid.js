const uuid = function () {

  var s = [];

  var hexDigits = "0123456789abcdef";

  for (var i = 0; i < 36; i++) {

    s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);

  }

  s[14] = "4"; 

  s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);

  s[8] = s[13] = s[18] = s[23] = "-";

  var uuid = s.join("");
  //移除横杠，并将剩余的字符串转换为十进制数字
  const numericValue = parseInt(uuid.replace(/-/g,''),16);
  //保留10位数字
  return numericValue % 10000000000;
}

export default uuid