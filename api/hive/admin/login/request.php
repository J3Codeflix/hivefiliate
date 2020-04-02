<?php
require '../../config/session.php';
require '../../config/database.php';
require '../../config/paginations.php';
require '../../config/email/class.phpmailer.php';
require '../../config/email/serveremail.php';

if($_POST['type']=='admin_login'){
    require 'controller/form.php';

    $error=0;
    $error_array = array();
    $obj  = json_decode($_POST['info'],true);

    $email        ='';
    $password     ='';
    $remember     ='';


    if(empty($obj['email'])){
        $error=1;
        $error_array['email'] ='This is required.';
    }
		if(!empty($obj['email'])){
        if (!filter_var($obj['email'], FILTER_VALIDATE_EMAIL)) {
            $error=1;
            $error_array['email'] ='Please enter a valid email';
        }
    }
    if(empty($obj['password'])){
        $error=1;
        $error_array['password'] ='This is required.';
    }



    if($error==1){
        echo json_encode($error_array);exit;
    }else{

        if(!empty($obj['email'])){
            $email  = $obj['email'];
        }
        if(!empty($obj['password'])){
            $password  = $obj['password'];
        }
        if(!empty($obj['remember'])){
            $remember  = $obj['remember'];
        }

        $arg = array(
          'email' => $email,
          'password' => $password,
          'remember' => $remember,
        );

        $return = $form->LoginManager($arg);
        if($return==0){
            $error_array['email'] ='Invalid login credentials';
            $error_array['password'] ='Invalid login credentials';
            echo json_encode($error_array);exit;
        }else{
          echo $return;
        }
    }
}
if($_POST['type']=='admin_islogin'){
  require 'controller/form.php';
  echo json_encode($form->IsManagerLogin());
}
if($_POST['type']=='admin_logout'){
  session_destroy();
  echo '1';
}

/*-------------------------------------------------------------------
Reset Password------------------------------------------------------- */

if($_POST['type']=='admin_reset'){
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
          $link = baseurl('/controlpanel_super/newpassword/?reset_id='.$return);
          echo ResetPassword($email,$link);


          /*require '../../config/email/adminreset.php';
          $link = baseurl('/controlpanel_super/newpassword/?reset_id='.$return);
          echo resetpassword($email,$link);*/

        }
    }
}

/* Check Reset */
if($_POST['type']=='admin_checkreset'){
    require 'controller/reset.php';
    echo $reset->CheckResetID($_POST['id']);
}


/* Update password */
if($_POST['type']=='admin_newpassword'){
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
            $link = baseurl('/controlpanel_super');
            $email = $reset->adminuserss($return);
            echo ResetConfirmation($email,$link);
          }
        }else{
            $error_array['password'] = $return;
            echo json_encode($error_array);exit;
        }
    }


}
