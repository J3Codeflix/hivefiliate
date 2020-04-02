<?php
// Get our helper functions
require_once("inc/settings.php");
require_once("api_install_script.php");
require_once("billingapi.php");
require_once("webhook.php");
require_once("redirecturl.php");

die();

$affiliatelogin_url 		= "https://hivefiliate.com/login";
$merchantregister_url 	= "https://hivefiliate.com/signup/shopify/account";

// Set variables for our request
$api_key = APIkey();
$shared_secret = APIsecret();
$params = $_GET; // Retrieve all request parameters
$hmac = $_GET['hmac']; // Retrieve HMAC request parameter

$params = array_diff_key($params, array('hmac' => '')); // Remove hmac from params
ksort($params); // Sort params lexographically

$computed_hmac = hash_hmac('sha256', http_build_query($params), $shared_secret);

// Use hmac data to check that the response is from Shopify or not
if (hash_equals($hmac, $computed_hmac)) {

	// Set variables for our request
	$query = array(
		"client_id" => $api_key, // Your API key
		"client_secret" => $shared_secret, // Your app credentials (secret key)
		"code" => $params['code'] // Grab the access key from the URL
	);

	// Generate access token URL
	$access_token_url 		= "https://" . $params['shop'] . "/admin/oauth/access_token";

	// Configure curl client and execute request
	$ch = curl_init();
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
	curl_setopt($ch, CURLOPT_URL, $access_token_url);
	curl_setopt($ch, CURLOPT_POST, count($query));
	curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($query));
	$result = curl_exec($ch);
	curl_close($ch);

	// Store the access token
	$result 				= json_decode($result, true);
	$access_token 	= $result['access_token'];
	$result_token 	= $result['access_token'];

	//redirect to login if existing
	if($access_token==''&&!isset($_GET['charge_id'])){
		echo '<script>top.window.location ="'. $affiliatelogin_url .'"</script>';
		die();
	}

	//echo json_encode($access_token);die();

  // Get access token
	if($access_token==''){
		$access_token = $app->AccessToken($params['shop']);
	}

  // Recuring Charge
	/*if( !isset($_GET['charge_id']) && $result_token!=''){
		ApprovedCharge($access_token,$params['shop']);
	}*/

  // Activate Charge
	if( isset($_GET['charge_id']) && $result_token==''){
			 $activate_charge = ActivateCharge($access_token,$params['shop'],$_GET['charge_id']);
			 echo '<script>top.window.location ="'. $merchantregister_url .'"</script>';
			 die();
	}

  // Install script tag and save access token to the database
	if($result_token!=''){
		ApprovedCharge($access_token,$params['shop']);
		WebhookappUinstalled($params['shop'],$access_token);
		$returnscript = installScript($access_token,$hmac,$params['shop'],baseurlapp());
		$app->SaveInstallApi($returnscript['script_tag']['id'],$access_token,$params['shop'],$hmac,$params['code']);
		$verified_url = '?code='.$params['code'].'&hmac='.$hmac.'&shop='.$params['shop'];
		echo '<script>top.window.location ="'. ProceedtoAccountCreate($verified_url) .'"</script>';
		die();
	 }

	die();

} else {
	die('This request is NOT from Shopify!');
}
