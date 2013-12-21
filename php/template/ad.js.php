renderData(
{ "banner" : "http://www.weixinfc.com/wechat-estate/upload_files/<?php echo $estate_id;?>/<?php echo $banner_id?>",
"bgImg" : "../img/ad-bg.jpg",
"title" : "<?php echo $title?>",
"desc" : "<?php echo $desc?>",
"items" : [
<?php
$index = 0;
if(is_array($ads))foreach($ads as $ad){?>
    {
    "icon" : "http://www.weixinfc.com/wechat-estate/upload_files/<?php echo $estate_id;?>/<?php echo $ad['intro']['icon']?>",
    "desc" : "<?php echo $ad['intro']['ename']?>",
    "id" : "<?php echo $index?>",
    "title" : "<?php echo $ad['intro']['name']?>"
    },
<?php
    $index++;
}?>
 ],
});