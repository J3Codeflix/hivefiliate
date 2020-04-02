<?php
require '../../config/session.php';
require '../../config/database.php';
require '../../config/paginations.php';
require '../../config/email/class.phpmailer.php';
require '../../config/email/serveremail.php';


/* List Affiliate
---------------------------------------------------------------*/
if($_POST['type']=='merchant_stafflist'){
    require 'controller/list.php';

    $obj  = json_decode($_POST['search'],true);
    $page                         = 1;

    $keywords                     = '';

    if(!empty($_POST['page'])){
        $page       = $_POST['page'];
    }
    if(!empty($obj['keywords'])){
        $keywords  = $obj['keywords'];
    }


    $search = array(
        'keywords' => $keywords,
    );


    echo json_encode($list->initList($page,$search));
}

/* Register Staff
---------------------------------------------------------------*/
if($_POST['type']=='merchant_addstaff'){
	require 'controller/form.php';
    $error=0;
    $error_array = array();
    $obj  = json_decode($_POST['info'],true);



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

        $password = generatepassword(3);

        if(!empty($obj['status'])){         $status     = $obj['status'];}
        if(!empty($obj['dash_view'])){      $dash_view  = $obj['dash_view'];}
        if(!empty($obj['aff_view'])){       $aff_view   = $obj['aff_view'];}
        if(!empty($obj['aff_edit'])){       $aff_edit   = $obj['aff_edit'];}
        if(!empty($obj['aff_pay'])){        $aff_pay    = $obj['aff_pay'];}
        if(!empty($obj['aff_delete'])){     $aff_delete = $obj['aff_delete'];}
        if(!empty($obj['order_view'])){     $order_view = $obj['order_view'];}
        if(!empty($obj['order_edit'])){     $order_edit = $obj['order_edit'];}
        if(!empty($obj['bann_view'])){      $bann_view  = $obj['bann_view'];}
        if(!empty($obj['bann_edit'])){      $bann_edit  = $obj['bann_edit'];}
        if(!empty($obj['bann_delete'])){    $bann_delete= $obj['bann_delete'];}

        $arg = array(
            'first_name'        => $obj['first_name'],
            'last_name'         => $obj['last_name'],
            'email'             => $obj['email'],
            'password'          => $password,
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
        );

        $return = json_encode($form->RegisterStaff($arg));

        if($return!='0'){
          require '../../config/email/merchant/staffregistered.php';
          $merch = $form->infomerchant();
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

/* Information Staff
---------------------------------------------------------------*/
if($_POST['type']=='merchant_staffdetails'){
    require 'controller/list.php';
    echo json_encode($list->staffdetails($_POST['id']));
}


/* Update Staff
---------------------------------------------------------------*/
if($_POST['type']=='merchant_updatestaff'){
	require 'controller/form.php';
    $error=0;
    $error_array = array();
    $obj  = json_decode($_POST['info'],true);


    $id                     ='0';
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

        if(!empty($obj['status'])){         $status     = $obj['status'];}
        if(!empty($obj['dash_view'])){      $dash_view  = $obj['dash_view'];}
        if(!empty($obj['aff_view'])){       $aff_view   = $obj['aff_view'];}
        if(!empty($obj['aff_edit'])){       $aff_edit   = $obj['aff_edit'];}
        if(!empty($obj['aff_pay'])){        $aff_pay    = $obj['aff_pay'];}
        if(!empty($obj['aff_delete'])){     $aff_delete = $obj['aff_delete'];}
        if(!empty($obj['order_view'])){     $order_view = $obj['order_view'];}
        if(!empty($obj['order_edit'])){     $order_edit = $obj['order_edit'];}
        if(!empty($obj['bann_view'])){      $bann_view  = $obj['bann_view'];}
        if(!empty($obj['bann_edit'])){      $bann_edit  = $obj['bann_edit'];}
        if(!empty($obj['bann_delete'])){    $bann_delete= $obj['bann_delete'];}

        $arg = array(
            'first_name'        => $obj['first_name'],
            'last_name'         => $obj['last_name'],
            'id'                => $obj['id'],
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
        );

        echo json_encode($form->UpdateStaff($arg));
    }
}



/* Delete Single Staff
---------------------------------------------------------------*/
if($_POST['type']=='merchant_deletstaff'){
    require 'controller/delete.php';
    echo json_encode($delete->DeleteSingleStaff($_POST['id']));
}

/* Update Password Staff
---------------------------------------------------------------*/
if($_POST['type']=='merchant_staffchangepassword'){
    require 'controller/form.php';
    echo json_encode($form->changePasswordStaff($_POST['password'],$_POST['id']));
}

/* Generate new link and Sending a new link
---------------------------------------------------------------*/
if($_POST['type']=='merchant_generatestafflogin'){
    require 'controller/form.php';
    echo json_encode($form->staffnewloginLink());
}
if($_POST['type']=='merchant_sendnewloginLink'){
    require 'controller/form.php';
    $link = $_POST['link'];
    $data = $form->getallactivestaff();
    require '../../config/email/merchant/stafflink.php';
    $counter=0;
    foreach($data as $row){
       StaffLink($row['email'],$link);
       $counter++;
    }
    echo $counter;
}
