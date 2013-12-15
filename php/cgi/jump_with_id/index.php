<?php
require_once(dirname(__FILE__)."/../../config.php");
/**
 * Created by PhpStorm.
 * User: aohajin
 * Date: 12/15/13
 * Time: 9:53 AM
 */

$code = $_GET['code'];
$state = $_GET['state'];

parse_str($state);// $eid $appid $t

$db = \mysql_connect(DB_HOST, DB_USER, DB_PASS) or die("Database connect failed: ".mysql_error());
\mysql_select_db(DB_DATABASENAME, $db);
\mysql_query("set names utf8");

$result = \mysql_query('select app_key from Estate where id='.$eid.' limit 1', $db);

$arr = null;
if ($result){
    $arr = \mysql_fetch_array($result);
}
$appkey = $arr['app_key'];

// access token
$query = http_build_query(array('appid'=>$appid, 'secret'=>$appkey, 'code'=>$code, 'grant_type'=>'authorization_code'));
$url = 'https://api.weixin.qq.com/sns/oauth2/access_token?' . $query;

$ticket = ($ticket = file_get_contents($url)) ? json_decode($ticket, true): array();

if ( array_key_exists('access_token',$ticket ) ){
    $openid = $ticket['openid'];
    $token = $ticket['access_token'];

    $result = \mysql_query('select count(1) as c from Customer where customer_id='.$openid, $db);
    if ( !$result || mysql_fetch_array($result)['c'] == 0 ){
        $query = http_build_query(array('access_token'=>$token, 'openid'=>$openid));
        $url = 'https://api.weixin.qq.com/sns/userinfo?'. $query;

        $info = ($info = file_get_contents($url)) ? json_decode($info, true): array();
        if ( array_key_exists('openid', $info)){
            mysql_query('insert into Customer ("customer_id", "customer_nickname", "sex") values ('
                .$info['openid'].','.$info['nickname'].','.$info['sex'].')');
        }
    }
}
\mysql_close($db);

$query = http_build_query(array('appid'=>$appid, 'eid'=>$eid, 'openid'=>$openid));
$url = 'http://'.$_SERVER['SERVER_NAME'].'/weapp/public_html/'.$t.'.html?'.$query;
header( 'Location: '.$url );