<?php
require 'vendor/autoload.php';
require_once(dirname(__FILE__)."/config.php");

use Weapp\TemplateLoader;
use Weapp\Util;
use Weapp\Entity;
use Weapp\AccessToken;

$engine = new TemplateLoader(TEMPLATE_PATH);

$baseInfo = Util::getAppInfo(42);
$engine->setUpContext($baseInfo['id'], $baseInfo['name'],$baseInfo['app_id'], $baseInfo['app_key'], $baseInfo['wechat_id']);

$content = Entity::getApprovedEntityContent(42,'intro');
$engine->render($content, 'intro');

$content = Entity::getTestEntityContent(42,'intro');
$engine->render($content, 'intro', 'test');

$content = Entity::getTestEntityContent(42,'comment');
$engine->render($content, 'comment', 'test');

$content = Entity::getApprovedEntityContent(42,'impression');
$engine->render($content, 'impression');

$content = Entity::getApprovedEntityContent(42,'impression');
$engine->render($content, 'impression', 'test');

//$content = Entity::getTestEntityContent(42,'picture');
//$engine->render($content, 'picture', 'test');

$content = Entity::getApprovedEntityContent(42,'group');
$engine->render($content, 'group');

$content = Entity::getTestEntityContent(42,'advertise');
$engine->render($content, 'advertise', 'test');

//$content = Entity::getTestEntityContent(42,'apartment');
//$engine->render($content, 'apartment', 'test');

$content = Entity::getApprovedEntityContent(42,'apartment');
$engine->render($content, 'apartment');

$content = Entity::getTestEntityContent(42,'reservation');
$engine->render($content, 'reservation', 'test');