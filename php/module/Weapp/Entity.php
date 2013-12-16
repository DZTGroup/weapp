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
        $db = new \PDO('mysql:host='.DB_HOST.';dbname='.DB_DATABASENAME, DB_USER, DB_PASS, array(
                \PDO::ATTR_ERRMODE => true,
                \PDO::ERRMODE_EXCEPTION =>true,
            ));

        $stmt = $db->prepare('select * from Entity where estate_id=:eid and type=:type and status=:status '
            .'order by create_time desc limit 1');
        $stmt->execute(array('eid'=>$estateId, 'type'=>$type, 'status'=>$status));

        if($stmt->rowCount() == 1){
            return $stmt->fetch()['content'];
        }else{
            return '';
        }
    }

    public static function getApprovedEntityContent($estateId, $type){
        return Entity::getEntityContent($estateId, $type, '1');
    }


    public static function getTestEntityContent($estateId, $type){
        return Entity::getEntityContent($estateId, $type, '0');
    }
}