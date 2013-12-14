<?php
require 'vendor/autoload.php';

define('ESTATE_ID', '123');

use Weapp\TemplateLoader;
$engine = new TemplateLoader('../public_html/data/template/');

$engine->setUpContext('123','1','hehe','lkjalsd','asdasdwq','0306');
$stuff = $engine->render('{"hehe":"hehe"}', 'intro');
echo($stuff);

use Weapp\Util;
var_dump(Util::getPath('123'));
