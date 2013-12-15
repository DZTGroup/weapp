<?php
/**
 * Created by PhpStorm.
 * User: aohajin
 * Date: 12/15/13
 * Time: 8:00 PM
 */

require(dirname(__FILE__).'/../vendor/autoload.php');
require_once(dirname(__FILE__) . "/../config.php");

use Weapp\TemplateLoader;
use Weapp\Util;
use Weapp\Entity;

$estateId = $_GET["eid"];
//$appid = $_GET["appid"];
$type = $_GET["t"];
$formal = $_GET["f"];

$engine = new TemplateLoader(TEMPLATE_PATH);

$baseInfo = Util::getAppInfo($estateId);
$engine->setUpContext($baseInfo['id'], $baseInfo['name'],$baseInfo['app_id'], $baseInfo['app_key'], $baseInfo['wechat_id']);

if ( $formal ){
    $content = Entity::getApprovedEntityContent($estateId,$type);
    $engine->render($content, $type);
}else{
    $content = Entity::getTestEntityContent($estateId,$type);
    $engine->render($content, $type, 'test');
}
