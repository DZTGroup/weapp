{"sum":<?php echo $sum?>,"top":[
<?php
$index = 1;
foreach($impressions as $impression){
    $count = floor(str_replace('%', '', $impression['percent']) / 100 * $sum);
?>
    {"content":"<?php echo $impression['impression']?>","count":"<?php echo $count?>","id":<?php echo $index?>},
<?php
    $index++;
}?>
]}