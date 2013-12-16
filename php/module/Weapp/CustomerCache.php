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

class CustomerCache{
    public static function getCustomerInfo($appid, $openid){
        $db = new \PDO('mysql:host='.DB_HOST.';dbname='.DB_DATABASENAME, DB_USER, DB_PASS, array(
                \PDO::ATTR_ERRMODE => true,
                \PDO::ERRMODE_EXCEPTION =>true,
            ));

        $stmt = $db->prepare('select *,UNIX_TIMESTAMP(last_modified) as tm from Customer where customer_id=:openid limit 1');
        $stmt->execute(array('openid'=>$openid));

        if($stmt->rowCount() == 1){
            $row = $stmt->fetch();
            if ( \time() - $row['tm'] < 60*60*24*7 ){
                return $row;
            }
        }

        // need update
        $token = AccessToken::getAccessToken($appid);
        if ($token){
            $query = http_build_query(array('access_token'=>$token, 'openid'=>$openid));
            $url = 'https://api.weixin.qq.com/cgi-bin/user/info?'. $query;

            $info = ($info = file_get_contents($url)) ? json_decode($info, true): array();
            if ( array_key_exists('openid', $info)){

                $stmt = $db->prepare('insert into Customer (customer_id, customer_nickname, sex) values(:openid, :nick, :sex) '
                    .'on duplicate key update customer_nickname=values(customer_nickname), sex=values(sex)');
                $stmt->execute(array('openid'=>$openid, 'nick'=>$info['nickname'], 'sex'=>$info['sex']));

                return array('customer_id'=>$openid, 'customer_nickname'=>$info['nickname'], 'sex'=>$info['sex']);
            }
        }
    }
}