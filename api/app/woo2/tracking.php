<?php
/*header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, X-Requested-With");*/

require '../../hive/config/database.php';
require 'inc/install.php';
require 'inc/uninstall.php';
require 'inc/order.php';
require 'inc/setcookie.php';

$obj           = json_decode(file_get_contents('php://input'), true);
$public_key    = $_SERVER['HTTP_HIVEFILIATE_PUBLIC_KEY'];
$secret_key    = $_SERVER['HTTP_HIVEFILIATE_SECRET_KEY'];

$arg = array(
  'public_key' => $public_key,
  'secret_key' => $secret_key,
  'domain_url' => $obj['domain_url']
);

if(isset($obj['type'])){

   if($obj['type']=='check_api'){
     $result = $install->checkapi($arg);
     header('Content-Type: application/json');
     $response = array(
        'data' => $result
    );
     echo json_encode($response);
   }

   if($obj['type']=='checkaff_id'){

     $result = $install->checkapi($arg);
     if($result==0){exit;}

     $type           = $obj['type'];
     $domain_url     = $obj['domain_url'];
     $user_ip        = $obj['user_ip'];
     $aff_id         = $obj['aff_id'];

     $arg = array(
       'domain_url'  => $domain_url,
       'user_ip'     => $user_ip,
       'aff_id'      => $aff_id,
       'public_key'  => $public_key,
       'secret_key'  => $secret_key
     );

     $setcookie->settingcookie($arg);

   }


}



//error_log('API KEY: '.print_r($arg, true));
//error_log('Data: '.print_r($obj, true));
