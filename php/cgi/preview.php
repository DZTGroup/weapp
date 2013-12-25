<?php

require_once(dirname(__FILE__) . "/../config.php");
/**
 * Created by PhpStorm.
 * User: aohajin
 * Date: 12/15/13
 * Time: 9:41 AM
 */
$estateId = $_GET["eid"];
$type = $_GET["t"];

//type mapping
if(array_key_exists($type, $typeSync)){
    $type = $typeSync[$type];
}

$query = http_build_query(array('eid'=>$estateId, 'openid'=>0));
$url = 'http://'.$_SERVER['SERVER_NAME'].'/weapp/public_html/html/'.$type.'.html?'.$query;

header( 'Location: '.$url );