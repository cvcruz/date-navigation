var date_nav = function(){
    var startEnd = null;
    function init(cb){
        var start, end;
        $(".nav_li").on("click",function(){
            if($(this).hasClass("disabled")){
                return false;
            }
            var startEnd = {};
            var daterange = $(this).attr("id");
            switch(daterange){
                case "getPrevInRange" :
                    startEnd = getNextPrev("prev");
                    break;
                case "getNextInRange" :
                    startEnd = getNextPrev("next");
                    break;
                default :
                    $(".nav_on").removeClass("nav_on");
                    $(this).addClass("nav_on");
                    resetIndices();
                    break;
            }
            if(cb){
                cb(startEnd);
            }
            updateDateRangeText(startEnd);
        });

        if(cb){
            cb(startEnd);
        }
    }

    function getNextPrev(dir){
        var ts = date_utils.getCurrentTimestamp();
        var startTS = ts.utc;
        var endTS = ts.utc - (7*24*3600000);

        var daterange = $(".nav_on").attr("id");
        var currPrevI = parseInt($("#getPrevInRange").attr("data-currentindex"));
        var currNextI = parseInt($("#getNextInRange").attr("data-currentindex"));
        var prevI, nextI;

        if(dir==="prev"){
            prevI = currPrevI + 1;
            nextI = currPrevI;
            disableNext(false);
        }
        else {
            prevI = (currPrevI - 1 < 0) ? 0 : currPrevI - 1;
            nextI = (currNextI - 1 < 0) ? 0 : currNextI - 1;
            if(prevI === 0 || (prevI === 1 && daterange==="week") ) {
                disableNext(true);
            }
        }
        $("#getNextInRange").attr("data-currentindex", nextI);
        $("#getPrevInRange").attr("data-currentindex", prevI);

        switch(daterange){
            case "week" :
                startTS = ts.utc - (prevI*7*24*3600000);
                endTS = ts.utc - (nextI*7*24*3600000);
                break;
            case "month" :
                var currMonth = ts.month - prevI;
                var yyyy = ts.year;
                var daysInMonth = date_utils.getDaysInMonth(currMonth,yyyy);
                var firstLastDay = date_utils.getFirstLastDayOfMonth((currMonth),yyyy);
                startTS= firstLastDay.firstDayTS;
                endTS = firstLastDay.lastDayTS;
                break;
            default :
                //day
                startTS= ts.utc - (prevI*24*3600000);
                endTS = startTS;
                break;
        }
        start = date_utils.getFormattedDateTime(startTS,true,"YYYYMMDD",null,null);
        end = date_utils.getFormattedDateTime(endTS,true,"YYYYMMDD",null,null);
        var startEnd = {
            "startStr":start.date,
            "start":startTS,
            "endStr"  :end.date,
            "end":endTS,
            "daterange":daterange

        };
        return startEnd;
    }
    function updateDateRangeText(d){
        var currDayStartEnd = date_utils.getCurrDayStartEnd();
        var startUTC = (d.start) ? d.start : currDayStartEnd.start;
        var endUTC = (d.end) ? d.end: currDayStartEnd.end;
        var start = date_utils.getTimestamp(startUTC,true);
        var end = date_utils.getTimestamp(endUTC,true);

        var daterange = (d.daterange) ? utils.capFirstLetter(d.daterange) : $(".nav_on").attr("id").toLowerCase();

        var endDateStr = " - " + end.fullMonthName + " " + end.day + ", " + end.year;
        var dayOfWeek = start.fullWeekday + ", " ;

        switch(daterange.toLowerCase()){
          case "day":
            if(d.start === currDayStartEnd.start){
               $("#dateRangeLabel").html("Today " );
            }
            else {
              $("#dateRangeLabel").empty();
            }
              endDateStr = ", " + end.year;
              $("#dateRangeText").empty().html(dayOfWeek + start.fullMonthName + " " + start.day + endDateStr);
              break;
          case "month":
            $("#dateRangeText").empty();
            $("#dateRangeText").html(start.fullMonthName + " " + start.year);
            break;


          default:
            dayOfWeek = "";
            if(!d.start){
                startUTC = currDayStartEnd.start - (6*24*3600000);
                start = date_utils.getTimestamp(startUTC,true);
            }
            endDateStr = " - " + end.fullMonthName + " " + end.day + ", " + end.year;
            $("#dateRangeLabel").html(daterange + " of ");
            $("#dateRangeText").empty().html(start.fullMonthName + " " + start.day + endDateStr);
            break;
        }
    }
    function disableNext(disable){
        if(disable){
            $("#getNextInRange").addClass("disabled");
        }
        else {
            $("#getNextInRange").removeClass("disabled");
        }
    }
    function getDateRange(){
        return $(".nav_on").attr("id").toLowerCase();
    }
    function resetIndices(){
        var currI = ( getDateRange() === "week") ? 1 : 0;
        $("#getNextInRange").attr("data-currentindex",0);
        $("#getPrevInRange").attr("data-currentindex",currI);
        disableNext(true);
    }
    return {
        init:init,
        updateDateRangeText:updateDateRangeText
    }
}();
