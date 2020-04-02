<?php
require '../../config/session.php';
require '../../config/database.php';
require '../../config/paginations.php';


/* Settings General
---------------------------------------------------------------*/
if($_POST['type']=='merchant_settings_general'){
	require 'controller/form.php';
    $error=0;
    $error_array = array();
    $obj  = json_decode($_POST['info'],true);


    $terms              ='';
    $is_send            ='';
    $auto_approved      ='';
    $site_address       ='';


		if(empty($obj['site_address'])){
      $error=1;
      $error_array['site_address'] ='This is required.';
    }

		/*if(!empty($obj['site_address'])){
			$url = $obj['site_address'];
			$headers = @get_headers($url);
			if($headers && strpos( $headers[0], '200')) {
			}else{
				 $error=1;
				 $error_array['site_address'] ='The site you entered is not accessible. Please enter a valid site address';
			}
    }*/




    if($error==1){
        echo json_encode($error_array);exit;
    }else{

        if(!empty($obj['terms'])){              $terms           = $obj['terms'];}
        if(!empty($obj['is_send'])){            $is_send         = $obj['is_send'];}
        if(!empty($obj['auto_approved'])){      $auto_approved   = $obj['auto_approved'];}
        if(!empty($obj['site_address'])){       $site_address    = $obj['site_address'];}

        $arg = array(
            'terms'             => $terms,
            'is_send'           => $is_send,
            'auto_approved'     => $auto_approved,
            'site_address'      => $site_address,
        );

        echo json_encode($form->SaveSettingsGeneral($arg));
    }
}

if($_POST['type']=='merchant_settingsgeneral'){
    require 'controller/form.php';
    echo json_encode($form->SettingsGeneralInfo());
}


/* Settings Tracking
---------------------------------------------------------------*/
if($_POST['type']=='merchant_settings_tracking'){
	require 'controller/form.php';
    $error=0;
    $error_array = array();
    $obj  = json_decode($_POST['info'],true);


    $cookie_duration         ='';
    $commission_type         ='';
    $commission_percent      ='';
		$flat_rate 							 ='';
		$typecom_update 				 ='';
		$cookie_update 					 ='';
		$coupon_code 					 	 ='';
		$coupon_update 					 ='';


    if(empty($obj['cookie_duration'])){
        $error=1;
        $error_array['cookie_duration'] ='This is required.';
    }
    if(empty($obj['commission_type'])){
        $error=1;
        $error_array['commission_type'] ='This is required.';
    }
    if(empty($obj['commission_percent'])){
        $error=1;
        $error_array['commission_percent'] ='This is required.';
    }
		if(empty($obj['flat_rate'])){
        $error=1;
        $error_array['flat_rate'] ='This is required.';
    }


    if($error==1){
        echo json_encode($error_array);exit;
    }else{

        if(!empty($obj['cookie_duration'])){         $cookie_duration      = $obj['cookie_duration'];}
        if(!empty($obj['commission_type'])){         $commission_type      = $obj['commission_type'];}
        if(!empty($obj['commission_percent'])){      $commission_percent   = $obj['commission_percent'];}
				if(!empty($obj['flat_rate'])){      				 $flat_rate   				 = str_replace(',', '', $obj['flat_rate']);}
				if(!empty($obj['typecom_update'])){      		 $typecom_update   		 = $obj['typecom_update'];}
				if(!empty($obj['cookie_update'])){      		 $cookie_update   		 = $obj['cookie_update'];}
				if(!empty($obj['coupon_code'])){      		   $coupon_code   		 	 = $obj['coupon_code'];}
				if(!empty($obj['coupon_update'])){      		 $coupon_update   		 = $obj['coupon_update'];}

        $arg = array(
            'cookie_duration'        	=> $cookie_duration,
            'commission_type' 				=> $commission_type,
            'commission_percent'     	=> $commission_percent,
						'flat_rate'     					=> $flat_rate,
						'typecom_update'     		  => $typecom_update,
						'cookie_update'     	    => $cookie_update,
						'coupon_code'     	    	=> $coupon_code,
						'coupon_update'     	    => $coupon_update,
        );

        echo json_encode($form->SaveSettingsTracking($arg));
    }
}

if($_POST['type']=='merchant_settingstracking'){
    require 'controller/form.php';
    echo json_encode($form->SettingsTrackingInfo());
}


/* Settings Payment
---------------------------------------------------------------*/

if($_POST['type']=='merchant_settings_payment'){
	require 'controller/form.php';
    $error=0;
    $error_array = array();
    $obj  = json_decode($_POST['info'],true);


    $min_payment             ='';
		$is_update               ='';

    if(empty($obj['min_payment'])){
        $error=1;
        $error_array['min_payment'] ='This is required.';
    }

    if($error==1){
        echo json_encode($error_array);exit;
    }else{

        if(!empty($obj['min_payment'])){      $min_payment   = str_replace(',', '', $obj['min_payment']);}
				if(!empty($obj['is_update'])){      	$is_update     = $obj['is_update'];}

        $arg = array(
            'min_payment'  	=> $min_payment,
						'is_update'  		=> $is_update,
        );

        echo json_encode($form->SaveSettingsPayment($arg));
    }
}

if($_POST['type']=='merchant_settingspayment'){
    require 'controller/form.php';
    echo json_encode($form->SettingsPaymentInfo());
}
