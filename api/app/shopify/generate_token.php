<?php
require_once("inc/config.php");
require_once("inc/install_scriptag.php");
require_once("inc/recurring_charge.php");
require_once("inc/web_hook.php");

$api_key = APIkey();
$shared_secret = APIsecret();

$params = $_GET; // Retrieve all request parameters
$hmac = $_GET['hmac']; // Retrieve HMAC request parameter


$shopify_code         = $_GET['code'];
$shopify_hmac         = $_GET['hmac'];
$shopify_shop         = $_GET['shop'];
$shopify_timestamp    = $_GET['timestamp'];
$weburl    						= baseurlapp();


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
	$result 						  = json_decode($result, true);
	$access_token 			  = $result['access_token'];
	$subdomain 						= subdomain($params['shop']);

	$shopify_code   			= $params['code'];
	$shopify_hmac   			= $hmac;
	$shopify_shop   			= $params['shop'];
	$shopify_timestamp   	= $shopify_timestamp;
	$access_token   			= $access_token;
	$sub_shop   					= $subdomain;


	/* ---------------------------------------------------------------------------
	If app is not installed on shopify
	----------------------------------------------------------------------------*/

	if($app->checkexistapp($shopify_shop)==0){

		/* Webhook for uninstalled app*/
    WebhookappUinstalled($shopify_shop,$access_token);
		WebhookOrders($shopify_shop,$access_token);
		WebhookOrdersPaid($shopify_shop,$access_token);


	  /* Install Scrip tag*/
		InstallScript($access_token,$sub_shop,$weburl);

		/* Save Access Token */
	  $app->SaveInstallApi($access_token,$shopify_shop,$shopify_hmac,$shopify_code,$shopify_timestamp);

		/* Billing api */
		RecurringCharge($access_token,$sub_shop,$weburl);

		die();

	}


	/* ---------------------------------------------------------------------------
	If app is already installed
	----------------------------------------------------------------------------*/

	/* If app is installed and not completed for affiliate signup process */
	if($app->checkmerchantsignup($shopify_shop)>0){
		 echo '<script>top.window.location ="'. $weburl.'/signup/shopify/account/'.$app->getqueryshopurlprocess($shopify_shop).'"</script>';
		 die();
	}

	/* Permission to login to hivefiliate account */
	$app->shopifypermitologin($shopify_shop);


	echo '<script>top.window.location ="'. $weburl.'/login"</script>';
	die();


}else{

	/* THe Request is not from shopify */
	echo '<script>top.window.location ="'. $weburl.'/signup"</script>';
	die();

}
