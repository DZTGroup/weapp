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

class Ticket{

    // base64
    private static function base64url_encode($data){
        return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
    }

    // gen
    public static function getTicket(){
        $key = "HHd%@jlkkkd*&^HHHLNFS";
        $data = time()."wechat-estate-QWqwedsa!@#tASDQ@#Fasd23";

        $td = \mcrypt_module_open('tripledes', '', 'ecb', '');
        $iv = \mcrypt_create_iv(mcrypt_enc_get_iv_size($td), MCRYPT_RAND);
        \mcrypt_generic_init($td, $key, $iv);
        $encrypted_data = \mcrypt_generic($td, $data);
        \mcrypt_generic_deinit($td);

        \mcrypt_module_close($td);

        return Ticket::base64url_encode($encrypted_data);
    }
}