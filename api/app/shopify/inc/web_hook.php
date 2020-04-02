<?php
function WebhookappUinstalled($shopurl,$access_token){

  $url = parse_url( 'https://' .$shopurl );
  $host = explode('.', $url['host']);
  $shop = $host[0];

  $query = array(
    "Content-type" => "application/json"
  );


  $weebhook_data = array(
    'webhook' => array(
      'topic' => 'app/uninstalled',
      'address' => baseurlapp().'/api/app/shopify/endpoint/shop_uninstalled.php?shop=' .$shopurl,
      'format' => 'json'
    )
  );
  $weebhook = shopify_call($access_token,$shop,"/admin/api/2019-10/webhooks.json", $weebhook_data, "POST");
  $weebhook = json_decode($weebhook['response'], JSON_PRETTY_PRINT);
  return $weebhook;
}


function WebhookOrders($shopurl,$access_token){

  $url = parse_url( 'https://' .$shopurl );
  $host = explode('.', $url['host']);
  $shop = $host[0];

  $query = array(
    "Content-type" => "application/json"
  );

  $weebhook_data = array(
    'webhook' => array(
      'topic' => 'orders/create',
      'address' => baseurlapp().'/api/app/shopify/endpoint/shop_customer.php',
      'format' => 'json'
    )
  );
  $weebhook = shopify_call($access_token,$shop,"/admin/api/2019-10/webhooks.json", $weebhook_data, "POST");
  $weebhook = json_decode($weebhook['response'], JSON_PRETTY_PRINT);
  return $weebhook;
}

function WebhookOrdersPaid($shopurl,$access_token){

  $url = parse_url( 'https://' .$shopurl );
  $host = explode('.', $url['host']);
  $shop = $host[0];

  $query = array(
    "Content-type" => "application/json"
  );

  $weebhook_data = array(
    'webhook' => array(
      'topic' => 'orders/paid',
      'address' => baseurlapp().'/api/app/shopify/endpoint/shop_customer.php',
      'format' => 'json'
    )
  );

  
  $weebhook = shopify_call($access_token,$shop,"/admin/api/2019-10/webhooks.json", $weebhook_data, "POST");
  $weebhook = json_decode($weebhook['response'], JSON_PRETTY_PRINT);
  return $weebhook;
}
