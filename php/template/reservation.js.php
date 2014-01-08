<?php
require(dirname(__FILE__).'/../vendor/autoload.php');
require_once(dirname(__FILE__) . "/../config.php");
use Weapp\Entity;

// use only approved data
$apartment_data = Entity::getApprovedEntityContent($estate_id, 'apartment');
// de-wrapping
$apartment_data = json_decode($apartment_data, true)['content']['types'];
//
$room_types = array();
if(is_array($apartment_data))foreach($apartment_data as $rtype){
    if(is_array($rtype['type_list'])) foreach($rtype['type_list'] as $room){
        \array_push($room_types, $rtype['type_name'].' '.$room['base-info']['name']);
    }
}

date_default_timezone_set('Asia/Shanghai');
$start = strtotime($start_date." ".$start_time);
$end = strtotime($end_date." ".$end_time);
?>
loadInfoResult({
    "issue": "0",
    "startTime": <?php echo $start?>,
    "endTime": <?php echo $end?>,
    "banner": "/wechat-estate/upload_files/<?php echo $estate_id;?>/<?php echo $top_img?>",
    "benefit": "<?php echo $name?>",
    "bid": "2",
    "type": "<?php echo $type?>",
    "maxApplyCount": 3,
    "housetype": [
<?php if(is_array($room_types)) foreach($room_types as $rt){?>
        {
            "online": "100",
            "offline": "0",
            "text": "<?php echo $rt?>"
        },
<?php }?>
    ],
    "rules": {
        "title": "<?php echo $sub_title?>",
        "desc": [
<?php if(is_array($rules)) foreach($rules as $rule){?>
            "<?php echo $rule?>",
<?php }?>
        ]
    },
    "tips": ["凡微信网友到场均可享受此项优惠。"],
    "details": [
<?php if(is_array($tips)) foreach($tips as $tip){?>
        "<?php echo $tip?>",
<?php }?>
    ]
});