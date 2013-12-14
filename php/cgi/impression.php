<?php

//@Begin-获取参数
$cmd = $_GET["cmd"];					//update/query
$callback = $_GET["callback"];

$estateId = $_GET["id"];
$userId = $_GET["usr"];
$content = $_GET["im"];
//@End-获取参数
/*
 * {"msg":"ok","ret":0,"user":{"content":"媲美三亚","count":"12641","id":-1}}
 */
