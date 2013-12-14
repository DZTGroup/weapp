<?php
/**
 * Created by PhpStorm.
 * User: aohajin
 * Date: 12/15/13
 * Time: 5:20 AM
 */

namespace Weapp;

// load config
require_once(dirname(__FILE__) . "/../../config.php");

class Entity{
    /********************************
     * databaes relative functions
     ********************************/
    // Entity type enum('intro','apartment','group','picture','reservation','impression','comment')
    private static function getEntityContent($estateId, $type, $status){
        $db = mysql_connect(DB_HOST, DB_USER, DB_PASS) or die("Database connect failed: ".mysql_error());
        mysql_select_db(DB_DATABASENAME, $db);

        $result = mysql_query('select * from Entity where estate_id='.$estateId
            .' and type="'.$type.'" and status="'.$status.'" order by create_time desc limit 1', $db);

        $json = '';
        if ($result){
            $json = mysql_fetch_array($result)['content'];
        }

        mysql_close($db);

        return $json;
    }

    public static function getApprovedEntityContent($estateId, $type){
        return Entity::getEntityContent($estateId, $type, '1');
    }


    public static function getTestEntityContent($estateId, $type){
        return Entity::getEntityContent($estateId, $type, '0');
    }
}