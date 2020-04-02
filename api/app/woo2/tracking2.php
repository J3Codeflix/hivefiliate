<?php
header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, X-Requested-With");

require '../../hive/config/database.php';
require 'inc/install.php';
require 'inc/uninstall.php';
require 'inc/order.php';
require 'inc/visit.php';

if ( $_SERVER['REQUEST_METHOD'] == 'POST' ) {

  /*-----------------------------------
  ------Install host--------------- */

  if($_POST['type']=='install'){

    $type         = $_POST['type'];
    $domain_url   = $_POST['domain_url'];
    $user_ip      = $_POST['user_ip'];

    $arg = array(
      'domain_url' => $domain_url,
      'user_ip'    => $user_ip
    );

    $install->installwooplugin($arg);
  }


  /*-----------------------------------
  ------Remove Host Info--------------- */

  if($_POST['type']=='uninstall'){

    $type         = $_POST['type'];
    $domain_url   = $_POST['domain_url'];
    $user_ip      = $_POST['user_ip'];

    $arg = array(
      'domain_url' => $domain_url,
      'user_ip'    => $user_ip
    );

    $uninstall->uninstallwooplugin($arg);
  }

  /*----------------------------------------------
  ------------------Track Order------------------ */

  if($_POST['type']=='order'){


    $order_id           = '';
    $order_key          = '';
    $order_total        = '';
    $domain_url         = '';
    $user_ip            = '';

    $coupon_type        = '';
    $coupon_code        = '';
    $coupon_amount      = '';

    $user_agent         = '';

    if(!empty($_POST['order_id'])){       $order_id           = $_POST['order_id'];     }
    if(!empty($_POST['order_key'])){      $order_key          = $_POST['order_key'];    }
    if(!empty($_POST['order_total'])){    $order_total        = $_POST['order_total'];  }
    if(!empty($_POST['domain_url'])){     $domain_url         = $_POST['domain_url'];   }
    if(!empty($_POST['user_ip'])){        $user_ip            = $_POST['user_ip'];      }
    if(!empty($_POST['coupon_type'])){    $coupon_type        = $_POST['coupon_type'];  }
    if(!empty($_POST['coupon_code'])){    $coupon_code        = $_POST['coupon_code'];  }
    if(!empty($_POST['coupon_amount'])){  $coupon_amount      = $_POST['coupon_amount'];}

    if(!empty($_POST['user_agent'])){     $user_agent         = $_POST['user_agent'];}

    $arg = array(
      'order_id'        => $order_id,
      'order_key'       => $order_key,
      'order_total'     => $order_total,
      'domain_url'      => $domain_url,
      'user_ip'         => $user_ip,
      'coupon_type'     => $coupon_type,
      'coupon_code'     => $coupon_code,
      'coupon_amount'   => $coupon_amount,
      'user_agent'      => $user_agent
    );

    $order->ordertracking($arg);

    //error_log('Webhook Order: '.print_r($_POST['order'], true));
  }


  /*----------------------------------------------
  ------------------Track Visit------------------ */

  if($_POST['type']=='visit'){

    $type           = $_POST['type'];
    $domain_url     = $_POST['domain_url'];
    $user_ip        = $_POST['user_ip'];
    $aff_id         = $_POST['aff_id'];

    $arg = array(
      'domain_url'  => $domain_url,
      'user_ip'     => $user_ip,
      'aff_id'      => $aff_id
    );

    $visit->insertvisit($arg);
    //error_log('Webhook Visit Array: '.print_r($arg, true));

  }


}else{
  die('Permission denied');
}


/*error_log('Webhook Type: '.print_r($type, true));
error_log('Webhook Domain Url: '.print_r($domain_url, true));
error_log('Webhook User IP: '.print_r($user_ip, true));*/
