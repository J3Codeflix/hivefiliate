<?php
require '../../config/session.php';
require '../../config/database.php';
require '../../config/email/class.phpmailer.php';
require '../../config/email/serveremail.php';

/*--------- Affiliates Login User ---*/

if($_POST['type']=='affiliates_login_user'){
    require 'controller/Controller.php';
    echo json_encode($controller->AffiliateUser());
}

if($_POST['type']=='setfrontdata'){
    require 'controller/Controller.php';
    echo json_encode($controller->DataConfiguration($_POST['id']));
}


/*--------- Login Form------------- */

if($_POST['type']=='affiliates_islogin'){
    require 'controller/Controller.php';
    echo json_encode($controller->IsAffiliateLogin());
}

if($_POST['type']=='affiliate_login'){
	require 'controller/Controller.php';
    $error=0;
    $error_array = array();
    $obj  = json_decode($_POST['info'],true);

    $email                  ='';
    $password               ='';
    $id_merchant            ='';


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
            'id_merchant'       => $obj['id_merchant'],
        );
        echo json_encode($controller->LoginControll($arg));
    }
}

if($_POST['type']=='affiliate_isvalidmerchant'){
    require 'controller/Controller.php';
    echo json_encode($controller->checkMerchant($_POST['id']));
}



/*-------------------------------------------------------------------
Reset Password------------------------------------------------------- */

if($_POST['type']=='affiliate_reset'){
    require 'controller/reset.php';

    $error=0;
    $error_array = array();
    $obj  = json_decode($_POST['info'],true);

    $email        ='';
    $id_merchant  ='';

    if(empty($obj['id_merchant'])){
        $error=1;
        $error_array['id_merchant'] ='This is required.';
    }
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
        if(!empty($obj['id_merchant'])){
          $id_merchant  = $obj['id_merchant'];
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
          $link = baseurl('/affiliates/newpassword/?merchant='.$id_merchant.'&reset_id='.$return);

          $name = $reset->InfoName($email);
          echo ResetPassword($email,$link);

        }
    }
}

/* Check Reset */
if($_POST['type']=='affiliate_checkreset'){
    require 'controller/reset.php';
    echo $reset->CheckResetID($_POST['id']);
}


/* Update password */
if($_POST['type']=='affiliate_newpassword'){
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
            $email = $reset->emailaffiliate($return);
            echo ResetConfirmation($email,$link);
          }
        }else{
            $error_array['password'] = $return;
            echo json_encode($error_array);exit;
        }
    }
}
