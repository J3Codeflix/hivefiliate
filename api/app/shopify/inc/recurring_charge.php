<?php
function RecurringCharge($access_token,$shop,$weburl){
  $recurring_array = array(
    "recurring_application_charge" => array(
      "name" => "Hivefiliate: Tracking App",
      "price" => 29.0,
      "trial_days" => 14,
      "test" => true,
      "return_url" => $weburl."/api/app/shopify/recurring_activate.php?" . $_SERVER['QUERY_STRING']
    )
  );
  $reccuring_charge = shopify_call($access_token,$shop,"/admin/api/2019-10/recurring_application_charges.json", $recurring_array, "POST");
  $reccuring_charge = json_decode($reccuring_charge['response'], JSON_PRETTY_PRINT);
  echo '<script>top.window.location ="'. $reccuring_charge['recurring_application_charge']['confirmation_url'].'"</script>';
}
