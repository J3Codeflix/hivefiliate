<?php
class Controller extends Database{

    public function __construct(){
        $this->conn 		 	 = $this->getConnection();
		    $this->session        	 = $this->MerchantSessionHandler();
		    $this->merchant          = $this->MerchantData();
	}


  /* Check Mail */
  function checkemailmerchant($email){
		$query ="select * from merchant where email=:email";
		$stmt = $this->conn->prepare($query);
		$stmt->bindValue(':email',$email);
		$stmt->execute();
		return $stmt->rowCount();
	}

	function checkaffiliatesemail($email){
		$query ="select * from affiliates where email=:email";
		$stmt = $this->conn->prepare($query);
		$stmt->bindValue(':email',$email);
		$stmt->execute();
		return $stmt->rowCount();
	}

	function checkstaffemail($email){
		$query ="select * from staff where email=:email";
		$stmt = $this->conn->prepare($query);
		$stmt->bindValue(':email',$email);
		$stmt->execute();
		return $stmt->rowCount();
	}

	function checkadminemail($email){
		$query ="select * from administrator where email=:email";
		$stmt = $this->conn->prepare($query);
		$stmt->bindValue(':email',$email);
		$stmt->execute();
		return $stmt->rowCount();
	}



	function checkemail($email){
    if($this->checkemailmerchant($email)>0||$this->checkaffiliatesemail($email)>0||$this->checkstaffemail($email)>0||$this->checkadminemail($email)>0){
      return 1;
    }
    return 0;
	}


  function defaultsettings(){
      $query ="select * from admin_settings order by id desc limit 1";
      $stmt = $this->conn->prepare($query);
      $stmt->execute();
      if($stmt->rowCount()==0){
        return array(
          'commission_type' => 1,
          'commission_percent' => 3,
          'cookie_duration' => 7,
        );
      }
      $row = $stmt->fetch(PDO::FETCH_ASSOC);
      return array(
        'commission_type' => 1,
        'commission_percent' => $row['commission_percent'],
        'cookie_duration' => $row['cookie_duration'],
      );
  }
  function DefaultaffPercentage($id){
      $query ="select * from settings_tracking where id_merchant=:id_merchant";
      $stmt = $this->conn->prepare($query);
      $stmt->bindValue(':id_merchant',$id);
      $stmt->execute();
      if($stmt->rowCount()==0){
         return $this->defaultsettings();
      }else{
         $row = $stmt->fetch(PDO::FETCH_ASSOC);
         return array(
           'commission_type' => $row['commission_type'],
           'commission_percent' => $row['commission_percent'],
           'cookie_duration' => $row['cookie_duration'],
         );
      }

  }

  function infomerchant(){
    $query ="select store_name,hash_id,email from merchant where id=:id";
    $stmt = $this->conn->prepare($query);
    $stmt->bindValue(':id',$this->session);
    $stmt->execute();
    return $stmt->fetch(PDO::FETCH_ASSOC);
  }
  function infoaffiliate($id){
    $query ="select * from affiliates where id=:id";
    $stmt = $this->conn->prepare($query);
    $stmt->bindValue(':id',$id);
    $stmt->execute();
    return $stmt->fetch(PDO::FETCH_ASSOC);
  }

  function checkCoupon($coupon,$id){
    $query ="select * from affiliates where coupon_code=:coupon_code and id!='".$id."'";
    $stmt = $this->conn->prepare($query);
    $stmt->bindValue(':coupon_code',$coupon);
    $stmt->execute();
    return $stmt->rowCount();
  }


  function RegisterAffiliate($arg){
      $this->conn->query("SET SESSION sql_mode=''");
	    $merchant = $this->merchant;
      $settings = $this->DefaultaffPercentage($merchant['id']);

  	  $query ="INSERT INTO affiliates
  		    SET
  		      role=:role,
		        id_merchant=:id_merchant,
            id_hash=:id_hash,
      			email=:email,
      			password=:password,
      			first_name=:first_name,
      			last_name=:last_name,
      			status=:status,
            type_com=:type_com,
            com_percent=:com_percent,
            cookie_duration=:cookie_duration,
            flat_rate=:flat_rate,
            coupon_code=:coupon_code,
  		      dateadded=:dateadded";
  	  $stmt = $this->conn->prepare($query);
  		$stmt->bindValue(':role','as_affiliate');
  		$stmt->bindValue(':id_merchant',$merchant['id']);
  		$stmt->bindValue(':id_hash',uniqueHash(32));
  		$stmt->bindValue(':email',$arg['email']);
  		$stmt->bindValue(':password',csrf_token($arg['password']));
  		$stmt->bindValue(':first_name',$arg['first_name']);
  		$stmt->bindValue(':last_name',$arg['last_name']);
  		$stmt->bindValue(':status','is_active');
      $stmt->bindValue(':type_com',$settings['commission_type']);
      $stmt->bindValue(':com_percent',$settings['commission_percent']);
      $stmt->bindValue(':cookie_duration',$settings['cookie_duration']);
      $stmt->bindValue(':flat_rate','3');
      $stmt->bindValue(':coupon_code','');
  		$stmt->bindValue(':dateadded',date('Y-m-d'));

  	  if($stmt->execute()){
  		    return 1;
      	}else{
      		return 0;
  		}
	}

	function UpdateAffiliateInfo($arg){
		$query ="UPDATE affiliates
    		SET
    			first_name=:first_name,
    			last_name=:last_name,
    			merchant_notes=:merchant_notes,
          min_payment=:min_payment,
          type_com=:type_com,
          com_percent=:com_percent,
          cookie_duration=:cookie_duration,
          flat_rate=:flat_rate,
          coupon_code=:coupon_code,
          type_discount=:type_discount,
          discount_description=:discount_description
    			WHERE id=:id";
    	$stmt = $this->conn->prepare($query);
  		$stmt->bindValue(':id',$arg['id']);
  		$stmt->bindValue(':first_name',$arg['first_name']);
  		$stmt->bindValue(':last_name',$arg['last_name']);
  		$stmt->bindValue(':merchant_notes',$arg['merchant_notes']);
      $stmt->bindValue(':min_payment',$arg['min_payment']);
      $stmt->bindValue(':type_com',$arg['type_com']);
      $stmt->bindValue(':com_percent',$arg['com_percent']);
      $stmt->bindValue(':cookie_duration',$arg['cookie_duration']);
      $stmt->bindValue(':flat_rate',$arg['flat_rate']);
      $stmt->bindValue(':coupon_code',$arg['coupon_code']);
      $stmt->bindValue(':type_discount',$arg['type_discount']);
      $stmt->bindValue(':discount_description',$arg['discount_description']);
    	if($stmt->execute()){
    		return 1;
    	}else{
    		return 0;
		  }
	}


  function AffiliateStatusConfig($id,$status){
      if($status=='is_deleted'){
        $query ="UPDATE affiliates
            SET
            status=:status,
            is_deleted=:is_deleted,
            deleted_date=:deleted_date
            WHERE id=:id and id_merchant=:id_merchant";
          $stmt = $this->conn->prepare($query);
          $stmt->bindValue(':id',$id);
          $stmt->bindValue(':id_merchant',$this->session);
          $stmt->bindValue(':is_deleted','1');
          $stmt->bindValue(':deleted_date',date('Y-m-d'));
          $stmt->bindValue(':status',$status);
      }else{
        $query ="UPDATE affiliates
            SET
            status=:status,
            is_deleted=:is_deleted,
            deleted_date=:deleted_date
            WHERE id=:id and id_merchant=:id_merchant";
          $stmt = $this->conn->prepare($query);
          $stmt->bindValue(':id',$id);
          $stmt->bindValue(':id_merchant',$this->session);
          $stmt->bindValue(':is_deleted','0');
          $stmt->bindValue(':deleted_date','0000-00-00');
          $stmt->bindValue(':status',$status);
      }
      if($stmt->execute()){return 1;}else{return 0;}

  }

   /* Affiliate Add Sum Payment
   ---------------------------------------------------------------*/

	function AddSumAffiliate($arg){
		$this->conn->query("SET SESSION sql_mode=''");
		$merchant = $this->merchant;
    	$query ="INSERT INTO affiliates_payhistory
    		SET
			id_merchant=:id_merchant,
            id_affiliate=:id_affiliate,
			paid_sum=:paid_sum,
			payment_date=:payment_date,
			comments=:comments,
			admin_comments=:admin_comments,
    		dateadded=:dateadded";
    	$stmt = $this->conn->prepare($query);
		$stmt->bindValue(':id_merchant',$merchant['id']);
		$stmt->bindValue(':id_affiliate',$arg['id']);
		$stmt->bindValue(':paid_sum',$arg['paid_sum']);
		$stmt->bindValue(':payment_date',$arg['payment_date']);
		$stmt->bindValue(':comments',$arg['comments']);
		$stmt->bindValue(':admin_comments',$arg['admin_comments']);
		$stmt->bindValue(':dateadded',date('Y-m-d'));

    	if($stmt->execute()){
    		return 1;
    	}else{
    		return 0;
		}
	}


}
$form = new Controller();
