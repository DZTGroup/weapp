<?php
require(dirname(__FILE__).'/../vendor/autoload.php');
require_once(dirname(__FILE__) . "/../config.php");

use Weapp\CustomerCache;

//@Begin-获取参数
$cmd = $_GET["cmd"];					//set/get
$callback = $_GET["callback"];
$appid = $_GET["appid"];
$estateId = $_GET["eid"];
$openid = $_GET["openid"];

$content = $_GET["im"];
//@End-获取参数
/*
 * {"msg":"ok","ret":0,"user":{"content":"媲美三亚","count":"12641","id":-1}}
 */

$db = new \PDO('mysql:host='.DB_HOST.';dbname='.DB_DATABASENAME, DB_USER, DB_PASS, array(
        \PDO::ATTR_ERRMODE => true,
        \PDO::ERRMODE_EXCEPTION =>true,
        \PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8",
    ));

if($cmd == 'get'){
    $stmt = $db->prepare('select * from Customer_Impression where customer_id=:openid and estate_id=:eid limit 1');
    $stmt->execute(array('openid'=>$openid, 'eid'=>$estateId));

    $content = '';
    $id = -1;
    if($stmt->rowCount() == 1){
        $row = $stmt->fetch();

        $content = $row['impression'];
        $id = 99;
    }
?>
<?php echo $callback?>({msg:"ok",ret:0,user:{content:"<?php echo $content?>",id:<?php echo $id?>}})
<?php
}elseif($cmd=='set'){
    $info = CustomerCache::getCustomerInfo($appid,$openid);

    $ret = -100;

    if ($info ){
        $stmt = $db->prepare('insert into Customer_Impression (customer_id, customer_nickname, estate_id, impression) '
            .'values(:openid, :nick, :eid, :content) '
            .'on duplicate key update customer_nickname=values(customer_nickname),impression=values(impression)');

        if($stmt->execute(array(
            'openid' => $openid,
            'nick' => $info['customer_nickname'],
            'eid' => $estateId,
            'content' => $content,
        ))){
            $ret = 0;
        }
    }
?>
<?php echo $callback?>({ret:<?php echo $ret?>, user:{content:"<?php echo $content?>", id:99}})
<?php
}
