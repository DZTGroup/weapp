renderData({ "bgImg" : "../img/ad-bg.jpg",
"desc" : "<?php echo $intro['desc']?>",
"images" : [
<?php if(is_array($intro['imgs']))foreach($intro['imgs'] as $img){ ?>
{ "title" : "<?php echo $img['title']?>",
"url" : "<?php echo $img['url']?>"},
<?php } ?>
],
"modules" : [ { "items" : [ { "actid" : "10001",
"desc" : "生命排毒3天2夜套餐",
"icon" : "",
"timeEnd" : "23:00",
"timeStart" : "9:00",
"title" : "探寻健康·排毒之旅套餐1"
} ],
"title" : "尊享优惠"
} ],
"ytName" : "狮子湖健康中心",
"ytid" : "1001"
});