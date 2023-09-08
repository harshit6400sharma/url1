declare var $: any;
export default class Utils {

  public rString = '0123456789';

  convertheightTocm(ft) {
    return Math.round((ft / 0.032808));
  }

  randomString(length) {
    var result = '';
    var chars = this.rString;
    for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
    return result;
  }

  errorDialog(errMessage: string, title?) {
    $.confirm({
      title: title || 'Encountered an error!',
      content: errMessage,
      type: 'red',
      typeAnimated: true,
      buttons: {
        close: function () {
        }
      }
    });
  }

  successDialog(content: string, title?) {
    $.confirm({
      title: title || 'Congratulations!',
      content: content,
      type: 'green',
      typeAnimated: true,
      buttons: {
        close: function () {
        }
      }
    });
  }

  calculateAge(birthday) { // mm/dd/yyyy
    var dob = new Date(birthday);
    var month_diff = Date.now() - dob.getTime();
    var age_dt = new Date(month_diff);
    //extract year from date    
    var year = age_dt.getUTCFullYear();
    //now calculate the age of the user
    var age = Math.abs(year - 1970);
    return age;
  }

  calcAgeinDecimal(birthday) {
    var dob = new Date(birthday);
    var time_difference = Date.now() - dob.getTime();
    var oneDay = 24 * 60 * 60 * 1000;
    var days_difference = time_difference / oneDay;
    return days_difference / 365
  }

  currencyFormat(num) {
    //var x = 12345678;
    var x = num.toString();
    var lastThree = x.substring(x.length - 3);
    var otherNumbers = x.substring(0, x.length - 3);
    if (otherNumbers != '')
      lastThree = ',' + lastThree;
    var res = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree;
    return res
  }

  parseXmlToJson(xml) {
    const json = {};
    for (const res of xml.matchAll(/(?:<(\w*)(?:\s[^>]*)*>)((?:(?!<\1).)*)(?:<\/\1>)|<(\w*)(?:\s*)*\/>/gm)) {
      const key = res[1] || res[3];
      const value = res[2] && this.parseXmlToJson(res[2]);
      json[key] = ((value && Object.keys(value).length) ? value : res[2]) || null;

    }
    return json;
  }

  getDaysInMonth(month, year) {
    // Here January is 1 based
    //Day 0 is the last day in the previous month
    return new Date(year, month, 0).getDate();
    // Here January is 0 based
    // return new Date(year, month+1, 0).getDate();
  };

}