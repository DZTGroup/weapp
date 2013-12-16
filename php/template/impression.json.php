{"sum":<?php echo $sum?$sum:0?>,"top":[
<?php
$index = 1;
if ( is_array($impressions)) foreach($impressions as $impression){
    $count = floor(str_replace('%', '', $impression['percent']) / 100 * $sum);
?>
    {"content":"<?php echo $impression['impression']?>","count":"<?php echo $count?>","id":<?php echo $index?>},
<?php
    $index++;
}?>
]}