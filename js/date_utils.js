/** @namespace */
var utils = function(){
    function capFirstLetter(str){
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    return {
        capFirstLetter:capFirstLetter,
    }
}();

var date_utils = function(){
    var today = new Date();//Wed Sep 25 2013 10:51:19 GMT-0700 (PDT)
    var today_epoch = today.getTime(); //else it will be in ms
    /** return local timestamp for manipulation in UI
    * @param {Date Object} d - Javascript Date Object
    * @param {boolean}  isUTC - epoch date flag
    */
    function getTimestamp(d,isUTC){
        var isUTC = (isUTC) ? isUTC : true;
        if(isUTC){
            d = convertFromUTC(d);
        }
        var timestamp = {};
        var h = d.getHours();

        var raw_h = h;//24-hour clock
        var am_pm = (h >= 12) ? "pm" : "am";
        h = (h < 12) ? h : h - 12;
        if(h == 0){
            h = 12;
        }
        var m = d.getMinutes();
        var raw_m = m;
        if(m < 10) {
            m = "0" + m;
        }
        if(m===0){
            m = "00";
        }
        var timestr = d.toTimeString();//14:39:11 GMT-0700 (Pacific Standard Time)
        var timestrArray = timestr.split(":");
        var timezone = getTimezone(timestr);
        timestamp.datestr = d.toDateString();//Wed Sep 25 2013
        timestamp.timestr = timestr;
        timestamp.utc = d.getTime();//or Date.parse(d)?
        timestamp.hours = h;
        timestamp.raw_h = raw_h;
        timestamp.mins = m;
        timestamp.raw_mins = raw_m;
        if(timestrArray[2]){
            timestamp.raw_secs = timestrArray[2].split(" ")[0];
        }

        timestamp.am_pm = am_pm;
        timestamp.timezone = timezone;
        timestamp.month = d.getMonth();//0-11
        timestamp.monthNum = d.getMonth() + 1;
        timestamp.mm = (timestamp.monthNum > 9) ? timestamp.monthNum : "0" + timestamp.monthNum;
        timestamp.timezone_offset = d.getTimezoneOffset();//timezone difference between UTC and Local Time
        var month = getMonth(timestamp.month);
        timestamp.shortMonthName = month.short;//Jan, etc.
        timestamp.fullMonthName = month.long;//January, etc.

        timestamp.day = d.getDate();//0-31
        timestamp.dd = (timestamp.day > 9) ? timestamp.day : "0" + timestamp.day;
        var weekday = getWeekday(d.getDay());//0-6
        timestamp.weekday = weekday.index;
        timestamp.fullWeekday = weekday.long;//Sunday, Monday, etc.
        timestamp.shortWeekday = weekday.short;//Sun, Mon, etc.

        timestamp.year = d.getFullYear();
        timestamp.shortYear = ((timestamp.year).toString()).substring(2);
        timestamp.epochStartMidnight = d.setHours(0,0,0,0);
        timestamp.epochEndMidnight = d.setHours(23,59,0,0);
        return timestamp;
    }

    /** parse time zone from date string
    * @param {string} d - [Javascript Date Object].toTimeString()
    */
    function getTimezone(d){
        return d.substring(  d.indexOf('(') + 1, d.length -1);
    }
    /** convert epoch to javascript date object
     * @param {int} d - date in epoch time
     */
    function convertFromUTC(d){
        return new Date(d);
    }

    function getCurrentTimestamp(){
        return getTimestamp(today,false);
    }

    function getCurrDayStartEnd(){
        var startEnd = {};
        var d = new Date(); //today
        var currDay = d.getDate();
        startEnd.startTime = d.setHours(0,0,0,0); // start day at midnight in current timezone
        startEnd.start = startEnd.startTime;
        startEnd.endTime = d.setHours(23,59,0,0); // end day at 11:59:00 in current timezone
        startEnd.end = startEnd.endTime;
        return startEnd;
    }

    function getStartOfDay(d){
      return d.setHours(0,0,0,0);
    }
    function getEndOfDay(d){
      return  d.setHours(23,59,0,0);
    }

    function getDaysInMonth(m,yyyy){
        return new Date(yyyy, m, 0).getDate();
    }

    function getFirstLastDayOfMonth(m,y){
        var fDay = new Date(y, m, 1);
        var lDay = new Date(y, m + 1, 0);
        var firstLast = {
          firstDay : fDay,
          lastDay :  lDay,
          firstDayTS : fDay.getTime(),
          lastDayTS : lDay.getTime()
      };
      return firstLast;
    }

    function getWeekday(d){
        var days = [
            { "short" : "Sun", "long" : "Sunday"},
            { "short" : "Mon", "long" : "Monday"},
            { "short" : "Tue", "long" : "Tuesday"},
            { "short" : "Wed", "long" : "Wednesday"},
            { "short" : "Thur", "long" : "Thursday"},
            { "short" : "Fri", "long" : "Friday"},
            { "short" : "Sat", "long" : "Saturday"}
        ];
        days[d].index = d;
        return days[d];
    }

    function getMonth(d){
        var months = [
            { "short" : "Jan", "long": "January"},
            { "short" : "Feb", "long": "February"},
            { "short" : "Mar", "long": "March"},
            { "short" : "Apr", "long": "April"},
            { "short" : "May", "long": "May"},
            { "short" : "Jun", "long": "June"},
            { "short" : "Jul", "long": "July"},
            { "short" : "Aug", "long": "August"},
            { "short" : "Sep", "long": "September"},
            { "short" : "Oct", "long": "October"},
            { "short" : "Nov", "long": "November"},
            { "short" : "Dec", "long": "December"}
        ]
        return months[d];
    }

    function getUTCFromDateStr(dateStr){
        var t = dateStr.split('-');
        var dd = parseInt(t[2]);
        var mm = parseInt(t[1]);
        var yy = parseInt(t[0]);
        var d = new Date(yy, mm - 1, dd, 0, 0, 0, 0);
        return d.getTime();
    }

    function getFormattedTimestamp(d,isUTC){
        var ts = getTimestamp(d,isUTC);
        return ts.datestr + ", " + ts.hours + ":" + ts.mins + ts.am_pm;
    }

    function getFormattedDateTime(d,isUTC,dateStyle){
        //date and time style options to implement: full, long, med, short
        var ts = getTimestamp(d,isUTC);
        var timestamp = {};
                /*
        {"datestr":"Mon Dec 09 2013","timestr":"13:35:40 GMT-0800 (PST)","utc":1386624940019,"hours":1,"raw_h":13,"mins":35,"raw_mins":35,"am_pm":"pm","timezone":"PST","month":11,"timezone_offset":480,"shortMonthName":"Dec","fullMonthName":"December","day":9,"fullWeekday":"Monday","shortWeekday":"Mon","year":2013,"shortYear":"13"}
        */
        if(dateStyle){
            switch(dateStyle) {
                case "LONG":
                    timestamp.date = ts.fullMonthName + " " + ts.day + ", " + ts.year;
                    break;
                case "SHORT":
                    timestamp.date = ts.shortMonthName + " " + ts.day + ", " + ts.year;
                    break;
                case "Y-m-d":
                    ts.monthNum = (ts.monthNum < 10) ? "0" + ts.monthNum : ts.monthNum;
                    ts.day = (ts.day < 10) ? "0" + ts.day : ts.day;
                    timestamp.date = ts.year + "-" + ts.monthNum + "-" + ts.day;
                    break;
                case "m_d_Y":
                    ts.monthNum = (ts.monthNum < 10) ? "0" + ts.monthNum : ts.monthNum;
                    ts.day = (ts.day < 10) ? "0" + ts.day : ts.day;
                    timestamp.date = ts.monthNum + "_" +  ts.day + "_" + ts.year;
                    break;
                case "D,M dd":
                    timestamp.date =  ts.shortWeekday + ", " + ts.shortMonthName + " " + ts.day;
                    break;
                case "mm-dd":
                    timestamp.date = ((ts.month > 9) ? ts.month : "0" + ts.month) + "-" + ((ts.day > 9) ? ts.day : "0" + ts.day);
                    break;
                case "Y-mm-dd":
                    timestamp.date = ts.year + "-" + ((ts.month > 9) ? ts.month : "0" + ts.month) + "-" + ((ts.day > 9) ? ts.day : "0" + ts.day);
                    break;
                case "YYYY-MM-DD":
                    ts.monthNum = (ts.monthNum < 10) ? "0" + ts.monthNum : ts.monthNum;
                    ts.day = (ts.day < 10) ? "0" + ts.day : ts.day;
                    timestamp.date = ts.year + "-" + ts.monthNum + "-" + ts.day;
                    break;
                case "YYYYMMDD":
                    ts.monthNum = (ts.monthNum < 10) ? "0" + ts.monthNum : ts.monthNum;
                    ts.day = (ts.day < 10) ? "0" + ts.day : ts.day;
                    timestamp.date = ts.year.toString()  + ts.monthNum.toString() + ts.day.toString();
                    break;
                default:
                    // return FULL by default
                    timestamp.date  = ts.datestr;
            }
        }
        return timestamp;
    }

    return {
        getTimestamp:getTimestamp,
        getFormattedDateTime:getFormattedDateTime,
        getFormattedTimestamp:getFormattedTimestamp,
        getCurrentTimestamp:getCurrentTimestamp,
	    getMonth:getMonth,
        getCurrDayStartEnd:getCurrDayStartEnd,
        getDaysInMonth:getDaysInMonth,
        getFirstLastDayOfMonth:getFirstLastDayOfMonth,
        getWeekday:getWeekday,
        today:today,
        today_epoch:today_epoch,
        getStartOfDay:getStartOfDay,
        getEndOfDay:getEndOfDay,
        getUTCFromDateStr:getUTCFromDateStr
    }
}();