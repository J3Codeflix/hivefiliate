<?php
require '../../config/session.php';
require '../../config/database.php';
require '../../config/email/class.phpmailer.php';
require '../../config/email/serveremail.php';

/* Register Affiliates
---------------------------------------------------------------*/
if($_POST['type']=='affiliate_register'){
	require 'controller/form.php';
    $error=0;
    $error_array = array();
    $obj  = json_decode($_POST['info'],true);

    $first_name             ='';
    $last_name               ='';
    $email                  ='';
    $password               ='';
    $confirmpassword        ='';
    $checkagree             ='';



    if(empty($obj['first_name'])){
        $error=1;
        $error_array['first_name'] ='This is required.';
    }
    if(empty($obj['last_name'])){
        $error=1;
        $error_array['last_name'] ='This is required.';
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
            if($form->checkemail($obj['email'])>0){
                $error=1;
                $error_array['email'] ='Email is already taken.';
            }
        }
    }
    /*if(!empty($obj['email'])&&!empty($obj['password'])){
        if($obj['email']==$obj['password']){
            $error=1;
            $error_array['password'] ='Your password should not be the same with your email';
        }
    }*/


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
            'first_name'        => $obj['first_name'],
            'last_name'         => $obj['last_name'],
            'email'             => $obj['email'],
            'password'          => $obj['password'],
            'id_merchant'       => $obj['id_merchant'],
        );
        $return = $form->RegisterAffiliates($arg);
				if($return=='1'){
					require '../../config/email/merchant/status.php';
					$merch = $form->getmerchantdetails($obj['id_merchant']);
					//$name = $obj['first_name'].' '.$obj['last_name'];
					$merchant  			= $merch['store_name'];
					$status         = 'is_pending';
					$link 					= baseurl('/affiliates/login/?merchant='.$merch['store_id']);
					//$email_merchant = $merch['email'];
					echo StatusChange($obj['email'],$status,$merchant,$link);
				}else{
					echo $return;
				}
    }
}


if($_POST['type']=='affiliate_isvalidmerchant'){
    require 'controller/form.php';
    echo json_encode($form->checkMerchant($_POST['id']));
}
