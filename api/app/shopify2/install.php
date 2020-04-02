<?php
require_once("inc/settings.php");
$shop = $_GET['shop'];
$api_key = APIkey();
$scopes = "read_customers,read_script_tags,write_script_tags,read_checkouts,read_orders";
//$scopes = "read_customers,read_script_tags,write_script_tags,read_checkouts,write_checkouts,read_orders,write_products";
$redirect_uri = baseurlapp()."/api/app/shopify/";
// Build install/approval URL to redirect to
$install_url = "https://" . $shop . "/admin/oauth/authorize?client_id=" . $api_key . "&scope=" . $scopes . "&redirect_uri=" . urlencode($redirect_uri);
// Redirect
header("Location: " . $install_url);
die();
