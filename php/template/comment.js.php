renderProList([
<?php if(is_array($comments)) foreach($comments as $comment){?>
        {
            name: '<?php echo $comment['name']?>',
            title: '<?php echo $comment['title']?>',
            photo: '/wechat-estate/upload_files/<?php echo $estate_id;?>/<?php echo $comment['img']?>',
            intro: '<?php echo $comment['desc']?>',
            reviewTitle: '<?php echo $comment['c_title']?>',
            reviewDesc: '<?php echo $comment['c_content']?>'
        },
<?php }?>
]);