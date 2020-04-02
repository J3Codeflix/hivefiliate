<?php
header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, X-Requested-With");

require '../../../hive/config/database.php';
require_once 'cookie.php';
require_once 'visit.php';

if ( $_SERVER['REQUEST_METHOD'] == 'POST' ) {

    if(empty($_POST['mode_type'])){echo 'invalid_authorization';exit;}

		if($_POST['mode_type']=='cookie_duration'){

       $hivefiliate_id = $_POST['hivefiliate_id'];
       $location_type  = $_POST['location_type'];

       $arg = array(
         'hivefiliate_id' => $hivefiliate_id,
         'location_type' => $location_type,
       );

       error_log('Array Data '.print_r($arg, true));

			 $return_cookie = $app_cookie->getCookieduration($hivefiliate_id,$location_type);

       if($return_cookie>0){
         $app_visit->InsertVisitor($hivefiliate_id,$location_type);
       }

       echo $return_cookie;
		}
}
