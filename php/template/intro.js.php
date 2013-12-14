renderData({
    issue: 2,
    startTime: '1367139600',
    endTime: '1367229600',
    banner: 'http://www.weixinfc.com/wechat-estate/upload_files/<?php echo $estate_id;?>/<?php echo $banner_id?>',
    video: {
        pic: '',
        vid:'<?php echo $video_id?>',
        width: '290',
        height: '217',
        title: '<?php echo $video_title?>'
    },
    ads: {
        strong: '',
        price: '',
        unit: '',
        msg: ''
    },
    sellInfo: [
        <?php if(is_array($selling_info))foreach($selling_info as $val) {?>
        '<?php echo $val?>',
        <?php }?>
    ],
    map: {
        pic: 'http://st.map.soso.com/api?size=279*75&center=<?php echo $lng?>,<?php echo $lat?>&zoom=14&markers=<?php echo $lng?>,<?php echo $lat?>,1',
        addr: '<?php echo $address?>',
        latlng: [{
            lat: '<?php echo $lat?>',
            lng: '<?php echo $lng?>'
        }]
    },
    intro: {
        title: '项目简介',
        detail: ['<?php echo $intro?>']
    },
    traffic: {
        title: '交通配套',
        detail: ['<?php echo $traffic?>']
    }
});