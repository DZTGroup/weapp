<?php
namespace Weapp;

// load config
require_once(dirname(__FILE__)."/../../config.php");

class Util{
    // strings
    public static function startsWith($haystack, $needle)
    {
        return $needle === "" || \strpos($haystack, $needle) === 0;
    }
    public static function endsWith($haystack, $needle)
    {
        return $needle === "" || \substr($haystack, -strlen($needle)) === $needle;
    }

    // path
    public static function getPath($estateId){
        return TARGET_PATH.'/'.$estateId;
    }

    // app general
    public static function getAppInfo($estateId){
        $db = new \PDO('mysql:host='.DB_HOST.';dbname='.DB_DATABASENAME, DB_USER, DB_PASS, array(
                \PDO::ATTR_ERRMODE => true,
                \PDO::ERRMODE_EXCEPTION =>true,
                \PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8",
            ));

        $stmt = $db->prepare('select * from Estate where id=:eid limit 1');
        $stmt->execute(array('eid'=>$estateId));

        if($stmt->rowCount() == 1){
            return $stmt->fetch();
        }
    }

    public static function getAppInfoByAppId($appid){
        $db = new \PDO('mysql:host='.DB_HOST.';dbname='.DB_DATABASENAME, DB_USER, DB_PASS, array(
                \PDO::ATTR_ERRMODE => true,
                \PDO::ERRMODE_EXCEPTION =>true,
                \PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8",
            ));

        $stmt = $db->prepare('select * from Estate where app_id=:appid limit 1');
        $stmt->execute(array('appid'=>$appid));

        if($stmt->rowCount() == 1){
            return $stmt->fetch();
        }
    }
}