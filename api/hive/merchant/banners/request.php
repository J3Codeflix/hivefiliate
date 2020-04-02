<?php
require '../../config/session.php';
require '../../config/database.php';
require '../../config/paginations.php';


/* List Order
---------------------------------------------------------------*/
if($_POST['type']=='merchant_listorders'){
    require 'controller/list.php';

    $obj  = json_decode($_POST['search'],true);
    $page                         = 1;

    $order_id                     = '';
    $affiliate_id                 = '';
    $tracking_method              = '';
    $order_status                 = '';
    $date_from                    = '';
    $date_to                      = '';
    $is_order                     = '';

    if(!empty($_POST['page'])){
        $page       = $_POST['page'];
    }
    if(!empty($obj['order_id'])){
        $order_id  = $obj['order_id'];
    }
    if(!empty($obj['affiliate_id'])){
        $affiliate_id  = $obj['affiliate_id'];
    }
    if(!empty($obj['tracking_method'])){
        $tracking_method  = $obj['tracking_method'];
    }
    if(!empty($obj['order_status'])){
        $order_status  = $obj['order_status'];
    }
    if(!empty($obj['date_from'])){
        $date_from  = $obj['date_from'];
    }
    if(!empty($obj['date_to'])){
        $date_to  = $obj['date_to'];
    }

    if(!empty($obj['is_order'])){
        $is_order  = $obj['is_order'];
    }

    $search = array(
        'order_id'        => $order_id,
        'affiliate_id'    => $affiliate_id,
        'tracking_method' => $tracking_method,
        'order_status'    => $order_status,
        'date_from'       => $date_from,
        'date_to'         => $date_to,
        'is_order'        => $is_order,
    );

    echo json_encode($list->initList($page,$search));
}




/* Add Banner Settings
---------------------------------------------------------------*/


if($_POST['type']=='merchant_bannersettings'){
	require 'controller/form.php';
    $error=0;
    $error_array = array();
    $obj  = json_decode($_POST['info'],true);


    $is_shown              ='';
    $text_description      ='';


    if(empty($obj['text_description'])){
        $error=1;
        $error_array['text_description'] ='This is required.';
    }


    if($error==1){
        echo json_encode($error_array);exit;
    }else{

        if(!empty($obj['is_shown'])){               $is_shown           = $obj['is_shown'];}
        if(!empty($obj['text_description'])){       $text_description   = $obj['text_description'];}

        $arg = array(
            'is_shown'          => $is_shown,
            'text_description'  => $text_description,
        );

        echo json_encode($form->SaveOrder($arg));
    }
}


if($_POST['type']=='merchant_bannersettingstext'){
    require 'controller/list.php';
    echo json_encode($list->getbannersettings());
}

if($_POST['type']=='merchant_listofaffiliates'){
    require 'controller/list.php';
    echo json_encode($list->getaffiliateslist());
}

if($_POST['type']=='merchant_listcategories'){
    require 'controller/list.php';
    echo json_encode($list->getbannercategorieslist());
}

if($_POST['type']=='merchant_getcategory'){
    require 'controller/list.php';
    echo json_encode($list->getcategory());
}



/* Add Banner Categories
---------------------------------------------------------------*/

if($_POST['type']=='merchant_banncategories'){
	require 'controller/form.php';
    $error=0;
    $error_array = array();
    $obj  = json_decode($_POST['info'],true);

    $affiliate_id              ='';
    $category_name             ='';

    if(empty($obj['category_name'])){
        $error=1;
        $error_array['category_name'] ='This is required.';
    }

    if($error==1){
        echo json_encode($error_array);exit;
    }else{

        if(!empty($obj['category_name'])){     $category_name    = $obj['category_name'];}

        $arg = array(
            'category_name'     => $category_name,
            'affiliate_id'      => $obj['affiliate_id'],
        );

        echo json_encode($form->AddBannerCategories($arg));
    }
}


/* Delete Banner Categories
---------------------------------------------------------------*/

if($_POST['type']=='merchant_categoriesremove'){
    require 'controller/delete.php';
    echo json_encode($delete->removebannerCategories($_POST['id']));
}

if($_POST['type']=='merchant_deletebanner'){
    require 'controller/delete.php';
    $return = $delete->deleteBanner($_POST['id']);
    if($return==1){
        if(file_exists("../../uploads/".$_POST['filename'])){
            unlink("../../uploads/".$_POST['filename']);
        }
    }
    echo $return;
}




/* Add Banner
---------------------------------------------------------------*/
if($_POST['type']=='merchant_addbanner'){
	require 'controller/form.php';
    $error=0;
    $error_array = array();
    $obj  = json_decode($_POST['info'],true);

    $image              ='';
    $is_show            ='';
    $bann_category      ='';
    $url_banner         ='';
    $banner_width       ='';
    $banner_height      ='';
    $note_banner        ='';
    $width              ='';
    $height             ='';


    if(isset($_FILES['file']['name'])) {
        $errors= array();
        $expensions = array("jpeg","jpg","png","JPEG","JPG","PNG");
        $array=0;

        $file_name  = $_FILES['file']['name'];
        $file_size  = $_FILES['file']['size'];
        $file_tmp   = $_FILES['file']['tmp_name'];
        $file_type  = $_FILES['file']['type'];
        $file_ext   = pathinfo($file_name, PATHINFO_EXTENSION);

        if($form->checkfilename($file_name)>0){
            echo 'image_exist';exit;
        }
        $filename   = $file_name;
        move_uploaded_file($file_tmp,"../../uploads/".$filename);
        list($width, $height) = getimagesize("../../uploads/".$filename);

        $image              = $filename;
        $banner_width       = $width;
        $banner_height      = $height;

    }else{
        echo 'image_required';exit;
    }

    if($error==1){
        echo json_encode($error_array);
        exit;
    }else{

        if(!empty($obj['is_show'])){		      $is_show 	      = $obj['is_show'];}
        if(!empty($obj['bann_category'])){		$bann_category 	= $obj['bann_category'];}
        if(!empty($obj['url_banner'])){		    $url_banner 	  = $obj['url_banner'];}
        if(!empty($obj['banner_width'])){		  $banner_width 	= $obj['banner_width'];}
        if(!empty($obj['banner_height'])){		$banner_height 	= $obj['banner_height'];}
        if(!empty($obj['note_banner'])){		  $note_banner 	  = $obj['note_banner'];}

        $arg = array(
            'is_show'               => $is_show,
            'bann_category'         => $bann_category,
            'url_banner'            => $url_banner,
            'banner_width'          => $banner_width,
            'banner_height'         => $banner_height,
            'note_banner'           => $note_banner,
            'image'                 => $image,
        );
        echo json_encode($form->addBanner($arg));
    }
}


/* Update Banner
---------------------------------------------------------------*/
if($_POST['type']=='merchant_updatebanner'){
	require 'controller/form.php';
    $error=0;
    $error_array = array();
    $obj  = json_decode($_POST['info'],true);

    $image              ='';
    $is_show            ='';
    $bann_category      ='';
    $url_banner         ='';
    $banner_width       ='';
    $banner_height      ='';
    $note_banner        ='';
    $width              ='';
    $height             ='';
    $id                 ='';
    $thefilename        ='';


    if(isset($_FILES['file']['name'])) {
        $errors= array();
        $expensions = array("jpeg","jpg","png","JPEG","JPG","PNG");
        $array=0;

        $file_name  = $_FILES['file']['name'];
        $file_size  = $_FILES['file']['size'];
        $file_tmp   = $_FILES['file']['tmp_name'];
        $file_type  = $_FILES['file']['type'];
        $file_ext   = pathinfo($file_name, PATHINFO_EXTENSION);

        if($form->checkfilename($file_name)>0){
            echo 'image_exist';exit;
        }
        $filename   = $file_name;
        move_uploaded_file($file_tmp,"../../uploads/".$filename);
        list($width, $height) = getimagesize("../../uploads/".$filename);

        $image              = $filename;
        $banner_width       = $width;
        $banner_height      = $height;

        if(file_exists("../../uploads/".$obj['file_name'])){
            unlink("../../uploads/".$obj['file_name']);
        }

    }else{
        $image              =  $obj['file_name'];
    }

    if($error==1){
        echo json_encode($error_array);
        exit;
    }else{

        if(!empty($obj['is_show'])){		    $is_show 	    = $obj['is_show'];}
        if(!empty($obj['bann_category'])){		$bann_category 	= $obj['bann_category'];}
        if(!empty($obj['url_banner'])){		    $url_banner 	= $obj['url_banner'];}
        if(!empty($obj['banner_width'])){		$banner_width 	= $obj['banner_width'];}
        if(!empty($obj['banner_height'])){		$banner_height 	= $obj['banner_height'];}
        if(!empty($obj['note_banner'])){		$note_banner 	= $obj['note_banner'];}

        $arg = array(
            'id'                    => $obj['id'],
            'is_show'               => $is_show,
            'bann_category'         => $bann_category,
            'url_banner'            => $url_banner,
            'banner_width'          => $banner_width,
            'banner_height'         => $banner_height,
            'note_banner'           => $note_banner,
            'image'                 => $image,
        );
        echo json_encode($form->updateBanner($arg));
    }
}




if($_POST['type']=='merchant_listbanners'){
    require 'controller/list.php';
    echo json_encode($list->listofBanners());
}
