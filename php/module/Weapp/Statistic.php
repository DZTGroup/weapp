<?php
/**
 * Created by PhpStorm.
 * User: aohajin
 * Date: 12/16/13
 * Time: 10:47 AM
 */

namespace Weapp;

// load config
require_once(dirname(__FILE__) . "/../../config.php");

class Statistic{
    public static function update($eid, $open_id, $page_name){
        $db = new \PDO('mysql:host='.DB_HOST.';dbname='.DB_DATABASENAME, DB_USER, DB_PASS, array(
                \PDO::ATTR_ERRMODE => true,
                \PDO::ERRMODE_EXCEPTION =>true,
                \PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8",
            ));


        $stmt = $db->prepare('insert into Statistic (eid, page_name, open_id) values(:eid, :page_name, :open_id) '
        .'on duplicate key update browse_num=browse_num+1');
        $stmt->execute(array('eid'=>$eid, 'page_name'=>$page_name, 'open_id'=>$open_id));
    }
}