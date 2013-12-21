<?php

/*
 * Database Configuration
 */
define('DB_HOST', '112.124.55.78');
define('DB_USER', 'zunhao');
define('DB_PASS', '655075d7dd');
define('DB_DATABASENAME', 'wxfc');

/*
 * Path Configuration
 */
define('TEMPLATE_PATH', dirname(__FILE__).'/template');
define('TARGET_PATH', dirname(__FILE__).'/../public_html/data');

define('CGI_URI', 'http://www.weixinfc.com/weapp/php/cgi');
define('WECHAT_REDIRECT', 'https://open.weixin.qq.com/connect/oauth2/authorize');

$typeMapping = array(
    'intro'=>'/weapp/public_html/html/intro.html?',
    'impression'=>'/weapp/public_html/html/impression.html?',
    'picture'=>'/weapp/public_html/html/picture.html?',
    'group'=>'/weapp/public_html/html/group.html?',
    'bbs'=>'/wechat-estate/index.php?r=post/list&',
    'advertise'=>'/weapp/public_html/html/advertise.html?',
    'userpicwall'=>'http://www.weixinfc.com/wechat-estate/index.php?r=userpicwall/list&',
);