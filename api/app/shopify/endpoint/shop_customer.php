<?php
  require_once("../inc/config.php");

  define('SHOPIFY_APP_SECRET', APIsecret());

  function verify_webhook($data, $hmac_header){
    $calculated_hmac = base64_encode(hash_hmac('sha256', $data, SHOPIFY_APP_SECRET, true));
    return hash_equals($hmac_header, $calculated_hmac);
  }

  $hmac_header  = $_SERVER['HTTP_X_SHOPIFY_HMAC_SHA256'];
  $data         = file_get_contents('php://input');
  $verified     = verify_webhook($data, $hmac_header);
  $verified     = var_export($verified, true);
  $data         = json_decode($data, true);


  if($verified=='true'){

    $discount_codes_code     = '';
    $discount_codes_amount   = '';
    $discount_codes_type     = '';


    $order_id                = $data['id'];
    $total_price             = $data['total_price'];
    $referring_site          = $data['order_status_url'];
    $browser_ip              = $data['browser_ip'];

    $order_status            = $data['financial_status'];

    if(!empty($data['discount_codes'])){
      if(count($data['discount_codes'])){

        if(!empty($data['discount_codes']['0']['code'])){     $discount_codes_code     = $data['discount_codes']['0']['code'];}
        if(!empty($data['discount_codes']['0']['amount'])){   $discount_codes_amount   = str_replace(',','', $data['discount_codes']['0']['amount']);}
        if(!empty($data['discount_codes']['0']['type'])){     $discount_codes_type     = $data['discount_codes']['0']['type'];}

      }
    }

    $discount_array = array(
      'discount_codes_code'     => $discount_codes_code,
      'discount_codes_amount'   => $discount_codes_amount,
      'discount_codes_type'     => $discount_codes_type,
    );

    $data_array = array(
      'discount_codes_code'     => $discount_codes_code,
      'discount_codes_amount'   => $discount_codes_amount,
      'discount_codes_type'     => $discount_codes_type,
      'order_id'                => $order_id,
      'total_price'             => $total_price,
      'order_status'            => $order_status,
      'referring_site'          => $referring_site,
      'browser_ip'              => $browser_ip,
    );



    $return = $app->WebhookOrdersCreate($order_id,$total_price,$order_status,$referring_site,$browser_ip,$discount_array);


  }
