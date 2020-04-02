<?php
function ApprovedCharge($access_token,$shopurl){

  $url = parse_url( 'https://' .$shopurl );
  $host = explode('.', $url['host']);
  $shop = $host[0];

  $recurring_array = array(
    "recurring_application_charge" => array(
      "name" => "Hivefiliate Tracking App",
      "price" => 29.0,
      "test" => true,
      "trial_days" => 14,
      "return_url" => "https://" . $shop. ".myshopify.com/admin/apps/hivefiliate-1/?" . $_SERVER['QUERY_STRING']
    )
  );
  $reccuring_charge = shopify_call($access_token,$shop,"/admin/api/2019-10/recurring_application_charges.json", $recurring_array, "POST");
  $reccuring_charge = json_decode($reccuring_charge['response'], JSON_PRETTY_PRINT);
  echo '<script>top.window.location ="'. $reccuring_charge['recurring_application_charge']['confirmation_url'].'"</script>';

}

function ActivateCharge($access_token,$shopurl,$charge_id){

    $url = parse_url( 'https://' .$shopurl );
    $host = explode('.', $url['host']);
    $shop = $host[0];

    $array = array(
      "recurring_application_charge" => array(
        "id" => $charge_id,
        "name" => "Hivefiliate Tracking App",
        "price" => 29.0,
        "test" => true,
        "return_url" => "https://" . $shop. ".myshopify.com",
        "billing_on" => null,
        "activated_on" => null,
        "trial_ends_on" => null,
        "cancelled_on" => null,
        "trial_days" => 14,
        "decorated_return_url" => "https://" . $shop. ".myshopify.com/admin/apps/hivefiliate-1/?charge_id=" .$charge_id,
      )
    );
    $activate = shopify_call($access_token,$shop,"/admin/api/2019-10/recurring_application_charges/" . $charge_id ."/activate.json", $array, "POST");
    $activate = json_decode($activate['response'], JSON_PRETTY_PRINT);
    return $activate;

}
