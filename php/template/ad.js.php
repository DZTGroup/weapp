renderData(
{ "banner" : "http://www.weixinfc.com/wechat-estate/upload_files/<?php echo $estate_id;?>/<?php echo $banner_id?>",
"bgImg" : "../img/ad-bg.jpg",
"title" : "<?php echo '暂时为空'?>",
"desc" : "<?php echo $desc?>",
"items" : [
<?php if(is_array($ads))foreach($ads as $ad){?>
    {
    "icon" : "http://www.weixinfc.com/wechat-estate/upload_files/<?php echo $estate_id;?>/<?php echo $ad['intro']['img']?>",
    "desc" : "<?php echo $ad['intro']['ename']?>",
    "id" : "1001",
    "title" : "<?php echo $ad['intro']['name']?>"
    },
<?php }?>
 ],
}
);