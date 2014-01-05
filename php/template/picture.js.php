showPics([

<?php foreach($data as $d){?> 

{
    "ps1" : [ { "size" : [ 150,
    150
],
        "subTitle" : "<?php echo $d['subtitle'] ?>",
        "title" : "<?php echo $d['title'] ?>",
        "type" : "title"
    },
        { "img" : "http://www.weixinfc.com/wechat-estate/upload_files/<?php echo $estate_id;?>/<?php echo $d['img1']?>",
            "name" : "",
            "size" : [ 260,
            150
        ],
            "type" : "img"
        },
        { "img" : "http://www.weixinfc.com/wechat-estate/upload_files/<?php echo $estate_id;?>/<?php echo $d['img2']?>",
            "name" : "",
            "size" : [ 100,
            150
        ],
            "type" : "img"
        }
    ],
    "ps2" : [ { "img" : "http://www.weixinfc.com/wechat-estate/upload_files/<?php echo $estate_id;?>/<?php echo $d['img3']?>",
        "name" : "",
        "size" : [ 220,
        150
    ],
        "type" : "img"
    },
        { "content" : "<?php echo $d['desc'] ?>",
            "size" : [ 170,
            150
        ],
            "type" : "text"
        },
        { "img" : "http://www.weixinfc.com/wechat-estate/upload_files/<?php echo $estate_id;?>/<?php echo $d['img4']?>",
            "name" : "",
            "size" : [ 120,
            150
        ],
            "type" : "img"
        }
    ],
    "title" : "<?php echo $d['name'] ?>"
    },
?>

]);