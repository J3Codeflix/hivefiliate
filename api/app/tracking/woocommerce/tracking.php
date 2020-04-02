<?php
header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, X-Requested-With");

require '../../../hive/config/database.php';
require_once 'cookie.php';
require_once 'visit.php';
require_once 'purchase.php';

if ( $_SERVER['REQUEST_METHOD'] == 'POST' ) {

    if(empty($_POST['mode_type'])){echo 'invalid_authorization';exit;}


    if($_POST['mode_type']=='tracking_purchase'){

      $order_id               = $_POST['order_id'];
      $order_total            = $_POST['order_total'];
      $coupon                 = $_POST['coupon'];
      $location_type          = $_POST['location_type'];

      echo json_encode($purchase_tracking->WebhookOrdersCreate($order_id,$order_total,$coupon,$location_type));

    }

		if($_POST['mode_type']=='cookie_duration'){

       $hivefiliate_id = $_POST['hivefiliate_id'];
       $location_type  = $_POST['location_type'];

			 $return_cookie = $app_cookie->getCookieduration($hivefiliate_id,$location_type);

       if($return_cookie>0){
         $app_visit->InsertVisitor($hivefiliate_id,$location_type);
       }

       echo $return_cookie;
		}
}
