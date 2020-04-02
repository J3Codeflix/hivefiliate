<?php
require '../../config/session.php';
require '../../config/database.php';
require '../../config/paginations.php';
require '../../config/email/class.phpmailer.php';
require '../../config/email/serveremail.php';
if($_POST['type']=='order_list'){
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


if($_POST['type']=='affliate_info'){
    require 'controller/list.php';
    echo json_encode($list->InfoAffiliates($_POST['id']));
}

/*---------------------- Add Order ------------------------------- */
if($_POST['type']=='admin_addorder'){
	require 'controller/form.php';
    $error=0;
    $error_array = array();
    $obj  = json_decode($_POST['info'],true);


    $merchant_id                ='';
    $affiliate_id               ='';
    $order_id                   ='';
    $tracking_method            ='';
    $order_price                ='';
    $aff_earnings               ='';
    $date_order                 ='';
    $order_status               ='';
    $landing_page               ='';
    $referal_page               ='';
    $notes                      ='';


    if(empty($obj['merchant_id'])){
        $error=1;
        $error_array['merchant_id'] ='This is required.';
    }
    if(empty($obj['affiliate_id'])){
        $error=1;
        $error_array['affiliate_id'] ='This is required.';
    }

    if(empty($obj['order_id'])){
        $error=1;
        $error_array['order_id'] ='This is required.';
    }

    if(empty($obj['tracking_method'])){
        $error=1;
        $error_array['tracking_method'] ='This is required.';
    }

    if(empty($obj['order_price'])){
        $error=1;
        $error_array['order_price'] ='This is required.';
    }

    if(empty($obj['aff_earnings'])){
        $error=1;
        $error_array['aff_earnings'] ='This is required.';
    }
    if(empty($obj['date_order'])){
        $error=1;
        $error_array['date_order'] ='This is required.';
    }
    if(empty($obj['order_status'])){
        $error=1;
        $error_array['order_status'] ='This is required.';
    }



    if($error==1){
        echo json_encode($error_array);exit;
    }else{


        if(!empty($obj['merchant_id'])){            $merchant_id       = $obj['merchant_id'];}
        if(!empty($obj['affiliate_id'])){           $affiliate_id       = $obj['affiliate_id'];}
        if(!empty($obj['order_id'])){               $order_id           = $obj['order_id'];}
        if(!empty($obj['tracking_method'])){        $tracking_method    = $obj['tracking_method'];}
        if(!empty($obj['order_price'])){            $order_price        = $obj['order_price'];}
        if(!empty($obj['aff_earnings'])){           $aff_earnings       = $obj['aff_earnings'];}
        if(!empty($obj['date_order'])){             $date_order         = $obj['date_order'];}
        if(!empty($obj['order_status'])){           $order_status       = $obj['order_status'];}
        if(!empty($obj['landing_page'])){           $landing_page       = $obj['landing_page'];}
        if(!empty($obj['referal_page'])){           $referal_page       = $obj['referal_page'];}
        if(!empty($obj['notes'])){                  $notes              = $obj['notes'];}

        $arg = array(
            'merchant_id'           => $merchant_id,
            'affiliate_id'          => $affiliate_id,
            'order_id'              => $order_id,
            'tracking_method'       => $tracking_method,
            'order_price'           => str_replace(',', '', $order_price),
            'aff_earnings'          => str_replace(',', '', $aff_earnings),
            'date_order'            => $date_order,
            'order_status'          => $order_status,
            'landing_page'          => $landing_page,
            'referal_page'          => $referal_page,
            'notes'                 => $notes,
        );

        $return = json_encode($form->SaveOrder($arg));
        if($return!='0'){

          $config = $database->ConfigSettings();
          if($config=='0'){echo $return;exit;}
          if($config['notif_slsaff']=='0'){echo $return;exit;}

          require '../../config/email/merchant/salesgenerated.php';

          $merch                = $form->infomerchant($merchant_id);
          $aff                  = $form->infoaffiliate($affiliate_id);

          $affiliate_id         = $affiliate_id;
          $order_id             = $order_id;
          $tracking_method      = $tracking_method;
          $order_price          = defaultcurr().number_format(str_replace(',', '', $order_price),2);
          $aff_earnings         = defaultcurr().number_format(str_replace(',', '', $aff_earnings),2);
          $date_order           = $date_order;
          $order_status         = $order_status;
          $landing_page         = $landing_page;
          $referal_page         = $referal_page;

          $email                = $aff['email'];
          $name                 = $aff['first_name'].' '.$aff['last_name'];
          $merchant             = $merch['store_name'];
          $link                 = linkloginaffiliate($merch['hash_id']);

          $affiliate            = $name;
          $store                = $merchant;
          $type                 = 'affiliate';
          $com                  = $aff_earnings;

          if(empty($merchant)){$merchant='Merchant Store -';}
          echo SalesGenerated($email,$link,$affiliate,$store,$type,$order_id,$com);


        }else{
          echo $return;
        }
    }
}

/*---------------------- Update Order ------------------------------- */
if($_POST['type']=='admin_updateorder'){
	require 'controller/form.php';
    $error=0;
    $error_array = array();
    $obj  = json_decode($_POST['info'],true);

    $id                         ='';
    $merchant_id                ='';
    $affiliate_id               ='';
    $order_id                   ='';
    $tracking_method            ='';
    $order_price                ='';
    $aff_earnings               ='';
    $date_order                 ='';
    $order_status               ='';
    $landing_page               ='';
    $referal_page               ='';
    $notes                      ='';


    if(empty($obj['id'])){
        $error=1;
        $error_array['id'] ='This is required.';
    }
    if(empty($obj['merchant_id'])){
        $error=1;
        $error_array['merchant_id'] ='This is required.';
    }
    if(empty($obj['affiliate_id'])){
        $error=1;
        $error_array['affiliate_id'] ='This is required.';
    }

    if(empty($obj['order_id'])){
        $error=1;
        $error_array['order_id'] ='This is required.';
    }

    if(empty($obj['tracking_method'])){
        $error=1;
        $error_array['tracking_method'] ='This is required.';
    }

    if(empty($obj['order_price'])){
        $error=1;
        $error_array['order_price'] ='This is required.';
    }

    if(empty($obj['aff_earnings'])){
        $error=1;
        $error_array['aff_earnings'] ='This is required.';
    }
    if(empty($obj['date_order'])){
        $error=1;
        $error_array['date_order'] ='This is required.';
    }
    if(empty($obj['order_status'])){
        $error=1;
        $error_array['order_status'] ='This is required.';
    }



    if($error==1){
        echo json_encode($error_array);exit;
    }else{

        if(!empty($obj['id'])){                     $id                 = $obj['id'];}
        if(!empty($obj['merchant_id'])){            $merchant_id        = $obj['merchant_id'];}
        if(!empty($obj['affiliate_id'])){           $affiliate_id       = $obj['affiliate_id'];}
        if(!empty($obj['order_id'])){               $order_id           = $obj['order_id'];}
        if(!empty($obj['tracking_method'])){        $tracking_method    = $obj['tracking_method'];}
        if(!empty($obj['order_price'])){            $order_price        = $obj['order_price'];}
        if(!empty($obj['aff_earnings'])){           $aff_earnings       = $obj['aff_earnings'];}
        if(!empty($obj['date_order'])){             $date_order         = $obj['date_order'];}
        if(!empty($obj['order_status'])){           $order_status       = $obj['order_status'];}
        if(!empty($obj['landing_page'])){           $landing_page       = $obj['landing_page'];}
        if(!empty($obj['referal_page'])){           $referal_page       = $obj['referal_page'];}
        if(!empty($obj['notes'])){                  $notes              = $obj['notes'];}

        $arg = array(
            'id'                    => $id,
            'merchant_id'           => $merchant_id,
            'affiliate_id'          => $affiliate_id,
            'order_id'              => $order_id,
            'tracking_method'       => $tracking_method,
            'order_price'           => str_replace(',', '', $order_price),
            'aff_earnings'          => str_replace(',', '', $aff_earnings),
            'date_order'            => $date_order,
            'order_status'          => $order_status,
            'landing_page'          => $landing_page,
            'referal_page'          => $referal_page,
            'notes'                 => $notes,
        );

        echo json_encode($form->UpdateOrder($arg));
    }
}

/*---------------------- Update Order ------------------------------- */
if($_POST['type']=='admin_deleteorder'){
	require 'controller/delete.php';
  echo $delete->DeleteOrder($_POST['id']);
}
