<?php 
require '../../config/session.php';
require '../../config/database.php';

/* Installation Shopify
---------------------------------------------------------------*/
if($_POST['type']=='merchant_installshopify'){
	require 'controller/form.php';
    $error=0;
    $error_array = array();
    $obj  = json_decode($_POST['info'],true);

    $shopify_store                  ='';

    if(empty($obj['shopify_store'])){
        $error=1;
        $error_array['shopify_store'] ='Enter shopify store name';
    }
    if($error==1){
        echo json_encode($error_array);exit;
    }else{
        echo $form->IsMerchantLogin();
    }
}
