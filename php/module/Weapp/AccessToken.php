<?php
/**
 * Created by PhpStorm.
 * User: aohajin
 * Date: 12/15/13
 * Time: 9:08 PM
 */
namespace Weapp;

// load config
require_once(dirname(__FILE__) . "/../../config.php");

class AccessToken{
    // db
    private static $db = null;

    static function init(){
        AccessToken::$db = new \PDO('mysql:host='.DB_HOST.';dbname='.DB_DATABASENAME, DB_USER, DB_PASS, array(
                \PDO::ATTR_PERSISTENT => true,
                \PDO::ATTR_ERRMODE => true,
                \PDO::ERRMODE_EXCEPTION =>true,
                \PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8",
            ));
    }

    private static function updateAccessToken($appid){
        $appInfo = Util::getAppInfoByAppId($appid);
        $url = "https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid="
            .$appInfo['app_id']."&secret=".$appInfo['app_key'];
        $token = file_get_contents($url);

        $token = json_decode($token, true)['access_token'];
        if ( $token ){
            AccessToken::$db->query('lock table Access_Token write');
            $stmt = AccessToken::$db->prepare('insert into Access_Token (app_id, token) values(:appid, :token) '
                .'on duplicate key update token=values(token)');
            $stmt->execute(array('appid'=>$appid, 'token'=>$token));

            AccessToken::$db->query('unlock tables');
        }

        return $token;
    }

    public static function getAccessToken($appid){
        AccessToken::$db->query('lock table Access_Token read');

        $stmt = AccessToken::$db->prepare('select token, UNIX_TIMESTAMP(last_modified) as tm from Access_Token where app_id=:appid');
        $stmt->execute(array('appid'=>$appid));

        $token = null;
        while($row = $stmt->fetch()){
            if ( \time() - $row['tm'] < 7100 ){
                $token = $row['token'];
            }
        }

        AccessToken::$db->query('unlock tables');

        if ( ! $token ){
            $token = AccessToken::updateAccessToken($appid);
        }

        return $token;
    }
}
AccessToken::init();