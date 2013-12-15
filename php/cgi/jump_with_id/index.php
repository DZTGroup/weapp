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

$result = \mysql_query('select app_key from Estate where app_id='.$appid.' limit 1', $db);

$arr = null;
if ($result){
    $arr = \mysql_fetch_array($result);
}

\mysql_close($db);
$appkey = $arr['app_key'];

// access token
//https://api.weixin.qq.com/sns/oauth2/access_token?appid=APPID&secret=SECRET&code=CODE&grant_type=authorization_code

$token = file_get_contents("https://api.weixin.qq.com/sns/oauth2/access_token?appid='
.$appid.'&secret='.$appkey.'&code='.$code.'&grant_type=authorization_code");
var_dump($token);