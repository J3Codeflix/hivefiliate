<?php
require '../../config/session.php';
require '../../config/database.php';
require '../../config/email/class.phpmailer.php';
require '../../config/email/serveremail.php';

if($_POST['type']=='merchant_islogin'){
    require 'controller/Controller.php';
    echo json_encode($controller->IsMerchantLogin());
}


if($_POST['type']=='merchant_login'){
	require 'controller/Controller.php';
    $error=0;
    $error_array = array();
    $obj  = json_decode($_POST['info'],true);

    $email                  ='';
    $password               ='';

    if(empty($obj['email'])){
        $error=1;
        $error_array['email'] ='This is required.';
    }

    if(!empty($obj['email'])){
        if (!filter_var($obj['email'], FILTER_VALIDATE_EMAIL)) {
            $error=1;
            $error_array['email'] ='Input a valid email';
        }
    }

    if(empty($obj['password'])){
        $error=1;
        $error_array['password'] ='This is required.';
    }

    if($error==1){
        echo json_encode($error_array);exit;
    }else{
        $arg = array(
            'email'             => $obj['email'],
            'password'          => $obj['password'],
            'mode'              => $_POST['mode'],
        );
        echo json_encode($controller->LoginControll($arg));
    }
}

if($_POST['type']=='merchant_requestlogout'){
    session_destroy();
    echo 'confirm';
}



/* Staff Mode */
if($_POST['type']=='merchant_querymodestaff'){
    require 'controller/Controller.php';
    if(empty($_POST['store'])||empty($_POST['urlmode'])){
        echo 'empty';exit;
    }
    echo json_encode($controller->getMerchantStore($_POST['store']));
}




/*-------------------------------------------------------------------
Reset Password------------------------------------------------------- */

if($_POST['type']=='merchant_reset'){
    require 'controller/reset.php';

    $error=0;
    $error_array = array();
    $obj  = json_decode($_POST['info'],true);

    $email     ='';

    if(empty($obj['email'])){
        $error=1;
        $error_array['email'] ='This is required.';
    }
		if(!empty($obj['email'])){
        if (!filter_var($obj['email'], FILTER_VALIDATE_EMAIL)) {
            $error=1;
            $error_array['email'] ='Please enter a valid email';
        }else{
          if($reset->Checkemail($obj['email'])==0){
            $error=1;
            $error_array['email'] ='Please enter your valid email';
          }
        }
    }

    if($error==1){
        echo json_encode($error_array);exit;
    }else{

        if(!empty($obj['email'])){
          $email  = $obj['email'];
        }

        $arg = array(
          'email' => $email,
        );
        $return = $reset->ResetProcess($email);
        if($return=='0'){
          $error_array['email'] ='Unable to reset your password';
          echo json_encode($error_array);exit;
        }else{
          require '../../config/email/merchant/reset.php';
          $link = baseurl('/newpassword/?reset_id='.$return);
          $name = $reset->InfoName($email);
          echo ResetPassword($email,$link);
        }
    }
}

/* Check Reset */
if($_POST['type']=='merchant_checkreset'){
    require 'controller/reset.php';
    echo $reset->CheckResetID($_POST['id']);
}


/* Update password */
if($_POST['type']=='merchant_newpassword'){
    require 'controller/reset.php';

    $error=0;
    $error_array = array();
    $obj  = json_decode($_POST['info'],true);

    $password       ='';
    $reset_key      ='';

    if(empty($obj['password'])){
        $error=1;
        $error_array['password'] ='This is required.';
    }
    if(empty($obj['reset_key'])){
        $error=1;
        $error_array['reset_key'] ='This is required.';
    }


    if($error==1){
        echo json_encode($error_array);exit;
    }else{

        if(!empty($obj['password'])){
          $password  = $obj['password'];
        }
        if(!empty($obj['reset_key'])){
          $reset_key  = $obj['reset_key'];
        }

        $arg = array(
          'password' => $password,
          'reset_key' => $reset_key,
        );

        $return = $reset->UpdatePassword($arg);

        if($return=='0'||$return>='1'){
          if($return=='0'){
            $error_array['password'] ='Unable to update your password.';
            echo json_encode($error_array);exit;
          }else{
            require '../../config/email/merchant/resetconfirmation.php';
            $link = baseurl('/login');
            $email = $reset->emailmerchant($return);
            echo ResetConfirmation($email,$link);
          }
        }else{
            $error_array['password'] = $return;
            echo json_encode($error_array);exit;
        }
    }


}

/*-------------------------------------------------------------------
Shopify Setup ------------------------------------------------------- */
if($_POST['type']=='shopify_setup'){
    require 'controller/shopify.php';
    $obj  = json_decode($_POST['info'],true);
    $arg = array(
      'code' => $obj['code'],
      'hmac' => $obj['hmac'],
      'shop' => $obj['shop'],
    );
    echo json_encode($shopify->ShopifySetup($arg));
}
