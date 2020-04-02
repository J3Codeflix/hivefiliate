<?php
require '../../config/session.php';
require '../../config/database.php';
require '../../config/paginations.php';
require '../../config/email/class.phpmailer.php';
require '../../config/email/serveremail.php';
if($_POST['type']=='affiliates_list'){
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

/*---------------------- Affiliate Add------------------------------- */

if($_POST['type']=='admin_affiliateadd'){
	  require 'controller/form.php';
    $error=0;
    $error_array = array();
    $obj  = json_decode($_POST['info'],true);

    $id_merchant            ='';
    $email                  ='';
    $password               ='';
    $first_name             ='';
    $last_name              ='';

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

        if(!empty($obj['email'])){   				$email   			= $obj['email'];}
				if(!empty($obj['password'])){   		$password   	= $obj['password'];}
				if(!empty($obj['first_name'])){   	$first_name   = $obj['first_name'];}
				if(!empty($obj['last_name'])){      $last_name    = $obj['last_name'];}
        if(!empty($obj['id_merchant'])){    $id_merchant    = $obj['id_merchant'];}

        $arg = array(
            'email'      				=> $email,
            'password'          => $password,
						'first_name'        => $first_name,
						'last_name'         => $last_name,
            'id_merchant'       => $id_merchant,
        );

        $return = $form->insertAffiliate($arg);
        if($return=='1'){
          require '../../config/email/merchant/status.php';
          $merch          = $form->infomerchant($id_merchant);
          $merchant  			= $merch['store_name'];
          $status         = 'is_active';
          $link 					= linkloginaffiliate($merch['hash_id']);
          echo StatusChange($obj['email'],$status,$merchant,$link);
        }else{
          echo $return;
        }
    }
}


/*---------------------- Affiliate Update------------------------------- */

if($_POST['type']=='admin_affiliateupdate'){
	  require 'controller/form.php';
    $error=0;
    $error_array = array();
    $obj  = json_decode($_POST['info'],true);

    $id                     ='';
    $id_merchant            ='';
    $email                  ='';
    $password               ='';
    $first_name             ='';
    $last_name              ='';


    if(empty($obj['id'])){
        $error=1;
        $error_array['id'] ='This is required.';
    }

    if(empty($obj['id_merchant'])){
        $error=1;
        $error_array['id_merchant'] ='This is required.';
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

        if(!empty($obj['id'])){   				  $id   			     = $obj['id'];}
        if(!empty($obj['email'])){   				$email   			   = $obj['email'];}
				if(!empty($obj['password'])){   		$password   	   = $obj['password'];}
				if(!empty($obj['first_name'])){   	$first_name      = $obj['first_name'];}
				if(!empty($obj['last_name'])){      $last_name       = $obj['last_name'];}
        if(!empty($obj['id_merchant'])){    $id_merchant     = $obj['id_merchant'];}

        $arg = array(
            'id'      				  => $id,
            'email'      				=> $email,
            'password'          => $password,
						'first_name'        => $first_name,
						'last_name'         => $last_name,
            'id_merchant'       => $id_merchant,
        );

        echo json_encode($form->updateAffiliate($arg));
    }
}

/* -------------------Affiliate Delete Temporarily------------------------- */

if($_POST['type']=='admin_affiliatedelete'){
  require 'controller/delete.php';
  $obj  = json_decode($_POST['info'],true);
  if(empty($obj['id'])){
    echo 'Error';exit;
  }
  echo json_encode($delete->DeleteAccount($obj['id']));
}

/* -------------------Affiliate Retrieve------------------------- */

if($_POST['type']=='affiliate_retrieveback'){
  require 'controller/delete.php';
  $obj  = json_decode($_POST['info'],true);
  if(empty($obj['id'])){
    echo 'Error';exit;
  }
  echo json_encode($delete->AccountRetrieve($obj['id']));
}

if($_POST['type']=='affiliate_wipedata'){
  require 'controller/delete.php';
  $obj  = json_decode($_POST['info'],true);
  if(empty($obj['id'])){
    echo 'Error';exit;
  }
  echo json_encode($delete->AffiliateWipeData($obj['id']));
}


/* -------------------Payment history merchant to affiliate------------------------- */

if($_POST['type']=='affiliates_merchantpayment'){
    require 'controller/payhistory.php';

    $obj  = json_decode($_POST['search'],true);
    $page                         = 1;

    $search_field                 = '1';
    $search_keywords              = '';
    $id                           = '';

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
        $id   = $obj['id'];
    }

    $search = array(
        'search_field' => $search_field,
        'search_keywords' => $search_keywords,
        'id' => $id,
    );
    echo json_encode($pay->initList($page,$search));
}
