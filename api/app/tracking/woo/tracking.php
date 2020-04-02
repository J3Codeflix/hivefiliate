<?php
header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, X-Requested-With");
require '../../../hive/config/database.php';
require 'install.php';

if ( $_SERVER['REQUEST_METHOD'] == 'POST' ) {
   if($_POST['type']=='install'){
      
   }
}

$type         = $_POST['type'];
$domain_url   = $_POST['domain_url'];
$user_ip      = $_POST['user_ip'];

error_log('Webhook Type: '.print_r($type, true));
error_log('Webhook Domain Url: '.print_r($domain_url, true));
error_log('Webhook User IP: '.print_r($user_ip, true));
