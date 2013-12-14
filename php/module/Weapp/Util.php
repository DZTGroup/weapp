<?php
namespace Weapp;

// load config
require_once(dirname(__FILE__)."/../../config.php");

class Util{
    // strings
    public static function startsWith($haystack, $needle)
    {
        return $needle === "" || strpos($haystack, $needle) === 0;
    }
    public static function endsWith($haystack, $needle)
    {
        return $needle === "" || substr($haystack, -strlen($needle)) === $needle;
    }

    // path
    public static function getPath($estateId){
        return TARGET_PATH.'/'.$estateId;
    }

    //
    // databaes relative functions

    public static function getAppInfo($estateId){
        $db = mysql_connect(DB_HOST, DB_USER, DB_PASS) or die("Database connect failed: ".mysql_error());
        mysql_select_db(DB_DATABASENAME, $db);

        $result = mysql_query('select * from Estate where id='.$estateId.' limit 1', $db);

        $arr = null;
        if ($result){
            $arr = mysql_fetch_array($result);
        }

        mysql_close($db);

        return $arr;
    }

    // Entity type enum('intro','apartment','group','picture','reservation','impression','comment')
    public static function getApprovedEntityContent($estateId, $type){
        $db = mysql_connect(DB_HOST, DB_USER, DB_PASS) or die("Database connect failed: ".mysql_error());
        mysql_select_db(DB_DATABASENAME, $db);

        $result = mysql_query('select * from Entity where estate_id='.$estateId
            .' and type="'.$type.'" and status="1" order by create_time desc limit 1', $db);

        $json = '';
        if ($result){
            $json = mysql_fetch_array($result)['content'];
        }

        mysql_close($db);

        return $json;
    }
}