<?php
require '../../config/session.php';
require '../../config/database.php';
require '../../config/paginations.php';
require '../../config/email/class.phpmailer.php';
require '../../config/email/serveremail.php';

if($_POST['type']=='merchant_list'){
    require 'controller/list.php';

    $obj  = json_decode($_POST['search'],true);
    $page                         = 1;

    $search_field                 = '1';
    $search_keywords              = '';
    $is_deleted                   = '';

    if(!empty($_POST['page'])){
        $page       = $_POST['page'];
    }
    if(!empty($obj['search_field'])){
        $search_field   = $obj['search_field'];
    }
    if(!empty($obj['search_keywords'])){
        $search_keywords    = $obj['search_keywords'];
    }
    if(!empty($obj['is_deleted'])){
        $is_deleted   = $obj['is_deleted'];
    }
    $search = array(
        'search_field' => $search_field,
        'search_keywords' => $search_keywords,
        'is_deleted' => $is_deleted,
    );
    echo json_encode($list->initList($page,$search));
}

/*---------------------- Account Add------------------------------- */

if($_POST['type']=='admin_merchantadd'){
	  require 'controller/form.php';
    $error=0;
    $error_array = array();
    $obj  = json_decode($_POST['info'],true);

    $email            ='';
    $password         ='';
    $store_name       ='';
    $description      ='';
    $is_send          ='';


    if(empty($obj['email'])){
        $error=1;
        $error_array['email'] ='This is required.';
    }
		if(!empty($obj['email'])){
        if (!filter_var($obj['email'], FILTER_VALIDATE_EMAIL)) {
            $error=1;
            $error_array['email'] ='This is required.';
        }else{
            if($form->checkingEmailFunction($obj['email'])>0){
                $error=1;
                $error_array['email'] ='Email is already used.';
            }
        }
    }


		if(empty($obj['password'])){
				$error=1;
				$error_array['password'] ='This is required.';
		}

		if(empty($obj['store_name'])){
				$error=1;
				$error_array['store_name'] ='This is required.';
		}
    if(!empty($obj['store_name'])){
			if($form->checkstore($obj['store_name'])>0){
				$error=1;
        $error_array['store_name'] ='Store name is already taken.';
			}
    }

    if($error==1){
        echo json_encode($error_array);exit;
    }else{

        if(!empty($obj['email'])){   				$email   			= $obj['email'];}
				if(!empty($obj['password'])){   		$password   	= $obj['password'];}
				if(!empty($obj['store_name'])){   	$store_name   = $obj['store_name'];}
				if(!empty($obj['description'])){    $description  = $obj['description'];}

        $arg = array(
            'email'      				=> $email,
            'password'          => $password,
						'store_name'        => $store_name,
						'description'       => $description,
        );

        $return = json_encode($form->insertStore($arg));
        if($return=='1'){

          require '../../config/email/merchant/welcome.php';
          echo MerchantWelcomRegister($name,$email);

          /*require '../../config/email/welcome.php';

          $email          = $email;
          $link           = baseurl('/login');
          $name           = $store_name;
          $password       = $password;

          echo MerchantRegisteredStore($email,$link,$name,$password);*/

        }else{
          echo $return;
        }
    }
}

/*---------------------- Account Update------------------------------- */

if($_POST['type']=='admin_merchantupdate'){
	  require 'controller/form.php';
    $error=0;
    $error_array = array();
    $obj  = json_decode($_POST['info'],true);

    $email            ='';
    $password         ='';
    $store_name       ='';
    $description      ='';
    $is_send          ='';
    $id               ='';


		if(empty($obj['store_name'])){
				$error=1;
				$error_array['store_name'] ='This is required.';
		}

    if(!empty($obj['store_name'])){
			if($form->checkstoreupdate($obj['store_name'],$obj['id'])>0){
				$error=1;
        $error_array['store_name'] ='Store name is already taken.';
			}
    }

    if($error==1){
        echo json_encode($error_array);exit;
    }else{

        if(!empty($obj['email'])){   				$email   			= $obj['email'];}
				if(!empty($obj['password'])){   		$password   	= $obj['password'];}
				if(!empty($obj['store_name'])){   	$store_name   = $obj['store_name'];}
				if(!empty($obj['description'])){    $description  = $obj['description'];}
        if(!empty($obj['id'])){             $id           = $obj['id'];}

        $arg = array(
            'email'      				=> $email,
            'password'          => $password,
						'store_name'        => $store_name,
						'description'       => $description,
            'id'                => $id,
        );

        echo json_encode($form->updateStore($arg));
    }
}




/*---------------------- Payment Subscription Superadmin------------------------------- */

if($_POST['type']=='admin_merchantpayment'){
	  require 'controller/payment.php';
    $error=0;
    $error_array = array();
    $obj  = json_decode($_POST['info'],true);

    $id                   ='';
    $currency             ='';
    $currentplan          ='';
    $plan                 ='';
    $sub_professional     ='';
    $sub_enterprise       ='';
    $price_professional   ='';
    $price_enterprise     ='';
    $remdays              ='';
    $plan_expire          ='';
    $description          ='';


    if(empty($obj['id'])){
        $error=1;
        $error_array['id'] ='This is required.';
    }

		if(empty($obj['currency'])){
				$error=1;
				$error_array['currency'] ='This is required.';
		}

		if(empty($obj['currentplan'])){
				$error=1;
				$error_array['currentplan'] ='This is required.';
		}
    if(empty($obj['plan'])){
        $error=1;
        $error_array['plan'] ='This is required.';
    }
    if(empty($obj['sub_professional'])){
        $error=1;
        $error_array['sub_professional'] ='This is required.';
    }
    if(empty($obj['sub_enterprise'])){
        $error=1;
        $error_array['sub_enterprise'] ='This is required.';
    }
    if(empty($obj['price_professional'])){
        $error=1;
        $error_array['price_professional'] ='This is required.';
    }
    if(empty($obj['price_enterprise'])){
        $error=1;
        $error_array['price_enterprise'] ='This is required.';
    }
    if(empty($obj['remdays'])){
        $error=1;
        $error_array['remdays'] ='This is required.';
    }
    if(empty($obj['plan_expire'])){
        $error=1;
        $error_array['plan_expire'] ='This is required.';
    }

    if($error==1){
        echo json_encode($error_array);exit;
    }else{

        if(!empty($obj['id'])){   				         $id   			          = $obj['id'];}
				if(!empty($obj['currency'])){   	 	       $currency  	        = $obj['currency'];}
				if(!empty($obj['currentplan'])){   	       $currentplan         = $obj['currentplan'];}
				if(!empty($obj['plan'])){                  $plan                = $obj['plan'];}
        if(!empty($obj['sub_professional'])){      $sub_professional    = $obj['sub_professional'];}
        if(!empty($obj['sub_enterprise'])){        $sub_enterprise      = $obj['sub_enterprise'];}
        if(!empty($obj['price_professional'])){    $price_professional  = $obj['price_professional'];}
        if(!empty($obj['price_enterprise'])){      $price_enterprise    = $obj['price_enterprise'];}
        if(!empty($obj['remdays'])){               $remdays             = $obj['remdays'];}
        if(!empty($obj['plan_expire'])){           $plan_expire         = $obj['plan_expire'];}
        if(!empty($obj['description'])){           $description         = $obj['description'];}

        $arg = array(
            'id'      				        => $id,
            'currency'                => $currency,
						'currentplan'             => $currentplan,
						'plan'                    => $plan,
            'sub_professional'        => $sub_professional,
            'sub_enterprise'          => $sub_enterprise,
            'price_professional'      => $price_professional,
            'price_enterprise'        => $price_enterprise,
            'remdays'                 => $remdays,
            'plan_expire'             => $plan_expire,
            'description'             => $description,

        );

        $return = $payment->PaymentSubscriptions($arg);
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

          //require '../../config/email/payment_subscriptions.php';
          //$isemail = PaymentSubscriptionPlan($return);
          //if($isemail=='0'||$isemail=='1'){echo '1';}
        }else{
          echo $return;
        }
    }
}

/* -------------------Payment History------------------------- */

if($_POST['type']=='merchant_paymenthistory'){
    require 'controller/payhistory.php';

    $obj  = json_decode($_POST['search'],true);
    $page                         = 1;

    $id                           = '0';
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
    if(!empty($obj['id'])){
        $id    = $obj['id'];
    }
    $search = array(
        'search_field' => $search_field,
        'search_keywords' => $search_keywords,
        'id' => $id,
    );
    echo json_encode($pay->initList($page,$search));
}


/* -------------------Merchant Store Delete Temporarily------------------------- */

if($_POST['type']=='admin_merchantdelete'){
  require 'controller/delete.php';
  $obj  = json_decode($_POST['info'],true);
  if(empty($obj['id'])){
    echo 'Error';exit;
  }
  echo json_encode($delete->DeleteAccount($obj['id']));
}

/* -------------------Merchant Store Revert it back------------------------- */

if($_POST['type']=='admin_merchantrevertback'){
  require 'controller/delete.php';
  $obj  = json_decode($_POST['info'],true);
  if(empty($obj['id'])){
    echo 'Error';exit;
  }
  echo json_encode($delete->AccountRetrieve($obj['id']));
}

/* ---------------------------------------------------------------------------------------------------------------------------------
---------------------------------------------- Merchant Delete Completely----------------------------------------------------------- */

if($_POST['type']=='admin_merchantwipeout'){
  require 'controller/delete.php';
  $obj  = json_decode($_POST['info'],true);
  echo $delete->AccountMerchantWipeoutCompletely($obj['id']);
}

/* ---------------------------------------------------------------------------------------------------------------------------------
---------------------------------------------- Merchant Invoice----------------------------------------------------------- */
if($_POST['type']=='merchant_invoice'){
    require 'invoice/list.php';

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
        'search_field' => $search_field,
        'search_keywords' => $search_keywords,
    );
    echo json_encode($list->initList($page,$search));
}
if($_POST['type']=='payment_approval'){
  require 'invoice/approval.php';
  echo json_encode($approval->InvoiceDetails($_POST['id']));
}

if($_POST['type']=='payment_processapproval'){
  require 'invoice/approval.php';
  $obj  = json_decode($_POST['info'],true);
  $admin_notes='';
  $approved=1;
  if(!empty($_POST['click'])){
      $approved   = $_POST['click'];
  }
  if(!empty($obj['admin_notes'])){
      $admin_notes   = $obj['admin_notes'];
  }
  $arg = array(
      'admin_notes' => $admin_notes,
      'id' => $obj['id'],
  );
  echo json_encode($approval->ProcessPayment($arg,$approved));
}

/* Invoice Payment */
if($_POST['type']=='payment_invoice'){
  require 'invoice/invoice.php';
  echo json_encode($invoice->InvoiceDetails($_POST['id']));
}
if($_POST['type']=='payment_affinvoice'){
  require 'invoice/invoice.php';
  echo json_encode($invoice->affInvoiceDetails($_POST['id'],$_POST['aff']));
}
