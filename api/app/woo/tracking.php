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

     //error_log('Array Data '.print_r($arg, true));

     $setcookie->settingcookie($arg);

   }


   if($obj['type']=='order'){

     $result = $install->checkapi($arg);
     if($result==0){exit;}


     $order_id           = '';
     $order_key          = '';
     $order_total        = '';
     $domain_url         = '';
     $user_ip            = '';

     $coupon_type        = '';
     $coupon_code        = '';
     $coupon_amount      = '';

     $user_agent         = '';

     if(!empty($obj['order_id'])){       $order_id           = $obj['order_id'];     }
     if(!empty($obj['order_key'])){      $order_key          = $obj['order_key'];    }
     if(!empty($obj['order_total'])){    $order_total        = $obj['order_total'];  }
     if(!empty($obj['domain_url'])){     $domain_url         = $obj['domain_url'];   }
     if(!empty($obj['user_ip'])){        $user_ip            = $obj['user_ip'];      }
     if(!empty($obj['coupon_type'])){    $coupon_type        = $obj['coupon_type'];  }
     if(!empty($obj['coupon_code'])){    $coupon_code        = $obj['coupon_code'];  }
     if(!empty($obj['coupon_amount'])){  $coupon_amount      = $obj['coupon_amount'];}

     if(!empty($obj['user_agent'])){     $user_agent         = $obj['user_agent'];}



     $arg = array(
       'order_id'        => $order_id,
       'order_key'       => $order_key,
       'order_total'     => $order_total,
       'domain_url'      => $domain_url,
       'user_ip'         => $user_ip,
       'coupon_type'     => $coupon_type,
       'coupon_code'     => $coupon_code,
       'coupon_amount'   => $coupon_amount,
       'user_agent'      => $user_agent,
       'order_meta'      => $obj['order_meta'],
       'order'           => $obj['order']
     );


     //error_log('Array Data Order '.print_r($arg, true));

     $order->ordertracking($arg);

   }



   if($obj['type']=='deactivate'){

     $result = $install->checkapi($arg);
     if($result==0){exit;}

     $domain_url     = $obj['domain_url'];

     $arg = array(
       'domain_url'  => $domain_url,
       'public_key'  => $public_key,
       'secret_key'  => $secret_key
     );

     $uninstall->uninstallwooplugin($arg);

   }






}



//error_log('API KEY: '.print_r($arg, true));
//error_log('Data: '.print_r($obj, true));
