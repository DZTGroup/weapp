<?php
// preprocess data
// first, unclassify all rooms' data
$rooms = array();
if(is_array($data))foreach($data as $type){
    if(is_array($type['type_list'])) foreach($type['type_list'] as $room){
        $room['typename'] = $type['type_name'];

        \array_push($rooms, $room);
    }
}
?>

showRooms({
    "banner":"/wechat-estate/upload_files/<?php echo $estate_id?>/<?php echo $top_img?>",
    "rooms":[
<?php $index=1000; foreach($rooms as $room){?>
    {
        "id":"<?php echo $index; ?>",
        "name":"<?php echo $room['base-info']['name']?>",
        "desc":"<?php echo $room['typename']?>",
        "rooms":"<?php echo $room['base-info']['desc']?>",
        "floor":"<?php echo $room['base-info']['floors']?>",
        "area":"<?php echo $room['base-info']['area']?>",
    "simg":"",
    "bimg": "/wechat-estate/upload_files/<?php echo $estate_id?>/<?php echo $room['base-info']['face_img']?>",
        "width":1600,
        "height":1600,
        "dtitle":[
            "建筑面积:<?php echo $room['base-info']['area']?>",
            "套内面积:<?php echo $room['base-info']['inner_area']?>"
        ],
    "dlist":[
<?php //details
    $details = $room['base-info']['detail'];
    if (is_string($details))
        $details = preg_split("/\r\n|\r|\n/", $details);
    else
        $details = ARRAY();

    foreach($details as $detail){
?>
           "<?php echo $detail?>",
<?php }?>
    ],
        "pics":[
    <?php foreach($room['home-plan'] as $pic){?>
            {
                "img":"/wechat-estate/upload_files/<?php echo $estate_id?>/<?php echo $pic['img']?>",
                "width":960,
                "height":960,
                "name":"<?php echo $pic['name']?>"
            },
    <?php }?>
        ],
    "full3d":[
        {
            "name": "<?php echo $room['base-info']['name']?>",
            "list": [
            <?php foreach($room['panoramagram'] as $full3d){?>
                {
                    "name":"<?php echo $full3d['name']?>",
                    "url":"<?php echo $full3d['link']?>"
                },
            <?php }?>
            ],
            "bimg":""
        }]
    },
<?php $index++;}?>
     ]
});
