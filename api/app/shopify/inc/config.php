<?php
require '/home/hiveelia/public_html/api/hive/config/session.php';
require '/home/hiveelia/public_html/api/hive/config/database.php';
class Controller extends Database{

  public function __construct(){
      $this->conn       = $this->getConnection();
      $this->session    = $this->MerchantSessionHandler();
	}

  /* -----------------------------------------------
  ---------------Check if app is already installed----------------*/

  function checkexistapp($shopify_shop){
    $query ="select * from integration_app WHERE app_name=:app_name";
    $stmt = $this->conn->prepare($query);
    $stmt->bindValue(':app_name',$shopify_shop);
    $stmt->execute();
    return $stmt->rowCount();
  }



  /* -----------------------------------------------
  ---------------Update If existing----------------*/

  function UpdateApp($shopify_shop,$id){

      $this->conn->query("SET SESSION sql_mode=''");
			$query ="UPDATE integration_app
							SET
							id_merchant=:id_merchant
              WHERE app_name=:app_name";
			$stmt = $this->conn->prepare($query);
			$stmt->bindValue(':app_name',$shopify_shop);
			$stmt->bindValue(':id_merchant',$id);
			if($stmt->execute()){
          SetSessionHandler($id);
					return 1;
			}else{
					return 0;
			}

	}


  function IsexistingShopify($shopify_shop){
    $query ="select * from merchant WHERE type_platform='shopify' and website_url=:website_url";
    $stmt = $this->conn->prepare($query);
    $stmt->bindValue(':website_url',$shopify_shop);
    $stmt->execute();
    if($stmt->rowCount()==0){
      return 0;
    }
    $row = $stmt->fetch(PDO::FETCH_ASSOC);
    return $row['id'];
  }

  /* -----------------------------------------------
  ---------------Saving Shopify----------------*/

	function SaveInstallApi($access_token,$shopify_shop,$shopify_hmac,$shopify_code,$shopify_timestamp){

        if($this->checkexistapp($shopify_shop)>0){return 0;}

        $this->conn->query("SET SESSION sql_mode=''");
  			$query ="INSERT INTO integration_app
  							SET
  							token_id=:token_id,
  							app_name=:app_name,
                code=:code,
                hmac=:hmac,
                timestamp=:timestamp,
                dateadded=:dateadded";
  			$stmt = $this->conn->prepare($query);
  			$stmt->bindValue(':token_id',$access_token);
  			$stmt->bindValue(':app_name',$shopify_shop);
        $stmt->bindValue(':code',$shopify_code);
        $stmt->bindValue(':hmac',$shopify_hmac);
        $stmt->bindValue(':timestamp',$shopify_timestamp);
        $stmt->bindValue(':dateadded',date('Y-m-d'));
  			if($stmt->execute()){
            $id = $this->IsexistingShopify($shopify_shop);
            if($id>0){
                $this->UpdateApp($shopify_shop,$id);
            }
  					return 1;
  			}else{
  					return 0;
  			}
	}


  /* Check Installed Shopify */
  function checkAuthorizationID($token_id,$shop){
    $query ="select * from integration_app WHERE token_id=:token_id and app_name=:app_name";
    $stmt = $this->conn->prepare($query);
    $stmt->bindValue(':token_id',$token_id);
    $stmt->bindValue(':app_name',$shop);
    $stmt->execute();
    return $stmt->rowCount();
  }

  /* Get Access Token */
  function AccessToken($shop){
    $query ="select * from integration_app WHERE app_name=:app_name limit 1";
    $stmt = $this->conn->prepare($query);
    $stmt->bindValue(':app_name',$shop);
    $stmt->execute();
    if($stmt->rowCount()==0){
      return 0;
    }else{
      $row = $stmt->fetch(PDO::FETCH_ASSOC);
      return $row['token_id'];
    }
  }


  /*--------------------------------------------------------
   Webhook Enpoint ----------------------------------------*/

  function shopEraseWebhook($shop_domain){

    $query ="DELETE FROM integration_app WHERE app_name=:app_name";
    $stmt = $this->conn->prepare($query);
    $stmt->bindValue(':app_name',$shop_domain);
    if($stmt->execute()){return 1;}else{return 0;}

  }


  /*-----------------------------------------------------------
   Check Store -----------------------------------------------*/
  function shopwebsiteurl($shop){
    $query ="select * from integration_app WHERE app_name=:app_name limit 1";
    $stmt = $this->conn->prepare($query);
    $stmt->bindValue(':app_name',$shop);
    $stmt->execute();
    return $stmt->rowCount();
  }


  /*-----------------------------------------------------------
   Save Activated Recurring Charge ID -------------------------*/

   function getqueryshop($shop){
     $query ="select * from integration_app WHERE app_name=:app_name limit 1";
     $stmt = $this->conn->prepare($query);
     $stmt->bindValue(':app_name',$shop);
     $stmt->execute();
     $row = $stmt->fetch(PDO::FETCH_ASSOC);
     return "?code=".$row['code']."&hmac=".$row['hmac']."&shop=".$row['app_name']."&timestamps=".$row['timestamp'];
   }

   function SaveActivatedRecurringID($shopify_shop,$charge_id){
       $this->conn->query("SET SESSION sql_mode=''");
 			 $query ="UPDATE integration_app
 							SET
 							charge_id=:charge_id
              WHERE app_name=:app_name";
 			 $stmt = $this->conn->prepare($query);
 			 $stmt->bindValue(':charge_id',$charge_id);
 			 $stmt->bindValue(':app_name',$shopify_shop);
 			if($stmt->execute()){
 					return 1;
 			}else{
 					return 0;
 			}
 	}

  /* If app is installed and not completed for signup process */
  function checkmerchantsignup($shopify_shop){
    $query ="select * from integration_app WHERE app_name=:app_name and id_merchant=0";
    $stmt = $this->conn->prepare($query);
    $stmt->bindValue(':app_name',$shopify_shop);
    $stmt->execute();
    return $stmt->rowCount();
  }
  function getqueryshopurlprocess($shop){
    $query ="select * from integration_app WHERE app_name=:app_name and id_merchant=0 limit 1";
    $stmt = $this->conn->prepare($query);
    $stmt->bindValue(':app_name',$shop);
    $stmt->execute();
    $row = $stmt->fetch(PDO::FETCH_ASSOC);
    return "?code=".$row['code']."&hmac=".$row['hmac']."&shop=".$row['app_name']."&timestamps=".$row['timestamp'];
  }



  /* If app already installed and authorized to login to hivefiliate */
  function getmerchantid($shopify_shop){
    $query ="select * from integration_app WHERE app_name=:app_name and id_merchant!=0";
    $stmt = $this->conn->prepare($query);
    $stmt->bindValue(':app_name',$shopify_shop);
    $stmt->execute();
    $row = $stmt->fetch(PDO::FETCH_ASSOC);
    return $row['id_merchant'];
  }
  function shopifypermitologin($shopify_shop){
    $query ="select * from integration_app WHERE app_name=:app_name and id_merchant!=0";
    $stmt = $this->conn->prepare($query);
    $stmt->bindValue(':app_name',$shopify_shop);
    $stmt->execute();
    if($stmt->rowCount()>0){
      SetSessionHandler($this->getmerchantid($shopify_shop));
    }
  }



  /* ---------------------------------------------------------------------------------------------------------------------------------------------
        Webhook Endpoint Orders
  ------------------------------------------------------------------------------------------------------------------------------------------------*/

  function domainstore($url){
    $domain = parse_url($url, PHP_URL_HOST);
    $domain = preg_replace('/^www\./', '', $domain);
    return $domain;
  }

  /* Get IP Address */
  function getUserIpAddr(){
			if(!empty($_SERVER['HTTP_CLIENT_IP'])){
					$ip = $_SERVER['HTTP_CLIENT_IP'];
			}elseif(!empty($_SERVER['HTTP_X_FORWARDED_FOR'])){
					$ip = $_SERVER['HTTP_X_FORWARDED_FOR'];
			}else{
					$ip = $_SERVER['REMOTE_ADDR'];
			}
			return $ip;
	}

  /* Get user agent */
	function userAgent() {
			return $_SERVER["HTTP_USER_AGENT"];
	}

  /* Commission Fee */
  function CommissionFee($id,$price){
			$query ="select * from affiliates WHERE id=:id";
			$stmt = $this->conn->prepare($query);
			$stmt->bindValue(':id',$id);
			$stmt->execute();
			if($stmt->rowCount()==0){return 0;}
			$row = $stmt->fetch(PDO::FETCH_ASSOC);
			if($row['type_com']=='1'){
				 $percent = $row['com_percent']/100;
				 $price 	= $price;
				 return ($percent*$price);
			}else{
				 return $row['flat_rate'];
			}
	}


  function getmerchant_id($id){
    $query ="select * from affiliates WHERE id=:id";
    $stmt = $this->conn->prepare($query);
    $stmt->bindValue(':id',$id);
    $stmt->execute();
    $row = $stmt->fetch(PDO::FETCH_ASSOC);
    return $row['id_merchant'];
  }

  function getcreditoaffiliate($ip,$shop){
    $date = date('Y-m-d');
    $query ="select * from shop_trackcustomer WHERE ip_address=:ip_address and shop=:shop and date_expire>='".$date."' order by id desc";
    $stmt = $this->conn->prepare($query);
    $stmt->bindValue(':ip_address',$ip);
    $stmt->bindValue(':shop',$shop);
    $stmt->execute();

    if($stmt->rowCount()==0){
      return 0;
    }

    $row = $stmt->fetch(PDO::FETCH_ASSOC);
    return $row['id_affiliate'];
  }


  function creditomerchant($shopurl){
      $query ="select * from merchant WHERE website_url=:website_url";
      $stmt = $this->conn->prepare($query);
      $stmt->bindValue(':website_url',$shopurl);
      $stmt->execute();
      $row = $stmt->fetch(PDO::FETCH_ASSOC);
      return $row['id'];
  }



  /* Credit to Affiliate with coupon code */

  function getmerchanaff($couponcode){
    if(empty($couponcode)){return 0;}
    $query ="select * from affiliates WHERE coupon_code=:coupon_code";
    $stmt = $this->conn->prepare($query);
    $stmt->bindValue(':coupon_code',$couponcode);
    $stmt->execute();
    if($stmt->rowCount()==0){return 0;}
    $row = $stmt->fetch(PDO::FETCH_ASSOC);
    return array(
      'id_merchant' => $row['id_merchant'],
      'id_aff'  => $row['id'],
    );
  }


  // Order Update
  function checkexistingorder($id){
    $query ="select * from orders WHERE order_id=:order_id";
    $stmt = $this->conn->prepare($query);
    $stmt->bindValue(':order_id',$id);
    $stmt->execute();
    return $stmt->rowCount();
  }

  function WeebhookUpdateOrder($order_id,$order_status){
    if($order_status=='paid'){
      $query ="UPDATE orders
              SET
              order_status=:order_status
              WHERE order_id=:order_id";
      $stmt = $this->conn->prepare($query);
      $stmt->bindValue(':order_id',$order_id);
      $stmt->bindValue(':order_status','Paid');
      if($stmt->execute()){
        return 'Status_paidorder';
      }else{
        return 0;
      }
    }
  }


  function WebhookOrdersCreate($order_id,$total_price,$order_status,$referring_site,$browser_ip,$discount_array){

        if($this->checkexistingorder($order_id)>0){
           return $this->WeebhookUpdateOrder($order_id,$order_status);
        }

       $type_tracking  = 'Tracking by link';

       $shop           = $this->domainstore($referring_site);
       $aff            = $this->getcreditoaffiliate($browser_ip,$shop);

       if($aff>0){

         $affiliate_id = $aff;
         $merchant_id  = $this->getmerchant_id($affiliate_id);
         $commfee      = $this->CommissionFee($affiliate_id,$total_price);

       }else{

         $coups             = $this->getmerchanaff($discount_array['discount_codes_code']);

         if($coups!='0'){

           $affiliate_id    = $coups['id_aff'];
           $merchant_id     = $coups['id_merchant'];
           $commfee         = $this->CommissionFee($affiliate_id,$total_price);
           $type_tracking   = 'Tracking by code';


         }else{

           $affiliate_id = 0;
           $merchant_id  = $this->creditomerchant($shop);
           $commfee      = 0;

         }

       }


        $is_order       = 'is_approved';
        $type_tracking  = $type_tracking;
        $date_order     = date('Y-m-d');


        if($order_status=='pending'){

          $order_status   = 'Pending';

        }else if($order_status=='paid'){

          $order_status   = 'Paid';

        }else{

          $order_status   = '';

        }


        $affiliate_earnings = $commfee;
        $ip_address         = $this->getUserIpAddr();
        $device_type        = $this->userAgent();


        $this->conn->query("SET SESSION sql_mode=''");

        $query ="INSERT INTO orders
                SET
                is_order=:is_order,
                merchant_id=:merchant_id,
                affiliate_id=:affiliate_id,
                order_id=:order_id,
                tracking_method=:tracking_method,
                order_price=:order_price,
                aff_earnings=:aff_earnings,
                date_order=:date_order,
                order_status=:order_status,
                location_type=:location_type,
                ip_address=:ip_address,
                device_type=:device_type,
                order_type=:order_type,
                discount_code=:discount_code,
                discount_amount=:discount_amount,
                discount_type=:discount_type,
                dateadded=:dateadded";
        $stmt = $this->conn->prepare($query);
        $stmt->bindValue(':is_order',$is_order);
        $stmt->bindValue(':merchant_id',$merchant_id);
        $stmt->bindValue(':affiliate_id',$affiliate_id);
        $stmt->bindValue(':order_id',$order_id);
        $stmt->bindValue(':tracking_method',$type_tracking);
        $stmt->bindValue(':order_price',$total_price);
        $stmt->bindValue(':aff_earnings',$affiliate_earnings);
        $stmt->bindValue(':date_order',$date_order);
        $stmt->bindValue(':order_status',$order_status);
        $stmt->bindValue(':location_type',$referring_site);
        $stmt->bindValue(':ip_address',$browser_ip);
        $stmt->bindValue(':device_type',$device_type);
        $stmt->bindValue(':order_type',$referring_site);
        $stmt->bindValue(':discount_code',$discount_array['discount_codes_code']);
        $stmt->bindValue(':discount_amount',$discount_array['discount_codes_amount']);
        $stmt->bindValue(':discount_type',$discount_array['discount_codes_type']);
        $stmt->bindValue(':dateadded',date('Y-m-d'));
        if($stmt->execute()){
          return 'Status_pendingorder';
        }else{
          return array(
            '$is_order' => $is_order,
            '$merchant_id' => $merchant_id,
            '$affiliate_id' => $affiliate_id,
            '$order_id' => $order_id,
            '$type_tracking' => $type_tracking,
            '$total_price' => $total_price,
            '$affiliate_earnings' => $affiliate_earnings,
            '$date_order' => $date_order,
            '$order_status' => $order_status,
            '$referring_site' => $referring_site,
            '$browser_ip' => $browser_ip,
            '$device_type' => $device_type,
            '$referring_site' => $referring_site,
          );
        }

  }



}
$app = new Controller();


/* ----------------------------------------------------------------------------------------
  Shopify Call Function
------------------------------------------------------------------------------------------*/

function shopify_call($token, $shop, $api_endpoint, $query = array(), $method = 'GET', $request_headers = array()) {

	// Build URL
	$url = "https://" . $shop . ".myshopify.com" . $api_endpoint;
	if (!is_null($query) && in_array($method, array('GET', 	'DELETE'))) $url = $url . "?" . http_build_query($query);

	// Configure cURL
	$curl = curl_init($url);
	curl_setopt($curl, CURLOPT_HEADER, TRUE);
	curl_setopt($curl, CURLOPT_RETURNTRANSFER, TRUE);
	curl_setopt($curl, CURLOPT_FOLLOWLOCATION, TRUE);
	curl_setopt($curl, CURLOPT_MAXREDIRS, 3);
	curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, FALSE);
	// curl_setopt($curl, CURLOPT_SSL_VERIFYHOST, 3);
	// curl_setopt($curl, CURLOPT_SSLVERSION, 3);
	curl_setopt($curl, CURLOPT_USERAGENT, 'My New Shopify App v.1');
	curl_setopt($curl, CURLOPT_CONNECTTIMEOUT, 30);
	curl_setopt($curl, CURLOPT_TIMEOUT, 30);
	curl_setopt($curl, CURLOPT_CUSTOMREQUEST, $method);

	// Setup headers
	$request_headers[] = "";
	if (!is_null($token)) $request_headers[] = "X-Shopify-Access-Token: " . $token;
	curl_setopt($curl, CURLOPT_HTTPHEADER, $request_headers);

	if ($method != 'GET' && in_array($method, array('POST', 'PUT'))) {
		if (is_array($query)) $query = http_build_query($query);
		curl_setopt ($curl, CURLOPT_POSTFIELDS, $query);
	}

	// Send request to Shopify and capture any errors
	$response = curl_exec($curl);
	$error_number = curl_errno($curl);
	$error_message = curl_error($curl);

	// Close cURL to be nice
	curl_close($curl);

	// Return an error is cURL has a problem
	if ($error_number) {
		return $error_message;
	} else {

		// No error, return Shopify's response by parsing out the body and the headers
		$response = preg_split("/\r\n\r\n|\n\n|\r\r/", $response, 2);

		// Convert headers into an array
		$headers = array();
		$header_data = explode("\n",$response[0]);
		$headers['status'] = $header_data[0]; // Does not contain a key, have to explicitly set
		array_shift($header_data); // Remove status, we've already set it above
		foreach($header_data as $part) {
			$h = explode(":", $part);
			$headers[trim($h[0])] = trim($h[1]);
		}

		// Return headers and Shopify's response
		return array('headers' => $headers, 'response' => $response[1]);

	}

}


/* ----------------------------------------------------------------------------------------
  Settings
------------------------------------------------------------------------------------------*/

function baseurlapp(){
	return 'https://hivefiliate.com';
}
function APIkey(){
  $apikey = "c44edffcbad34d9c49cfd22c1e67aacf";
	return $apikey;
}
function APIsecret(){
  $apisecret = "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";
	return $apisecret;
}

function subdomain($paramshop){
  $parsedUrl = parse_url('https://'.$paramshop);
  $host = explode('.', $parsedUrl['host']);
  $subdomain = $host[0];
  return $subdomain;
}
