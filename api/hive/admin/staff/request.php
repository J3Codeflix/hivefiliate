<?php
require '../../config/session.php';
require '../../config/database.php';
require '../../config/paginations.php';
require '../../config/email/class.phpmailer.php';
require '../../config/email/serveremail.php';
if($_POST['type']=='staff_list'){
    require 'controller/list.php';

    $obj  = json_decode($_POST['search'],true);
    $page                         = 1;

    $search_field                 = '1';
    $search_keywords              = '';

    if(!empty($_POST['page'])){
        $page       = $_POST['page'];
    }
    if(!empty($obj['search_field'])){
        $search_field   = $obj['search_field'];
    }
    if(!empty($obj['search_keywords'])){
        $search_keywords    = $obj['search_keywords'];
    }

    $search = array(
        'search_field'    => $search_field,
        'search_keywords' => $search_keywords,
    );
    echo json_encode($list->initList($page,$search));
}

/*---------------------- Affiliate Add------------------------------- */

if($_POST['type']=='admin_addstaff'){
	  require 'controller/form.php';
    $error=0;
    $error_array = array();
    $obj  = json_decode($_POST['info'],true);


    $id_merchant            ='';
    $email                  ='';
    $password               ='';
    $first_name             ='';
    $last_name              ='';
    $status                 ='Active';
    $dash_view              ='true';
    $aff_view               ='true';
    $aff_edit               ='false';
    $aff_pay                ='false';
    $aff_delete             ='false';
    $order_view             ='true';
    $order_edit             ='false';
    $bann_view              ='true';
    $bann_edit              ='false';
    $bann_delete            ='false';



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
            $error_array['email'] ='Input a valid email';
        }else{
            if($form->checkingEmailFunction($obj['email'],0)>0){
                $error=1;
                $error_array['email'] ='Email is already taken.';
            }
        }
    }

    if(empty($obj['first_name'])){
        $error=1;
        $error_array['first_name'] ='This is required.';
    }

    if(empty($obj['last_name'])){
        $error=1;
        $error_array['last_name'] ='This is required.';
    }


    if($error==1){
        echo json_encode($error_array);exit;
    }else{

        if(!empty($obj['id_merchant'])){    $id_merchant      = $obj['id_merchant'];}
        if(!empty($obj['status'])){         $status           = $obj['status'];}
        if(!empty($obj['dash_view'])){      $dash_view        = $obj['dash_view'];}
        if(!empty($obj['aff_view'])){       $aff_view         = $obj['aff_view'];}
        if(!empty($obj['aff_edit'])){       $aff_edit         = $obj['aff_edit'];}
        if(!empty($obj['aff_pay'])){        $aff_pay          = $obj['aff_pay'];}
        if(!empty($obj['aff_delete'])){     $aff_delete       = $obj['aff_delete'];}
        if(!empty($obj['order_view'])){     $order_view       = $obj['order_view'];}
        if(!empty($obj['order_edit'])){     $order_edit       = $obj['order_edit'];}
        if(!empty($obj['bann_view'])){      $bann_view        = $obj['bann_view'];}
        if(!empty($obj['bann_edit'])){      $bann_edit        = $obj['bann_edit'];}
        if(!empty($obj['bann_delete'])){    $bann_delete      = $obj['bann_delete'];}

        $password = generatepassword(3);

        $arg = array(
            'first_name'        => $obj['first_name'],
            'last_name'         => $obj['last_name'],
            'email'             => $obj['email'],
            'status'            => $status,
            'dash_view'         => $dash_view,
            'aff_view'          => $aff_view,
            'aff_edit'          => $aff_edit,
            'aff_pay'           => $aff_pay,
            'aff_delete'        => $aff_delete,
            'order_view'        => $order_view,
            'order_edit'        => $order_edit,
            'bann_view'         => $bann_view,
            'bann_edit'         => $bann_edit,
            'bann_delete'       => $bann_delete,
            'id_merchant'       => $id_merchant,
            'password'          => $password,
        );



        $return = $form->RegisterStaff($arg);

        if($return=='1'){
          require '../../config/email/merchant/staffregistered.php';
          $merch = $form->infomerchant($id_merchant);
          $email          = $obj['email'];
          $link           = baseurl('/login/?mode=staff&store='.$merch['hash_staff']);
          $name           = $obj['first_name'].' '.$obj['last_name'];
          $merchant       = $merch['store_name'];
          $password       = $password;
          if(empty($merchant)){$merchant='Merchant Store -';}
          echo StaffRegistered($email,$link,$name,$merchant,$password);
        }else{
          echo $return;
        }




    }
}


/*---------------------- Staff Update------------------------------- */

if($_POST['type']=='admin_updatestaff'){
  require 'controller/form.php';
  $error=0;
  $error_array = array();
  $obj  = json_decode($_POST['info'],true);


  $id_merchant            ='';
  $email                  ='';
  $password               ='';
  $first_name             ='';
  $last_name              ='';
  $status                 ='Active';
  $dash_view              ='true';
  $aff_view               ='true';
  $aff_edit               ='false';
  $aff_pay                ='false';
  $aff_delete             ='false';
  $order_view             ='true';
  $order_edit             ='false';
  $bann_view              ='true';
  $bann_edit              ='false';
  $bann_delete            ='false';
  $id                     ='';


  if(empty($obj['id'])){
      $error=1;
      $error_array['id'] ='This is required.';
  }
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
          $error_array['email'] ='Input a valid email';
      }else{
          if($form->checkingEmailFunction($obj['email'],$obj['id'])>0){
              $error=1;
              $error_array['email'] ='Email is already taken.';
          }
      }
  }

  if(empty($obj['first_name'])){
      $error=1;
      $error_array['first_name'] ='This is required.';
  }

  if(empty($obj['last_name'])){
      $error=1;
      $error_array['last_name'] ='This is required.';
  }


  if($error==1){
      echo json_encode($error_array);exit;
  }else{

      if(!empty($obj['id_merchant'])){    $id_merchant      = $obj['id_merchant'];}
      if(!empty($obj['status'])){         $status           = $obj['status'];}
      if(!empty($obj['dash_view'])){      $dash_view        = $obj['dash_view'];}
      if(!empty($obj['aff_view'])){       $aff_view         = $obj['aff_view'];}
      if(!empty($obj['aff_edit'])){       $aff_edit         = $obj['aff_edit'];}
      if(!empty($obj['aff_pay'])){        $aff_pay          = $obj['aff_pay'];}
      if(!empty($obj['aff_delete'])){     $aff_delete       = $obj['aff_delete'];}
      if(!empty($obj['order_view'])){     $order_view       = $obj['order_view'];}
      if(!empty($obj['order_edit'])){     $order_edit       = $obj['order_edit'];}
      if(!empty($obj['bann_view'])){      $bann_view        = $obj['bann_view'];}
      if(!empty($obj['bann_edit'])){      $bann_edit        = $obj['bann_edit'];}
      if(!empty($obj['bann_delete'])){    $bann_delete      = $obj['bann_delete'];}
      if(!empty($obj['id'])){             $id               = $obj['id'];}

      $arg = array(
          'first_name'        => $obj['first_name'],
          'last_name'         => $obj['last_name'],
          'email'             => $obj['email'],
          'password'          => $obj['password'],
          'status'            => $status,
          'dash_view'         => $dash_view,
          'aff_view'          => $aff_view,
          'aff_edit'          => $aff_edit,
          'aff_pay'           => $aff_pay,
          'aff_delete'        => $aff_delete,
          'order_view'        => $order_view,
          'order_edit'        => $order_edit,
          'bann_view'         => $bann_view,
          'bann_edit'         => $bann_edit,
          'bann_delete'       => $bann_delete,
          'id_merchant'       => $id_merchant,
          'id'                => $id,
      );

      echo json_encode($form->UpdateStaff($arg));
  }
}

/* -------------------Affiliate Delete Temporarily------------------------- */

if($_POST['type']=='admin_staffdelete'){
  require 'controller/delete.php';
  $obj  = json_decode($_POST['info'],true);
  if(empty($obj['id'])){
    echo 'Error';exit;
  }
  echo json_encode($delete->DeleteAccount($obj['id']));
}
