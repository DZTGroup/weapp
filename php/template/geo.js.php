renderData({
    latlng: {
        lat: <?php echo $lat?>,
        lng: <?php echo $lng?>
    },
    region: '',
    content: {
        title: '<?php echo $name?>',
        addr: '<?php echo $address?>'
    }
});