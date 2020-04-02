<?php
require '../../config/session.php';
require '../../config/database.php';
require '../../config/paginations.php';
require '../../config/email/class.phpmailer.php';
require '../../config/email/serveremail.php';




/* -------------------------------------------------------------
Register Custom Platform
---------------------------------------------------------------*/

if($_POST['type']=='merchant_customplatform_registration'){
	require 'controller/customplatform.php';
    $error=0;
    $error_array = array();
    $obj  = json_decode($_POST['info'],true);

		$website_url 						='';
    $store_name             ='';
    $email                  ='';
    $password               ='';
    $confirmpassword        ='';
    $checkagree             ='';


		if(empty($obj['website_url'])){
        $error=1;
        $error_array['website_url'] ='This is required.';
    }

		if(!empty($obj['website_url'])){
			if($custom->checkurl($obj['website_url'])>0){
				$error=1;
        $error_array['website_url'] ='Website is already used';
			}
    }


    if(empty($obj['store_name'])){
        $error=1;
        $error_array['store_name'] ='This is required.';
    }

		if(!empty($obj['store_name'])){
			if($custom->checkstore($obj['store_name'])>0){
				$error=1;
        $error_array['store_name'] ='Store name is already taken.';
			}
    }


    if(empty($obj['email'])){
        $error=1;
        $error_array['email'] ='This is required.';
    }

    if(!empty($obj['email'])){
        if (!filter_var($obj['email'], FILTER_VALIDATE_EMAIL)) {
            $error=1;
            $error_array['email'] ='Input a valid email';
        }else{
            if($custom->checkingEmailFunction($obj['email'])>0){
                $error=1;
                $error_array['email'] ='Email is already taken.';
            }
        }
    }


    if(empty($obj['password'])){
        $error=1;
        $error_array['password'] ='This is required.';
    }

    if(!empty($obj['password'])){
        if(empty($obj['confirmpassword'])){
            $error=1;
            $error_array['confirmpassword'] ='This is required.';
        }else{
            if($obj['confirmpassword']!=$obj['password']){
                $error=1;
                $error_array['confirmpassword'] ='Confirm password does not match';
            }
        }
    }


    if($obj['checkagree']==false){
        $error=1;
        $error_array['checkagree'] ='This is required.';
    }


    if($error==1){
        echo json_encode($error_array);exit;
    }else{

        $arg = array(
						'website_url'       => $obj['website_url'],
            'store_name'        => $obj['store_name'],
            'email'             => $obj['email'],
            'password'          => $obj['password'],
        );

        $return = $custom->RegisteredMerchant($arg);

				if($return=='1'){
					require '../../config/email/merchant/welcome.php';
					require '../../config/email/merchant/welcome_notification.php';
					MerchantWelcomRegisterNotification($obj['store_name'],$obj['email']);
					echo MerchantWelcomRegister($obj['store_name'],$obj['email']);
				}else{
					echo $return;
				}


    }
}




/* -------------------------------------------------------------
Register For Shopify
---------------------------------------------------------------*/

/* Shopify Verified */
if($_POST['type']=='shopify_verification'){
	require 'controller/shopify.php';
	$obj  = json_decode($_POST['info'],true);
	$arg = array(
		'code' => $obj['code'],
		'hmac' => $obj['hmac'],
		'shop' => $obj['shop'],
	);
	echo $shopify->ShopifySetup($arg);
}



if($_POST['type']=='merchant_regisration_shopify'){
	require 'controller/shopify.php';
    $error=0;
    $error_array = array();
    $obj  = json_decode($_POST['info'],true);

    $store_name             ='';
    $email                  ='';
    $password               ='';
    $checkagree             ='';


		if(empty($obj['shop'])||empty($obj['hmac'])||empty($obj['code'])){
				echo 'invalid_store';die();
		}else{

			$arg = array(
	      'code' => $obj['code'],
	      'hmac' => $obj['hmac'],
	      'shop' => $obj['shop'],
	    );

			if($shopify->ShopifySetup($arg)==0){
				echo 'invalid_store';die();
			}
		}



		if(empty($obj['store_name'])){
				$error=1;
				$error_array['store_name'] ='This is required.';
		}


		if(!empty($obj['store_name'])){
			if($shopify->checkstore($obj['store_name'])>0){
				$error=1;
        $error_array['store_name'] ='Store name is already taken.';
			}
    }


    if(empty($obj['email'])){
        $error=1;
        $error_array['email'] ='This is required.';
    }

    if(!empty($obj['email'])){
        if (!filter_var($obj['email'], FILTER_VALIDATE_EMAIL)) {
            $error=1;
            $error_array['email'] ='Input a valid email';
        }else{
            if($shopify->checkingEmailFunction($obj['email'])>0){
                $error=1;
                $error_array['email'] ='Email is already taken.';
            }
        }
    }



    if(empty($obj['password'])){
        $error=1;
        $error_array['password'] ='This is required.';
    }


    if($obj['checkagree']==false){
        $error=1;
        $error_array['checkagree'] ='This is required.';
    }


    if($error==1){
        echo json_encode($error_array);exit;
    }else{

        $arg = array(
            'store_name'        => $obj['store_name'],
            'email'             => $obj['email'],
            'password'          => $obj['password'],
						'website_url'       => $obj['website_url'],
						'shopify_token'     => $obj['shopify_token'],
						'code' 							=> $obj['code'],
			      'hmac' 							=> $obj['hmac'],
			      'shop' 							=> $obj['shop'],
        );

        $return = $shopify->RegisteredMerchant($arg);

				if($return=='1'){
					require '../../config/email/merchant/welcome.php';
					require '../../config/email/merchant/welcome_notification.php';
					MerchantWelcomRegisterNotification($obj['store_name'],$obj['email']);
					echo MerchantWelcomRegister($obj['store_name'],$obj['email']);
				}else{
					echo $return;
				}


    }
}


/* -------------------------------------------------------------
Register Woocomerce Platform
---------------------------------------------------------------*/

if($_POST['type']=='merchant_regisration_woocommerce'){
	require 'controller/woocommerce.php';
    $error=0;
    $error_array = array();
    $obj  = json_decode($_POST['info'],true);

		$website_url 						='';
    $store_name             ='';
    $email                  ='';
    $password               ='';
    $confirmpassword        ='';
    $checkagree             ='';


    if(empty($obj['store_name'])){
        $error=1;
        $error_array['store_name'] ='This is required.';
    }

		if(!empty($obj['store_name'])){
			if($woo->checkstore($obj['store_name'])>0){
				$error=1;
        $error_array['store_name'] ='Store name is already taken.';
			}
    }


    if(empty($obj['email'])){
        $error=1;
        $error_array['email'] ='This is required.';
    }

    if(!empty($obj['email'])){
        if (!filter_var($obj['email'], FILTER_VALIDATE_EMAIL)) {
            $error=1;
            $error_array['email'] ='Input a valid email';
        }else{
            if($woo->checkingEmailFunction($obj['email'])>0){
                $error=1;
                $error_array['email'] ='Email is already taken.';
            }
        }
    }


    if(empty($obj['password'])){
        $error=1;
        $error_array['password'] ='This is required.';
    }

    if(!empty($obj['password'])){
        if(empty($obj['confirmpassword'])){
            $error=1;
            $error_array['confirmpassword'] ='This is required.';
        }else{
            if($obj['confirmpassword']!=$obj['password']){
                $error=1;
                $error_array['confirmpassword'] ='Confirm password does not match';
            }
        }
    }


    if($obj['checkagree']==false){
        $error=1;
        $error_array['checkagree'] ='This is required.';
    }


    if($error==1){
        echo json_encode($error_array);exit;
    }else{

        $arg = array(
						'website_url'       => $obj['website_url'],
            'store_name'        => $obj['store_name'],
            'email'             => $obj['email'],
            'password'          => $obj['password'],
        );

        $return = $woo->RegisteredMerchant($arg);

				if($return=='1'){
					require '../../config/email/merchant/welcome.php';
					require '../../config/email/merchant/welcome_notification.php';
					MerchantWelcomRegisterNotification($obj['store_name'],$obj['email']);
					echo MerchantWelcomRegister($obj['store_name'],$obj['email']);
				}else{
					echo $return;
				}


    }
}
