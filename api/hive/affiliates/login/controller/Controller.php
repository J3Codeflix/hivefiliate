<?php
class Controller extends Database{

    public function __construct(){
        $this->conn 		  = $this->getConnection();
        $this->session        = $this->AffiliateSessionHandler();
	}


	/* Get Current Affiliate user */

	function merchantsiteurl($id){
		$query="select * from settings_general WHERE id_merchant=:id_merchant";
		$stmt = $this->conn->prepare( $query );
		$stmt->bindValue(':id_merchant',$id);
		$stmt->execute();
		if($stmt->rowCount()==0){return 'Merchant does not have site url yet.';}
		$row = $stmt->fetch(PDO::FETCH_ASSOC);
		if($row['site_address']==''){return 'Merchant does not have site url yet.';}
		return $row['site_address'].'/?aff='.$this->session;
	}

	function AffiliateUser(){
		$query="select * from affiliates WHERE id=:id";
		$stmt = $this->conn->prepare( $query );
		$stmt->bindValue(':id',$this->session);
		$stmt->execute();
		if($stmt->rowCount()==0){return 0;}
		$row = $stmt->fetch(PDO::FETCH_ASSOC);
		return array(
			'id_merchant' 			   => $row['id_merchant'],
			'id_hash' 				     => $row['id_hash'],
			'email' 				       => $row['email'],
			'name' 					       => $row['first_name'].' '.$row['last_name'],
			'first_name' 			     => $row['first_name'],
			'last_name' 			     => $row['last_name'],
			'affiliate_link' 		   => $this->merchantsiteurl($row['id_merchant']),
			'affiliate_param' 		 => '/?aff='.$this->session,
      'coupon_code' 			   => $row['coupon_code'],
      'type_discount' 			 => $row['type_discount'],
      'discount_description' => $row['discount_description'],
		);
	}



	/* Login Form */

	function IsAffiliateLogin(){
		$query="select * from affiliates WHERE id=:id";
		$stmt = $this->conn->prepare( $query );
		$stmt->bindValue(':id',$this->session);
		$stmt->execute();
		return $stmt->rowCount();
	}

	function ismerchantid($hash_id){
		$query ="select * from merchant where hash_id=:hash_id";
		$stmt = $this->conn->prepare($query);
		$stmt->bindValue(':hash_id',$hash_id);
		$stmt->execute();
		return $stmt->rowCount();
	}

	function LoginControll($arg){

	  if($this->ismerchantid($arg['id_merchant'])==0){
		return 'invalid_merchant';
	  }

	  $query="select * from affiliates WHERE email=:email and is_deleted=0 and is_reset=0";
	  $stmt = $this->conn->prepare( $query );
	  $stmt->bindValue(':email',$arg['email']);
	  $stmt->execute();
	  $row = $stmt->fetch(PDO::FETCH_ASSOC);
	  if($stmt->rowCount()==0){ return 0; exit;}
	  if (crypt($arg['password'], extend_token().$row['password']) == extend_token().$row['password']) {
			if($row['status']=='is_pending'){return 'account_pending';}
			if($row['status']=='is_block'){return 'account_block';}
			if($row['status']=='is_rejected'){return 'account_rejected';}
			SetSessionHandlerAffiliates($row['id']);
		    return 1;
	  }else{
		  return 0;
	  }
  }


  function checkMerchant($hash_id){
		$query ="select * from merchant where hash_id=:hash_id";
		$stmt = $this->conn->prepare($query);
		$stmt->bindValue(':hash_id',$hash_id);
		$stmt->execute();
		if($stmt->rowCount()==0){return 'invalid_merchant';}
		$row = $stmt->fetch(PDO::FETCH_ASSOC);
		return $row['store_name'];
	}



  /* Merchant Data Configuration */

  function merchantinfo($id){
    $query ="select * from merchant where store_id=:store_id";
    $stmt = $this->conn->prepare($query);
    $stmt->bindValue(':store_id',$id);
    $stmt->execute();
    $row = $stmt->fetch(PDO::FETCH_ASSOC);
    return $row['id'];
  }

  function DataConfiguration($id){

    $id_merchant = $this->merchantinfo($id);

    $query ="select * from settings_tracking where id_merchant=:id_merchant";
    $stmt = $this->conn->prepare($query);
    $stmt->bindValue(':id_merchant',$id_merchant);
    $stmt->execute();
    $row = $stmt->fetch(PDO::FETCH_ASSOC);

    if($row['commission_type']==1){
        $com_type  = 'Percent of Sale';
        $base_com  = $row['commission_percent'].' %';
    }else{
        $com_type = 'Flat rate per purchase';
        $base_com = $row['flat_rate'].' in $USD';
    }

    return array(
      'cookie_days' => $row['cookie_duration'],
      'com_type'    => $com_type,
      'base_com'    => $base_com,
    );

  }




}
$controller = new Controller();
