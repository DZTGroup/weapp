<?php
require(dirname(__FILE__).'/../vendor/autoload.php');
require_once(dirname(__FILE__) . "/../config.php");

use Weapp\CustomerCache;

//http://localhost/weapp/php/cgi/group.php?appid=wx05940045fd60e0f1&eid=32&openid=ox-O7jhby2CLVCaARx7xDglZm7Xc&name=mao&mobile=18616999322&number=1&line=%E8%87%AA%E5%B7%B1%E8%B5%B0%E8%BF%87%E5%8E%BB&cmd=apply&callback=saveResult
//@Begin-获取参数
$cmd = $_GET["cmd"];					//apply
$callback = $_GET["callback"];
$appid = $_GET["appid"];
$estateId = $_GET["eid"];
$openid = $_GET["openid"];

$gid = $_GET['gid'];
//customer info
$realName = $_GET["name"];
$phone = $_GET['mobile'];
$company = $_GET['number'];
$route = $_GET['line'];
//@End-获取参数

$db = new \PDO('mysql:host='.DB_HOST.';dbname='.DB_DATABASENAME, DB_USER, DB_PASS, array(
        \PDO::ATTR_ERRMODE => true,
        \PDO::ERRMODE_EXCEPTION =>true,
        \PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8",
    ));

$info = CustomerCache::getCustomerInfo($appid,$openid);

/*
 * '-100': '提交超时,请重新报名',
            '-101': '请先关注该公共帐号',
            '-411': '请正确输入手机号',
            '-414': '请输入您的姓名',
            '-445': '请正确选择报名人数',
            '-446': '请正确选择出发地点',
            '-1401': '您已经报名了，请不要重复报名'
 */

if($cmd=='apply'){
    $ret = -100;

    do{
        if( !$info ){
            $ret = -101;
            break;
        }

        // check group id
        $stmt = $db->prepare('select * from Entity where group_id=:gid');
        $stmt->execute(array('gid'=>$gid));
        if($stmt->rowCount() == 0){
            $ret = -102;
            break;
        }

        // check already applied
        $stmt = $db->prepare('select * from Customer_Visit where customer_id=:openid and estate_id=:eid and group_id=:gid');
        $stmt->execute(array(
            'openid' => $openid,
            'eid' => $estateId,
            'gid' => $gid,
        ));
        if($stmt->rowCount() > 0){
            $ret = -1401;
            break;
        }

        $stmt = $db->prepare('insert into Customer_Visit (customer_id, customer_nickname, estate_id, group_id, real_name, company, phone, route) '
            .'values(:openid, :nick, :eid, :gid, :name, :company, :phone, :route)');

        if($stmt->execute(array(
            'openid' => $openid,
            'nick' => $info['customer_nickname'],
            'eid' => $estateId,
            'gid' => $gid,
            'name' => $realName,
            'company' => $company,
            'phone' => $phone,
            'route' => $route,
        ))){
            $ret = 0;
            break;
        }

    }while(false);

    ?>
    <?php echo $callback?>({ret:<?php echo $ret?>})
<?php
}
