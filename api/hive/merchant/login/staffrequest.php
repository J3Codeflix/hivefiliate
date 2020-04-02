<?php
require '../../config/session.php';
require '../../config/database.php';
require '../../config/email/class.phpmailer.php';
require '../../config/email/serveremail.php';


if($_POST['type']=='staff_reset'){
    require 'controller/resetstaff.php';

    $error=0;
    $error_array = array();
    $obj  = json_decode($_POST['info'],true);

    $email        ='';
    $store        ='';

    if(empty($obj['store'])){
        $error=1;
        $error_array['store'] ='This is required.';
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
        if(!empty($obj['store'])){
          $store  = $obj['store'];
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
          $link = baseurl('/staffnewpassword/?mode=staff&store='.$store.'&reset_id='.$return);
          $name = $reset->InfoName($email);
          echo ResetPassword($email,$link);


        }
    }
}

/* Check Reset */
if($_POST['type']=='staff_checkreset'){
    require 'controller/resetstaff.php';
    echo $reset->CheckResetID($_POST['id']);
}


/* Update password */
if($_POST['type']=='staff_newpassword'){
    require 'controller/resetstaff.php';

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
            $email = $reset->staffemail($return);
            $link  = baseurl('/login/?mode=staff&store='.$obj['store']);
            echo ResetConfirmation($email,$link);
          }
        }else{
            $error_array['password'] = $return;
            echo json_encode($error_array);exit;
        }
    }


}
