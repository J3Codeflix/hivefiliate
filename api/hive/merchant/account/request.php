<?php
require '../../config/session.php';
require '../../config/database.php';
require '../../config/email/class.phpmailer.php';
require '../../config/email/serveremail.php';

if($_POST['type']=='merchant_updateaccount'){
	require 'controller/form.php';
    $error=0;
    $error_array = array();
    $obj  = json_decode($_POST['info'],true);


    $store_name             ='';
    $email                  ='';
    $old_password           ='';
    $new_password           ='';
    $is_change              ='';
    $id                     ='';


    if(empty($obj['store_name'])){
        $error=1;
        $error_array['store_name'] ='This is required.';
    }

    if(empty($obj['email'])){
        $error=1;
        $error_array['email'] ='This is required.';
    }

		if(!empty($obj['store_name'])){
			if($form->checkstoreupdate($obj['store_name'],$obj['id'])>0){
				$error=1;
        $error_array['store_name'] ='Store name is already taken.';
			}
    }


    if(!empty($obj['is_change'])){
       if($obj['is_change']=='true'){
            if(empty($obj['old_password'])){
                $error=1;
                $error_array['old_password'] ='This is required.';
            }else{
                if($form->CheckOldPassword($obj['old_password'],$obj['email'])==0){
                    $error=1;
                    $error_array['old_password'] ='You enter incorrect old password';
                }
            }
            if(empty($obj['new_password'])){
                $error=1;
                $error_array['new_password'] ='This is required.';
            }
       }
    }


    if($error==1){
        echo json_encode($error_array);exit;
    }else{

        if(!empty($obj['store_name'])){     $store_name     = $obj['store_name'];}
        if(!empty($obj['new_password'])){   $new_password   = $obj['new_password'];}
        if(!empty($obj['id'])){   $id   = $obj['id'];}

        $arg = array(
            'store_name'        => $store_name,
            'new_password'      => $new_password,
            'id'                => $id,
        );

        echo json_encode($form->UpdateAccount($arg));
    }
}


if($_POST['type']=='merchant_staffaccount'){
	require 'controller/form.php';
    $error=0;
    $error_array = array();
    $obj  = json_decode($_POST['info'],true);


    $first_name             ='';
    $last_name              ='';
    $password           		='';

    if(empty($obj['first_name'])){
        $error=1;
        $error_array['first_name'] ='This is required.';
    }

    if(empty($obj['last_name'])){
        $error=1;
        $error_array['last_name'] ='This is required.';
    }

		if(!empty($obj['password'])){
			if(strlen($obj['password'])<5){
				$error=1;
				$error_array['password'] ='Password minimum of 5 characters';
			}
		}

    if($error==1){
        echo json_encode($error_array);exit;
    }else{

        if(!empty($obj['first_name'])){     $first_name     = $obj['first_name'];}
        if(!empty($obj['last_name'])){   		$last_name   		= $obj['last_name'];}
				if(!empty($obj['password'])){   		$password  			= $obj['password'];}

        $arg = array(
            'first_name'        => $first_name,
            'last_name'      		=> $last_name,
						'password'      		=> $password,
        );

        echo json_encode($form->UpdateAccountStaff($arg));
    }
}


if($_POST['type']=='merchant_staffaccountdelete'){
	require 'controller/delete.php';
	echo json_encode($delete->deleteStaffAccount());
}


if($_POST['type']=='merchant_paymentprocess'){
	require 'controller/payment.php';
    $error=0;
    $error_array = array();
    $obj  = json_decode($_POST['info'],true);


    $type_plan             ='';
    $subs_plan             ='';
    $pay_method            ='';
		$description           ='';


    if(empty($obj['type_plan'])){
        $error=1;
        $error_array['type_plan'] ='This is required.';
    }

    if(empty($obj['subs_plan'])){
        $error=1;
        $error_array['subs_plan'] ='This is required.';
    }

		if(empty($obj['pay_method'])){
        $error=1;
        $error_array['pay_method'] ='This is required.';
    }

    if($error==1){
        echo json_encode($error_array);exit;
    }else{

        if(!empty($obj['type_plan'])){     	$type_plan     	= $obj['type_plan'];}
        if(!empty($obj['subs_plan'])){   		$subs_plan   		= $obj['subs_plan'];}
        if(!empty($obj['pay_method'])){   	$pay_method   	= $obj['pay_method'];}
				if(!empty($obj['description'])){   	$description   	= $obj['description'];}

        $arg = array(
            'type_plan'        		=> $type_plan,
            'subs_plan'      			=> $subs_plan,
            'pay_method'          => $pay_method,
						'description'         => $description,
        );

        $return = $payment->MerchantPayment($arg);
				if($return!='0'){
					require '../../config/email/merchant/subscriptionspayment.php';
					$email 									= $return['email'];
					$store_name 						= $return['store_name'];
					$monthly_sub 						= $return['monthly_sub'];
					$monthly_price 					= $return['monthly_price'];
					$total 									= $return['total'];
					$arrange_by 						= $return['arrange_by'];
					$transaction_id 				= $return['transaction_id'];
					echo SubscriptionPayment($email,$store_name,$monthly_sub,$monthly_price,$total,$arrange_by,$transaction_id);
				}else{
					echo $return;
				}
    }
}

/* Check Paypal */
if($_POST['type']=='merchant_ispaypal'){
	require 'controller/form.php';
	echo json_encode($form->PaypalCheckSettings());
}

/* Deactivate Account */
if($_POST['type']=='merchant_deactivate'){
	require 'controller/deactivate.php';
	$obj  = json_decode($_POST['info'],true);
	if(empty($obj['password'])){
			$error=1;
			$error_array['password'] ='This is required.';
	}
	if(!empty($obj['password'])){
		if($diactivate->CheckPassword($obj['password'])==0){
			$error=1;
			$error_array['password'] ='Invalid password';
		}
	}
	if($error==1){
			echo json_encode($error_array);exit;
	}else{
		  echo json_encode($diactivate->AccountMerchantWipeoutCompletely());
	}
}

/* Cancel Removal Account */
if($_POST['type']=='merchant_cancelremoval'){
	require 'controller/deactivate.php';
	$obj  = json_decode($_POST['info'],true);
	if(empty($obj['password'])){
			$error=1;
			$error_array['password'] ='This is required.';
	}
	if(!empty($obj['password'])){
		if($diactivate->CheckPassword($obj['password'])==0){
			$error=1;
			$error_array['password'] ='Invalid password';
		}
	}
	if($error==1){
			echo json_encode($error_array);exit;
	}else{
		  echo json_encode($diactivate->CancelRemovalAccount());
	}
}
