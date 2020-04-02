<?php
require '../../config/session.php';
require '../../config/database.php';


/*---------------------- Subscription Settings ------------------------------- */
if($_POST['type']=='subscription_settingsinfo'){
	require 'controller/form.php';
	echo json_encode($form->SubscriptionInfo());
}

if($_POST['type']=='subscription_updatesetting'){
	require 'controller/form.php';
    $error=0;
    $error_array = array();
    $obj  = json_decode($_POST['info'],true);

    $plan_professional             ='';
    $plan_enterprise          		 ='';

    if(empty($obj['plan_professional'])){
        $error=1;
        $error_array['plan_professional'] ='This is required.';
    }
    if(empty($obj['plan_enterprise'])){
        $error=1;
        $error_array['plan_enterprise'] ='This is required.';
    }

    if($error==1){
        echo json_encode($error_array);exit;
    }else{

        if(!empty($obj['plan_professional'])){       $plan_professional    = str_replace(',', '', $obj['plan_professional']);}
        if(!empty($obj['plan_enterprise'])){         $plan_enterprise      = str_replace(',', '', $obj['plan_enterprise']);}

        $arg = array(
            'plan_professional'   => $plan_professional,
            'plan_enterprise'     => $plan_enterprise,
        );

        echo json_encode($form->SaveSubscription($arg));
    }
}

/*---------------------- Paypal Settings ------------------------------- */
if($_POST['type']=='paypal_settingsinfo'){
	require 'controller/form.php';
	echo json_encode($form->paypalinfo());
}
if($_POST['type']=='paypal_setting'){
	require 'controller/form.php';
    $error=0;
    $error_array = array();
    $obj  = json_decode($_POST['info'],true);


    $paypal_clientid            ='';
    $is_live                    ='';

    if(empty($obj['paypal_clientid'])){
        $error=1;
        $error_array['paypal_clientid'] ='This is required.';
    }

    if($error==1){
        echo json_encode($error_array);exit;
    }else{


        if(!empty($obj['paypal_clientid'])){           $paypal_clientid        = $obj['paypal_clientid'];}
        if(!empty($obj['is_live'])){                   $is_live                = $obj['is_live'];}

        $arg = array(
            'paypal_clientid'       => $paypal_clientid,
            'is_live'               => $is_live,
        );

        echo json_encode($form->SavePaypalSettings($arg));
    }
}


/* ------------------------ App Configurations ------------------------*/
if($_POST['type']=='app_configinfo'){
	require 'controller/form.php';
	echo json_encode($form->Appconfiginfo());
}
if($_POST['type']=='app_configuration'){
	require 'controller/form.php';
    $error=0;
    $error_array = array();
    $obj  = json_decode($_POST['info'],true);

    $notif_slsaff            ='';
    $notif_slsmerc           ='';
		$notif_paysentaff 			 ='';

    if($error==1){
        echo json_encode($error_array);exit;
    }else{

        if(!empty($obj['notif_slsaff'])){           			$notif_slsaff         		= $obj['notif_slsaff'];}
        if(!empty($obj['notif_slsmerc'])){         				$notif_slsmerc         		= $obj['notif_slsmerc'];}
				if(!empty($obj['notif_paysentaff'])){         		$notif_paysentaff         = $obj['notif_paysentaff'];}

        $arg = array(
            'notif_slsaff'       			=> $notif_slsaff,
            'notif_slsmerc'      			=> $notif_slsmerc,
						'notif_paysentaff'      	=> $notif_paysentaff,
        );

        echo json_encode($form->SaveConfigurations($arg));
    }
}
