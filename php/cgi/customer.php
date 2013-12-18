<?php
require(dirname(__FILE__).'/../vendor/autoload.php');
require_once(dirname(__FILE__) . "/../config.php");

use Weapp\CustomerCache;

//@Begin-获取参数
$appid = $_GET["appid"];
$estateId = $_GET["eid"];
$openid = $_GET["openid"];
//@End-获取参数

$info = CustomerCache::getCustomerInfo($appid,$openid);
?>
{"openid":"<?php echo $info['customer_id']?>", "nick":"<?php echo $info['customer_nickname']?>"}