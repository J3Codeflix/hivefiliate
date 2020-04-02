<?php
  require_once("../inc/settings.php");

  define('SHOPIFY_APP_SECRET', 'a0f4c207f539ab762fe528631c74672ae09dd6ee369627d77cdd3c207f746ca6');

  function verify_webhook($data, $hmac_header){
    $calculated_hmac = base64_encode(hash_hmac('sha256', $data, SHOPIFY_APP_SECRET, true));
    return hash_equals($hmac_header, $calculated_hmac);
  }

  $hmac_header = $_SERVER['HTTP_X_SHOPIFY_HMAC_SHA256'];
  $data = file_get_contents('php://input');
  $verified = verify_webhook($data, $hmac_header);
  $verified = var_export($verified, true);

  error_log('Webhook verified customer_data_erasure: '.$verified);


  /*if($verified=='true'){
    $webhook_payload = json_decode($data, true);

    $shop_id         = $webhook_payload['shop_id'];
    $shop_domain     = $webhook_payload['shop_domain'];
    $customer_id     = $webhook_payload['customer']['id'];

    $app->shopEraseWebhook($shop_domain);

  }*/
  //error_log('Webhook verified: '.var_export($verified, true));


?>
