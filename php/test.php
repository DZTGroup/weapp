<?php
require 'vendor/autoload.php';

use Weapp\TemplateLoader;
$engine = new Weapp\TemplateLoader('../public_html/data/template/');

$engine->setUpContext('123','1','hehe','lkjalsd','asdasdwq','0306');
$stuff = $engine->render('{"hehe":"hehe"}', 'intro');

echo($stuff);
