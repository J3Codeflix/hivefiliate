<?php
require_once("inc/config.php");

$return_url           = baseurlapp().'/signup/shopify/account/';

$charge_id            = $_GET['charge_id'];
$shopurl              = $_GET['shop'];
$access_token         = $app->AccessToken($shopurl);

$url                  = parse_url( 'https://' .$shopurl );
$host                 = explode('.', $url['host']);
$shop                 = $host[0];

$shop_array           = $app->getqueryshop($shopurl);

$array = array(
  "recurring_application_charge" => array(
    "id" => $charge_id,
    "name" => "Hivefiliate: Tracking App",
    "price" => 29.0,
    "return_url" => $return_url.$shop_array,
    "billing_on" => null,
    "activated_on" => null,
    "trial_ends_on" => null,
    "cancelled_on" => null,
    "trial_days" => 14,
    "test" => true,
    "decorated_return_url" => "https://" . $shopurl. "/admin/apps/hivefiliate-1/?charge_id=" .$charge_id,
  )
);


$activate = shopify_call($access_token,$shop,"/admin/api/2019-10/recurring_application_charges/" . $charge_id ."/activate.json", $array, "POST");
$activate = json_decode($activate['response'], JSON_PRETTY_PRINT);

if($activate['recurring_application_charge']['status']=='active'){
  $app->SaveActivatedRecurringID($shopurl,$activate['recurring_application_charge']['id']);
  echo '<script>top.window.location ="'. $return_url.$shop_array.'"</script>';
  //$url = $return_url.$shop_array;
  //echo $url;
}else{
  echo '<script>top.window.location ="https://"' . $shopurl. '"/admin/apps"</script>';
}
die();
