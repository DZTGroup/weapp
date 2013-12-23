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
            "url" : "<?php echo $img['url']?>"
        },
<?php } ?>
    ],
    "modules" : [
        {
            "items" : [
                {
                    "actid" : "",
                    "desc" : "",
                    "icon" : "",
                    "timeEnd" : "23:00",
                    "timeStart" : "9:00",
                    "title" : ""
                }
            ],
            "title" : "尊享优惠"
        }
    ],
    "ytName" : "<?php echo $intro['name']?>",
    "ytid" : "<?php echo $id?>"
});