<?php
require 'vendor/autoload.php';

define('ESTATE_ID', '123');

use Weapp\TemplateLoader;
$engine = new TemplateLoader('../public_html/data/template/');

use Weapp\Util;

$baseInfo = Util::getAppInfo(32);
$engine->setUpContext($baseInfo['id'], $baseInfo['name'],$baseInfo['app_id'], $baseInfo['app_key'], $baseInfo['wechat_id']);

$content = Util::getApprovedEntityContent(32,'intro');
$engine->render($content, 'intro');

$content = Util::getTestEntityContent(32,'intro');
$engine->render($content, 'intro', 'test');

