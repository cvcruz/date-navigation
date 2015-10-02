<!doctype html>
<head>
  <meta charset="utf-8">
  <title>Date Navigation</title>
  <link rel="stylesheet" href="css/date_nav.css">
</head>
<html>
<body>
    <div id="date_nav_wrapper">
        <div class="date_nav">
            <ul id="date_nav_ul_top">
                <li class="nav_li" id="getPrevInRange" data-currentindex="0"><span class="text-arrow">‹</span></li><!--
                --><li class="plain_li"><div id="dateRangeText" class="heavy_text">Today, <?php echo date("l, F j, Y") ?></div></li><!--
                --><li class="nav_li disabled" id="getNextInRange" data-currentindex="0"><span class="text-arrow">›</span></li>
            </ul>
        </div>

        <div class="date_nav">
            <ul id="date_nav_ul_tabs">
                <li class="nav_li nav_on" id="day">Day</li><!--
                --><li class="nav_li" id="week">Week</li><!--
                --><li class="nav_li" id="month">Month</li>
            </ul>
        </div>
    </div>
    <script src="//ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"></script>
    <script src="js/date_utils.js"></script>
    <script src="js/date_nav.js"></script>
    <script>
        $(document).ready(function(){
            date_nav.init();
        });
    </script>
</body>
</html>
