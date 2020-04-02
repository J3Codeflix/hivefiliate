<?php
require '../../config/session.php';
require '../../config/database.php';

if($_POST['type']=='affiliates_accountdata'){
    require 'controller/form.php';
    echo json_encode($form->AffiliatesAccount());
}


if($_POST['type']=='affiliates_deleteaccount'){
    require 'controller/delete.php';
    $obj  = json_decode($_POST['info'],true);
    $return = $delete->DeleteAccountAffiliate($obj['password'],$obj['email']);
    if($return=='invalid_password'){
        $error_array = array();
        $error_array['password'] ='Current password you entered is incorrect';
        echo json_encode($error_array);exit;
    }else{
        echo $return;
    }

}


if($_POST['type']=='affiliates_accountchanges'){
	require 'controller/form.php';
    $error=0;
    $error_array = array();
    $obj  = json_decode($_POST['info'],true);

    $email                  ='';
    $first_name             ='';
    $last_name              ='';
    $website_blog           ='';
    $facebook               ='';
    $instagram              ='';
    $youtube                ='';
    $other_social           ='';
    $comments               ='';
    $min_payment            ='';
    $old_password           ='';
    $new_password           ='';
    $is_change              ='';
    $paypal_email           ='';



    if(empty($obj['first_name'])){
        $error=1;
        $error_array['first_name'] ='This is required.';
    }

    if(empty($obj['last_name'])){
        $error=1;
        $error_array['last_name'] ='This is required.';
    }

    if(!empty($obj['paypal_email'])){
        if (!filter_var($obj['paypal_email'], FILTER_VALIDATE_EMAIL)) {
            $error=1;
            $error_array['paypal_email'] ='Input a valid email';
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


        if(!empty($obj['email'])){          $email          = $obj['email'];}
        if(!empty($obj['first_name'])){     $first_name     = $obj['first_name'];}
        if(!empty($obj['last_name'])){      $last_name      = $obj['last_name'];}
        if(!empty($obj['website_blog'])){   $website_blog   = $obj['website_blog'];}
        if(!empty($obj['facebook'])){       $facebook       = $obj['facebook'];}
        if(!empty($obj['instagram'])){      $instagram      = $obj['instagram'];}
        if(!empty($obj['youtube'])){        $youtube        = $obj['youtube'];}
        if(!empty($obj['other_social'])){   $other_social   = $obj['other_social'];}
        if(!empty($obj['comments'])){       $comments       = $obj['comments'];}
        if(!empty($obj['min_payment'])){    $min_payment    = $obj['min_payment'];}
        if(!empty($obj['old_password'])){   $old_password   = $obj['old_password'];}
        if(!empty($obj['new_password'])){   $new_password   = $obj['new_password'];}
        if(!empty($obj['is_change'])){      $is_change      = $obj['is_change'];}
        if(!empty($obj['paypal_email'])){   $paypal_email   = $obj['paypal_email'];}


        $arg = array(
            'email'                         => $email,
            'first_name'                    => $first_name,
            'last_name'                     => $last_name,
            'website_blog'                  => $website_blog,
            'facebook'                      => $facebook,
            'instagram'                     => $instagram,
            'youtube'                       => $youtube,
            'other_social'                  => $other_social,
            'comments'                      => $comments,
            'min_payment'                   => $min_payment,
            'old_password'                  => $old_password,
            'new_password'                  => $new_password,
            'is_change'                     => $is_change,
            'paypal_email'                  => $paypal_email,
        );


        echo json_encode($form->UpdateAffiliateAccount($arg));
    }
}
