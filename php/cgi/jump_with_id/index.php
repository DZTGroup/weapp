<?php
require(dirname(__FILE__).'/../../vendor/autoload.php');
require_once(dirname(__FILE__)."/../../config.php");

use Weapp\Util;
/**
 * Created by PhpStorm.
 * User: aohajin
 * Date: 12/15/13
 * Time: 9:53 AM
 */

$code = $_GET['code'];
$state = $_GET['state'];

parse_str($state);// $eid $appid $t

$appInfo = Util::getAppInfo($eid);

$appkey = $appInfo['app_key'];

// access token
$query = http_build_query(array('appid'=>$appid, 'secret'=>$appkey, 'code'=>$code, 'grant_type'=>'authorization_code'));
$url = 'https://api.weixin.qq.com/sns/oauth2/access_token?' . $query;

$ticket = ($ticket = file_get_contents($url)) ? json_decode($ticket, true): array();

$openid = $ticket['openid'];
$token = $ticket['access_token'];

$query = http_build_query(array('appid'=>$appid, 'eid'=>$eid, 'openid'=>$openid));
$url = 'http://'.$_SERVER['SERVER_NAME'].'/weapp/public_html/html/'.$t.'.html?'.$query;
\error_log('[debug]jump to '.$url);
header( 'Location: '.$url );