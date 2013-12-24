<?php
require(dirname(__FILE__).'/../vendor/autoload.php');
require_once(dirname(__FILE__) . "/../config.php");

use Weapp\Ticket;

$b_data = Ticket::getTicket();

if ($_GET["page"] == "mypay")
{
    $url = "location: http://112.124.55.78/loupan/mypay.html?id=10003.10000&wticket=".$b_data;
}
else
{
    $url = "location: http://112.124.55.78/loupan/pay.html?id=10003.10000&wticket=".$b_data;
}
header($url);
