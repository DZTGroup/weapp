renderData({
    "bgImg" : "../img/ad-bg.jpg",
    "contact" : { "phones" : [ "",""],
    "timesOn" : ""
},
    "desc" : "<?php echo $intro['desc']?>",
    "images" : [
<?php if(is_array($intro['imgs']))foreach($intro['imgs'] as $img){ ?>
        {
            "title" : "<?php echo $img['title']?>",
            "url" : "/wechat-estate/upload_files/<?echo $estate_id?>/<?php echo $img['url']?>"
        },
<?php } ?>
    ],
    "modules" : [
        {
            "items" : [
<?php
$index = 0;
if(is_array($items)) foreach($items as $item){?>
                {
                    "actid" : "<?php echo $id.'_'.$index?>",
                    "desc" : "<?php echo $item['desc']?>",
                    "icon" : "/wechat-estate/upload_files/<?echo $estate_id?>/<?php echo $item['icon']?>",
                    "timeEnd" : "<?php echo $item['book_start_time']?>",
                    "timeStart" : "<?php echo $item['book_end_time']?>",
                    "title" : "<?php echo $item['name']?>"
                },
<?php $index++;}?>
            ],
            "title" : "尊享优惠"
        }
    ],
    "ytName" : "<?php echo $intro['name']?>",
    "ytid" : "<?php echo $id?>"
});