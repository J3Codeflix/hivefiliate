<?php
require '../../config/session.php';
require '../../config/database.php';
require '../../config/paginations.php';

if($_POST['type']=='admin_listusers'){
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


if($_POST['type']=='admin_adduser'){
	require 'controller/form.php';
    $error=0;
    $error_array = array();
    $obj  = json_decode($_POST['info'],true);

    $fullname         ='';
    $email            ='';
    $password         ='';
    $status           ='';
    $description      ='';
    $is_view          ='';
    $is_edit          ='';
    $is_delete        ='';

    if(empty($obj['fullname'])){
        $error=1;
        $error_array['fullname'] ='This is required.';
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
            if($form->checkemail($obj['email'],0)>0){
                $error=1;
                $error_array['email'] ='Email is already used.';
            }
        }
    }


		if(empty($obj['password'])){
				$error=1;
				$error_array['password'] ='This is required.';
		}

		if(empty($obj['status'])){
				$error=1;
				$error_array['status'] ='This is required.';
		}

    if($error==1){
        echo json_encode($error_array);exit;
    }else{

        if(!empty($obj['fullname'])){     	$fullname     = $obj['fullname'];}
        if(!empty($obj['email'])){   				$email   			= $obj['email'];}
				if(!empty($obj['password'])){   		$password   	= $obj['password'];}
				if(!empty($obj['status'])){   			$status   		= $obj['status'];}
				if(!empty($obj['description'])){    $description  = $obj['description'];}
        if(!empty($obj['is_view'])){        $is_view      = $obj['is_view'];}
        if(!empty($obj['is_edit'])){        $is_edit      = $obj['is_edit'];}
        if(!empty($obj['is_delete'])){      $is_delete    = $obj['is_delete'];}

        $arg = array(
            'fullname'        	=> $fullname,
            'email'      				=> $email,
            'password'          => $password,
						'status'            => $status,
						'description'       => $description,
            'is_view'           => truefalse($is_view),
            'is_edit'           => truefalse($is_edit),
            'is_delete'         => truefalse($is_delete),
        );

        echo json_encode($form->insertUser($arg));
    }
}



if($_POST['type']=='admin_updateuser'){
	require 'controller/form.php';
    $error=0;
    $error_array = array();
    $obj  = json_decode($_POST['info'],true);

    $id               =0;
    $fullname         ='';
    $email            ='';
    $password         ='';
    $status           ='';
    $description      ='';
    $is_change        ='';
    $is_view          ='';
    $is_edit          ='';
    $is_delete        ='';


    if(!empty($obj['id'])){     	      $id           = $obj['id'];}

    if(empty($obj['fullname'])){
        $error=1;
        $error_array['fullname'] ='This is required.';
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
            if($form->checkemail($obj['email'],$id)>0){
                $error=1;
                $error_array['email'] ='Email is already used.';
            }
        }
    }


		if(empty($obj['status'])){
				$error=1;
				$error_array['status'] ='This is required.';
		}

    if($error==1){
        echo json_encode($error_array);exit;
    }else{


        if(!empty($obj['fullname'])){     	$fullname     = $obj['fullname'];}
        if(!empty($obj['email'])){   				$email   			= $obj['email'];}
				if(!empty($obj['password'])){   		$password   	= $obj['password'];}
				if(!empty($obj['status'])){   			$status   		= $obj['status'];}
				if(!empty($obj['description'])){    $description  = $obj['description'];}
        if(!empty($obj['is_change'])){      $is_change    = $obj['is_change'];}
        if(!empty($obj['is_view'])){        $is_view      = $obj['is_view'];}
        if(!empty($obj['is_edit'])){        $is_edit      = $obj['is_edit'];}
        if(!empty($obj['is_delete'])){      $is_delete    = $obj['is_delete'];}

        $arg = array(
            'id'        	      => $id,
            'fullname'        	=> $fullname,
            'email'      				=> $email,
            'password'          => $password,
						'status'            => $status,
						'description'       => $description,
            'is_change'         => $is_change,
            'is_view'           => truefalse($is_view),
            'is_edit'           => truefalse($is_edit),
            'is_delete'         => truefalse($is_delete),
        );

        echo json_encode($form->updateUser($arg));
    }
}


if($_POST['type']=='admin_deleteuser'){
	require 'controller/delete.php';
  echo json_encode($delete->deleteUser($_POST['id']));
}

/* Account */
if($_POST['type']=='admin_account'){
	require 'controller/form.php';
  echo json_encode($form->getaccount());
}

if($_POST['type']=='admin_updateaccount'){
	require 'controller/form.php';
    $error=0;
    $error_array = array();
    $obj  = json_decode($_POST['info'],true);

    $fullname         ='';
    $email            ='';
    $password         ='';
    $status           ='';
    $description      ='';



    if(empty($obj['fullname'])){
        $error=1;
        $error_array['fullname'] ='This is required.';
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
            if($form->checkemailaccount($obj['email'])>0){
                $error=1;
                $error_array['email'] ='Email is already used.';
            }
        }
    }

		if(empty($obj['status'])){
				$error=1;
				$error_array['status'] ='This is required.';
		}

    if($error==1){
        echo json_encode($error_array);exit;
    }else{

        if(!empty($obj['fullname'])){     	$fullname     = $obj['fullname'];}
        if(!empty($obj['email'])){   				$email   			= $obj['email'];}
				if(!empty($obj['password'])){   		$password   	= $obj['password'];}
				if(!empty($obj['status'])){   			$status   		= $obj['status'];}
				if(!empty($obj['description'])){    $description  = $obj['description'];}

        $arg = array(
            'id'        	      => $id,
            'fullname'        	=> $fullname,
            'email'      				=> $email,
            'password'          => $password,
						'status'            => $status,
						'description'       => $description
        );

        echo json_encode($form->updateAccount($arg));
    }
}
