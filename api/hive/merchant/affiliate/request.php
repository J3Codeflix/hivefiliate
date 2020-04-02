<?php
require '../../config/session.php';
require '../../config/database.php';
require '../../config/paginations.php';
require '../../config/email/class.phpmailer.php';
require '../../config/email/serveremail.php';

/* List Affiliate
---------------------------------------------------------------*/
if($_POST['type']=='merchant_listaffiliate'){
    require 'controller/list.php';

    $obj  = json_decode($_POST['search'],true);
    $page                         = 1;

    $keywords                     = '';
    $datefrom                     = '';
    $dateto                       = '';
    $status                       = 'is_active';

    if(!empty($_POST['page'])){
        $page       = $_POST['page'];
    }
    if(!empty($obj['keywords'])){
        $keywords  = $obj['keywords'];
    }
    if(!empty($obj['datefrom'])){
        $datefrom  = $obj['datefrom'];
    }
    if(!empty($obj['dateto'])){
        $dateto  = $obj['dateto'];
    }
    if(!empty($obj['status'])){
        $status  = $obj['status'];
    }


    $search = array(
        'keywords' => $keywords,
        'datefrom' => $datefrom,
        'dateto' => $dateto,
        'status' => $status,
    );


    echo json_encode($list->initList($page,$search));
}

/* Register Affiliate
---------------------------------------------------------------*/
if($_POST['type']=='marchant_addaffiliate'){
	require 'controller/form.php';
    $error=0;
    $error_array = array();
    $obj  = json_decode($_POST['info'],true);


    $email                  ='';
    $password               ='';
    $first_name             ='';
    $last_name              ='';




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


    if(empty($obj['password'])){
        $error=1;
        $error_array['password'] ='This is required.';
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

        $arg = array(
            'first_name'        => $obj['first_name'],
            'last_name'         => $obj['last_name'],
            'email'             => $obj['email'],
            'password'          => $obj['password'],
        );


        $return = json_encode($form->RegisterAffiliate($arg));

        if($return!='0'){

          require '../../config/email/merchant/status.php';
					$merch          = $form->infomerchant();
					$merchant  			= $merch['store_name'];
					$status         = 'is_active';
					$link 					= linkloginaffiliate($merch['hash_id']);
					echo StatusChange($obj['email'],$status,$merchant,$link);
          /*require '../../config/email/affregister_notif.php';
          $merch = $form->infomerchant();
          $email          = $obj['email'];
          $link           = baseurl('/affiliates/login/?merchant='.$merch['hash_id']);
          $name           = $obj['first_name'].' '.$obj['last_name'];
          $merchant       = $merch['store_name'];
          $password       = $obj['password'];
          if(empty($merchant)){$merchant='Merchant Store -';}
          echo RegisterAffiliateNotification($email,$link,$name,$merchant,$password);*/

        }else{
          echo $return;
        }
    }
}

/* Information Affiliate
---------------------------------------------------------------*/
if($_POST['type']=='merchant_affinformation'){
    require 'controller/list.php';
    echo json_encode($list->affdetails($_POST['id']));
}


/* Update Affiliate
---------------------------------------------------------------*/
if($_POST['type']=='merchant_updateaffinfo'){
	require 'controller/form.php';
    $error=0;
    $error_array = array();
    $obj  = json_decode($_POST['info'],true);


    $id                     ='0';
    $first_name             ='';
    $last_name              ='';
    $merchant_notes         ='';
    $min_payment            ='';
    $com_percent            ='';
    $cookie_duration        ='';
    $type_com               ='';
    $flat_rate              ='';
    $coupon_code            ='';
    $type_discount          ='';
    $discount_description   ='';


    if(empty($obj['first_name'])){
        $error=1;
        $error_array['first_name'] ='This is required.';
    }

    if(empty($obj['last_name'])){
        $error=1;
        $error_array['last_name'] ='This is required.';
    }
    if(empty($obj['cookie_duration'])){
        $error=1;
        $error_array['cookie_duration'] ='This is required.';
    }
    if(empty($obj['type_com'])){
        $error=1;
        $error_array['type_com'] ='This is required.';
    }
    if(empty($obj['flat_rate'])){
        $error=1;
        $error_array['flat_rate'] ='This is required.';
    }


    if(!empty($obj['merchant_notes'])){
        $merchant_notes = $obj['merchant_notes'];
    }
    if(!empty($obj['id'])){
        $id = $obj['id'];
    }
    if(!empty($obj['min_payment'])){
        $min_payment = $obj['min_payment'];
    }
    if(!empty($obj['com_percent'])){
        $com_percent = $obj['com_percent'];
    }
    if(!empty($obj['cookie_duration'])){
        $cookie_duration = $obj['cookie_duration'];
    }


    if(!empty($obj['coupon_code'])){
      if($form->checkCoupon($obj['coupon_code'],$id)>0){
        $error=1;
        $error_array['coupon_code'] ='Coupon already used by other affiliate.';
      }
    }


    if(!empty($obj['type_com'])){
        $type_com = $obj['type_com'];
    }
    if(!empty($obj['flat_rate'])){
        $flat_rate = $obj['flat_rate'];
    }
    if(!empty($obj['coupon_code'])){
        $coupon_code = str_replace(',', '', $obj['coupon_code']);
    }


    if(!empty($obj['type_discount'])){
        $type_discount = $obj['type_discount'];
    }
    if(!empty($obj['discount_description'])){
        $discount_description = $obj['discount_description'];
    }


    if($error==1){
        echo json_encode($error_array);exit;
    }else{

        $arg = array(
            'first_name'              => $obj['first_name'],
            'last_name'               => $obj['last_name'],
            'id'                      => $id,
            'merchant_notes'          => $merchant_notes,
            'min_payment'             => $min_payment,
            'com_percent'             => $com_percent,
            'cookie_duration'         => $cookie_duration,
            'type_com'                => $type_com,
            'flat_rate'               => $flat_rate,
            'coupon_code'             => $coupon_code,
            'type_discount'           => $type_discount,
            'discount_description'    => $discount_description
        );
        echo json_encode($form->UpdateAffiliateInfo($arg));
    }
}



/* Config status affiliate
---------------------------------------------------------------*/
if($_POST['type']=='merchant_affstatus'){
    require 'controller/form.php';
    $return = $form->AffiliateStatusConfig($_POST['id'],$_POST['status']);
    $merch = $form->infomerchant();
    $aff   = $form->infoaffiliate($_POST['id']);
    if($return=='1'){
      $status = $_POST['status'];
      if($status=='is_block'||$status=='is_denied'||$status=='is_active'){
        require '../../config/email/merchant/status.php';
        $merchant  			= $merch['store_name'];
        $link           = linkloginaffiliate($merch['hash_id']);
        echo StatusChange($aff['email'],$status,$merchant,$link);
      }else{
        echo $return;
      }
    }else{
      echo $return;
    }
}
if($_POST['type']=='merchant_affdeleteCompletly'){
    require 'controller/delete.php';
    echo json_encode($delete->DeleteAffiliateCompletly($_POST['id'],$_POST['status']));
}


/* Affiliate Add Sum Payment
---------------------------------------------------------------*/
if($_POST['type']=='merchant_affaddedsum'){
	require 'controller/form.php';
    $error=0;
    $error_array = array();
    $obj  = json_decode($_POST['info'],true);


    $id                     ='0';
    $paid_sum               ='';
    $payment_date           ='';
    $comments               ='';
    $admin_comments         ='';


    if(empty($obj['paid_sum'])){
        $error=1;
        $error_array['paid_sum'] ='This is required.';
    }

    if(empty($obj['payment_date'])){
        $error=1;
        $error_array['payment_date'] ='This is required.';
    }


    if(!empty($obj['comments'])){
        $comments = $obj['comments'];
    }
    if(!empty($obj['admin_comments'])){
        $admin_comments = $obj['admin_comments'];
    }

    if(!empty($obj['id'])){
        $id = $obj['id'];
    }

    if($error==1){
        echo json_encode($error_array);exit;
    }else{

        $arg = array(
            'admin_comments'    => $admin_comments,
            'comments'          => $comments,
            'id'                => $id,
            'paid_sum'          => str_replace(',', '', $obj['paid_sum']),
            'payment_date'      => $obj['payment_date'],
        );
        $return = json_encode($form->AddSumAffiliate($arg));

        if($return=='1'){

          $config = $database->ConfigSettings();
          if($config=='0'){echo $return;exit;}

          if($config['notif_paysentaff']=='0'){echo $return;exit;}

          require '../../config/email/merchant/paymentsent.php';
          $merch          = $form->infomerchant();
          $aff            = $form->infoaffiliate($id);
          $paid_sum       = defaultcurr().number_format(str_replace(',', '', $obj['paid_sum']),2);
          $payment_date   = $obj['payment_date'];
          $comments       = $comments;
          $email          = $aff['email'];
          $name           = $aff['first_name'].' '.$obj['last_name'];
          $merchant       = $merch['store_name'];
          if(empty($merchant)){$merchant='Merchant Store -';}

          echo PaymentSent($paid_sum,$payment_date,$comments,$email,$name,$merchant);

        }else{
          echo $return;
        }


    }
}



/* List Affiliate Payment History and Delete
---------------------------------------------------------------*/
if($_POST['type']=='merchant_affpaymenthistory'){
    require 'controller/list.php';

    $obj  = json_decode($_POST['search'],true);
    $page                         = 1;

    $payment_date                 = '';
    $id                           = '';

    if(!empty($_POST['page'])){
        $page       = $_POST['page'];
    }
    if(!empty($obj['payment_date'])){
        $payment_date  = $obj['payment_date'];
    }
    if(!empty($obj['id'])){
        $id  = $obj['id'];
    }


    $search = array(
        'payment_date' => $payment_date,
        'id' => $id
    );

    echo json_encode($list->initList_PaymentHistory($page,$search));
}



if($_POST['type']=='merchant_deletpayment'){
    require 'controller/delete.php';
    echo json_encode($delete->DeletePaymentHistory($_POST['id']));
}

/* List Sent Payment
---------------------------------------------------------------*/
if($_POST['type']=='merchant_sentpayment'){
    require 'controller/list.php';

    $obj  = json_decode($_POST['search'],true);
    $page                         = 1;

    $payment_date                 = '';

    if(!empty($_POST['page'])){
        $page       = $_POST['page'];
    }
    if(!empty($obj['payment_date'])){
        $payment_date  = $obj['payment_date'];
    }

    $search = array(
        'payment_date' => $payment_date
    );

    echo json_encode($list->MerchantPaymentSent($page,$search));
}



/* Affiliate Tab Earnings */

if($_POST['type']=='merchant_afftabEarnings'){
    require 'controller/list.php';
    echo json_encode($list->AfftabEarnings($_POST['id']));
}

/* Affiliate Payment Invoice */
if($_POST['type']=='affiliate_unpaidorder'){
    require 'controller/invoice.php';
    echo json_encode($invoice->ListUnpaidEarnings($_POST['id']));
}




/* Affiliate Add Sum Payment
---------------------------------------------------------------*/
if($_POST['type']=='merchant_paymentus'){
	require 'controller/payment.php';
    $error=0;
    $error_array = array();
    $obj  = json_decode($_POST['info'],true);


    $id                     ='0';
    $payment_date           =date('Y-m-d');
    $comments1              ='';
    $comments2              ='';


    if(empty($obj['id'])){
        $error=1;
        $error_array['id'] ='This is required.';
    }
    if(empty($obj['payment_date'])){
        $error=1;
        $error_array['payment_date'] ='This is required.';
    }



    if(!empty($obj['comments1'])){
        $comments1 = $obj['comments1'];
    }
    if(!empty($obj['comments2'])){
        $comments2 = $obj['comments2'];
    }
    if(!empty($obj['payment_date'])){
        $payment_date = $obj['payment_date'];
    }

    if(!empty($obj['id'])){
        $id = $obj['id'];
    }

    if($error==1){
        echo json_encode($error_array);exit;
    }else{

        $arg = array(
            'comments1'         => $comments1,
            'comments2'         => $comments2,
            'id'                => $id,
            'payment_date'      => $payment_date,
        );
        $return = json_encode($payment->PaymentMerchantUs($arg));

        if($return=='1'){
          echo $return;
        }else{
          echo $return;
        }

    }
}


if($_POST['type']=='merchant_invoicepayment'){
    require 'controller/payment.php';

    $obj  = json_decode($_POST['search'],true);
    $page                         = 1;

    $keywords                     = '';


    if(!empty($_POST['page'])){
        $page       = $_POST['page'];
    }
    if(!empty($obj['keywords'])){
        $keywords  = $obj['keywords'];
    }
    if(!empty($obj['id'])){
        $id  = $obj['id'];
    }


    $search = array(
        'keywords' => $keywords,
        'id' => $id,
    );


    echo json_encode($payment->initList($page,$search));
}


/* Invoice LDetails  */
if($_POST['type']=='merchant_invoice'){
  require 'controller/payment.php';
  echo json_encode($payment->InvoiceDetails($_POST['aff'],$_POST['id']));
}




/*-------------------------------------------------------------------------------------
-----------------------Affiliate Invoice Official------------------------------------*/
if($_POST['type']=='yearoptions'){
  require 'payment/unpaid.php';
  echo json_encode($unpaid->yearoptions());
}
if($_POST['type']=='merchant_offinvoice'){
  require 'payment/unpaid.php';
  $search  = json_decode($_POST['search'],true);
  echo json_encode($unpaid->listofmonths($_POST['search']));
}



/* List months with total */
if($_POST['type']=='listpayment_details'){
  require 'payment/unpaid.php';
  echo json_encode($unpaid->listarray($_POST['month'],$_POST['year']));
}


/* Payment Processing */
if($_POST['type']=='merchant_paymentprocessing'){
	require 'payment/payment.php';
    $error=0;
    $error_array = array();
    $obj  = json_decode($_POST['info'],true);


    $month                  ='';
    $year                   ='';
    $payment_date           =date('Y-m-d');
    $comments1              ='';
    $comments2              ='';
    $orderid                ='';
    $transactionid          ='';


    if(empty($obj['month'])){
        $error=1;
        $error_array['month'] ='This is required.';
    }
    if(empty($obj['year'])){
        $error=1;
        $error_array['year'] ='This is required.';
    }
    if(empty($obj['payment_date'])){
        $error=1;
        $error_array['payment_date'] ='This is required.';
    }


    if(!empty($obj['comments1'])){
        $comments1 = $obj['comments1'];
    }
    if(!empty($obj['comments2'])){
        $comments2 = $obj['comments2'];
    }
    if(!empty($obj['payment_date'])){
        $payment_date = $obj['payment_date'];
    }

    if(!empty($obj['month'])){
        $month = $obj['month'];
    }
    if(!empty($obj['year'])){
        $year = $obj['year'];
    }


    if(!empty($obj['orderid'])){$orderid = $obj['orderid'];}
    if(!empty($obj['transactionid'])){$transactionid = $obj['transactionid'];}

    if($error==1){
        echo json_encode($error_array);exit;
    }else{

        $arg = array(
            'comments1'         => $comments1,
            'comments2'         => $comments2,
            'payment_date'      => $payment_date,
            'month'             => $month,
            'year'              => $year,
            'orderid'           => $orderid,
            'transactionid'     => $transactionid,
        );
        echo json_encode($payment->PaymentMerchantUs($arg));

    }
}

/*-------------------------------------------------------------------------------------
-----------------------Affiliate Invoice after Payment------------------------------------*/
if($_POST['type']=='paymentaffiliate_history'){
  require 'payment/history.php';
  echo json_encode($history->paymenthistory());
}

if($_POST['type']=='monthly_invoice'){
  require 'payment/invoice.php';
  echo json_encode($invoice->allaffinvoice($_POST['id']));
}

if($_POST['type']=='monthlyaff_invoice'){
  require 'payment/invoice.php';
  echo json_encode($invoice->affinvoice($_POST['id'],$_POST['aff']));
}
