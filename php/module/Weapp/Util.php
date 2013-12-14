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

    // databaes relative functions
    //public static function load
}