renderStaticData({ "FsRule": [
    { "rule": { "enrollbt": "9:00",
        "enrollet": "23:00"
        },
        "type": "0"
    },
    { "rule": { "nummax": "10",
        "nummin": "1"
        },
        "type": "1"
    },
    { "rule": { "totalmaxoneday": "100",
        "totalminoneday": "0"
        },
        "type": "4"
    }
],
    "actid": "<?php echo $id?>",
    "activityName": "<?php echo $desc?>",
    "banner": "",
    "bgImg": "../img/ad-bg.jpg",
    "bookingInfo": { "items": [
        { "descList": [
<?php if(is_array($announcement))foreach($announcement as $line){?>
                "<?php echo $line?>",
<?php }?>
            ],
            "title": "注意事项",
        }
    ],
        "title": "预约须知"
    },
    "contact": { "phones": [ "<?php echo $phone1?>8",
        "<?php echo $phone2?>"
    ],
        "timesOn": "早9:00-晚23:30"
    },
    "discountInfo": { "items": [
        { "descList": [ "9:00-23:00" ],
            "title": "优惠时间"
        },
        { "descList":[
<?php if(is_array($notice))foreach($notice as $line){?>
            "<?php echo $line?>",
<?php }?>
        ],
            "title": "详细说明",
        }
    ],
        "title": "优惠说明"
    },
    "joinType": "1",
    "status": "0",
    "ytName": "<?php echo $name?>",
});