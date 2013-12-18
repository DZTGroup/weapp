loadInfoResult({
    "issue": "<?php echo $groupId?>",
    "startTime": "<?php echo $startDate?> <?php echo $startTime?>:00",
    "endTime": "<?php echo $endDate?> <?php echo $endTime?>:00",
    "banner": "http://www.weixinfc.com/weixinfc/test/apply_files/img/0.jpg",
    "lines": [
<?php if(is_array($routes))foreach($routes as $route){?>
        {
        "value": "<?php echo $route['name']?>",
        "text":  "<?php echo $route['name']?>"
        },
<?php }?>
    ],
    "ads": {
        "strong": "",
        "msg": "",
        "tips": ""
    },
    "rules": [
        {
        "title": "报名享惊喜",
        "desc": [
<?php if(is_array($cookies))foreach($cookies as $cookie){?>
    "<?php echo $cookie?>",
<?php }?>
        ]
        },
<?php if(is_array($routes))foreach($routes as $route){?>
    {
    "title": "<?php echo $route['name']?>",
    "desc": [
    <?php
    $details = preg_split("/\r\n|\r|\n/", $route['tip']);
    if(is_array($details))foreach($details as $detail){
        ?>
            "<?php echo $detail?>",
    <?php }?>
        ]
    },
<?php }?>
        {
        "title": "免责声明",
        "desc": [
<?php if(is_array($announcement))foreach($announcement as $line){?>
    "<?php echo $line?>",
<?php }?>
        ]
        }
    ]
});