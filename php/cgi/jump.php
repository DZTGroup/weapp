<?php

require_once(dirname(__FILE__) . "/../config.php");
// old
// http://www.weixinfc.com/weapp/public_html/html/intro.html?eid=32&appid=wx05940045fd60e0f1

// new
// http://www.weixinfc.com/weapp/php/cgi/jump.php?eid=32&appid=wx05940045fd60e0f1&t=intro


/*

https://open.weixin.qq.com/connect/oauth2/authorize?
appid=wx520c15f417810387
&redirect_uri=http%3A%2F%2Fchong.qq.com%2Fphp%2Findex.php%3Fd%3D%26c%3DwxAdapter%26m%3DmobileDeal%26showwxpaytitle%3D1%26vb2ctag%3D4_2030_5_1194_60
&response_type=code
&scope=snsapi_base
&state=123#wechat_redirect

 */
/**
 * Created by PhpStorm.
 * User: aohajin
 * Date: 12/15/13
 * Time: 9:41 AM
 */
$estateId = $_GET["eid"];
$appid = $_GET["appid"];
$type = $_get["t"];

$state = rawurlencode($_SERVER['QUERY_STRING']);
$redirect = rawurlencode(CGI_URI.'/jump_with_id');

$url = WECHAT_REDIRECT.'?appid='.$appid.'&redirect_uri='.$redirect.'&response_type=code&scope=snsapi_base&state='.$state.'#wechat_redirect';

header( 'Location: '.$url );