"use strict";
const uuid = function() {
  var s = [];
  var hexDigits = "0123456789abcdef";
  for (var i = 0; i < 36; i++) {
    s[i] = hexDigits.substr(Math.floor(Math.random() * 16), 1);
  }
  s[14] = "4";
  s[19] = hexDigits.substr(s[19] & 3 | 8, 1);
  s[8] = s[13] = s[18] = s[23] = "-";
  var uuid2 = s.join("");
  const numericValue = parseInt(uuid2.replace(/-/g, ""), 16);
  return numericValue % 1e10;
};
exports.uuid = uuid;
