<?php
require_once("inc/config.php");

$shopify_url  = "https://hivefiliate.com/signup/shopify";

if(!isset($_GET['shop'])){
  header("Location: " . $shopify_url);
  die();
}
if(isset($_GET['shop'])){
  if(empty($_GET['shop'])){
    header("Location: " . $shopify_url);
    die();
  }
}

$shop         = $_GET['shop'];

$api_key = APIkey();
$scopes = "read_script_tags,write_script_tags,read_checkouts,read_orders";
//$scopes = "read_customers,read_script_tags,write_script_tags,read_checkouts,write_checkouts,read_orders,write_products";
$redirect_uri = baseurlapp()."/api/app/shopify/generate_token.php";

// Build install/approval URL to redirect to
$install_url = "https://" . $shop . "/admin/oauth/authorize?client_id=" . $api_key . "&scope=" . $scopes . "&redirect_uri=" . urlencode($redirect_uri);
// Redirect
header("Location: " . $install_url);
die();
