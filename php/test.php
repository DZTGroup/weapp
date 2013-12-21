<?php
require 'vendor/autoload.php';
require_once(dirname(__FILE__)."/config.php");

use Weapp\TemplateLoader;
use Weapp\Util;
use Weapp\Entity;
use Weapp\AccessToken;

$engine = new TemplateLoader(TEMPLATE_PATH);

$baseInfo = Util::getAppInfo(32);
$engine->setUpContext($baseInfo['id'], $baseInfo['name'],$baseInfo['app_id'], $baseInfo['app_key'], $baseInfo['wechat_id']);

$content = Entity::getApprovedEntityContent(32,'intro');
$engine->render($content, 'intro');

$content = Entity::getTestEntityContent(32,'intro');
$engine->render($content, 'intro', 'test');

$content = Entity::getApprovedEntityContent(32,'impression');
$engine->render($content, 'impression');

$content = Entity::getTestEntityContent(32,'picture');
$engine->render($content, 'picture', 'test');

$content = Entity::getApprovedEntityContent(32,'group');
$engine->render($content, 'group');

$content = Entity::getTestEntityContent(32,'advertise');
$engine->render($content, 'advertise', 'test');