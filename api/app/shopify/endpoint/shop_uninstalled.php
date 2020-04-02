<?php
  require_once("../inc/config.php");

  define('SHOPIFY_APP_SECRET', APIsecret());

  function verify_webhook($data, $hmac_header){
    $calculated_hmac = base64_encode(hash_hmac('sha256', $data, SHOPIFY_APP_SECRET, true));
    return hash_equals($hmac_header, $calculated_hmac);
  }

  $hmac_header = $_SERVER['HTTP_X_SHOPIFY_HMAC_SHA256'];
  $data = file_get_contents('php://input');
  $verified = verify_webhook($data, $hmac_header);
  $verified = var_export($verified, true);

  //error_log('Webhook verified shop delete: '.$verified);
  //error_log( print_r($data,TRUE));

  if($verified=='true'){
    $shop_domain     = $_GET['shop'];
    $app->shopEraseWebhook($shop_domain);
  }
  //error_log('Webhook verified: '.var_export($verified, true));
