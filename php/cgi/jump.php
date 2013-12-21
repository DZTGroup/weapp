<?php

require_once(dirname(__FILE__) . "/../config.php");
/**
 * Created by PhpStorm.
 * User: aohajin
 * Date: 12/15/13
 * Time: 9:41 AM
 */
$estateId = $_GET["eid"];
$appid = $_GET["appid"];
$type = $_GET["t"];

$state = rawurlencode($_SERVER['QUERY_STRING']);
$redirect = rawurlencode(CGI_URI.'/jump_with_id');

$url = WECHAT_REDIRECT.'?appid='.$appid.'&redirect_uri='.$redirect.'&response_type=code&scope=snsapi_base&state='.$state.'#wechat_redirect';

header( 'Location: '.$url );