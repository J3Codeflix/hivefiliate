<?php
class Controller extends Database{

    public function __construct(){
        $this->conn 		 	 = $this->getConnection();
		$this->session        	 = $this->MerchantSessionHandler();
		$this->merchant          = $this->MerchantData();
	}


	/* ---------Settings General-------------- */

	function ispresent(){
		$query="select * from settings_general WHERE id_merchant=:id_merchant";
		$stmt = $this->conn->prepare( $query );
		$stmt->bindValue(':id_merchant',$this->session);
		$stmt->execute();
		return $stmt->rowCount();
	}


	function SaveSettingsGeneral($arg){

		$this->conn->query("SET SESSION sql_mode=''");

		if($this->ispresent()>0){

			$query ="UPDATE  settings_general
				SET
				terms=:terms,
				is_send=:is_send,
				auto_approved=:auto_approved,
				site_address=:site_address
				WHERE id_merchant=:id_merchant";
			$stmt = $this->conn->prepare($query);
			$stmt->bindValue(':id_merchant',$this->session);
			$stmt->bindValue(':terms',$arg['terms']);
			$stmt->bindValue(':is_send',boleanstring($arg['is_send']));
			$stmt->bindValue(':auto_approved',boleanstring($arg['auto_approved']));
			$stmt->bindValue(':site_address',$arg['site_address']);
			if($stmt->execute()){return 1;}else{return 0;}

		}

		$query ="INSERT INTO  settings_general
			SET
			id_merchant=:id_merchant,
			terms=:terms,
			is_send=:is_send,
			auto_approved=:auto_approved,
			site_address=:site_address,
			dateadded=:dateadded";
		$stmt = $this->conn->prepare($query);
		$stmt->bindValue(':id_merchant',$this->session);
		$stmt->bindValue(':terms',$arg['terms']);
		$stmt->bindValue(':is_send',boleanstring($arg['is_send']));
		$stmt->bindValue(':auto_approved',boleanstring($arg['auto_approved']));
		$stmt->bindValue(':site_address',$arg['site_address']);
		$stmt->bindValue(':dateadded',date('Y-m-d'));
		if($stmt->execute()){return 1;}else{return 0;}

	}


	function SettingsGeneralInfo(){
		$query="select * from settings_general WHERE id_merchant=:id_merchant";
		$stmt = $this->conn->prepare( $query );
		$stmt->bindValue(':id_merchant',$this->session);
		$stmt->execute();
		if($stmt->rowCount()==0){return 0;}
		$row = $stmt->fetch(PDO::FETCH_ASSOC);
		return array(
			'terms' 		    => $row['terms'],
			'is_send' 		  => $row['is_send'],
			'auto_approved' => $row['auto_approved'],
			'site_address' 	=> $row['site_address'],
      'site_type' 	  => $row['site_type'],
		);
	}



	/*----------------- Settings Tracking------------------- */

	function ispresent_tracking(){
		$query="select * from settings_tracking WHERE id_merchant=:id_merchant";
		$stmt = $this->conn->prepare( $query );
		$stmt->bindValue(':id_merchant',$this->session);
		$stmt->execute();
		return $stmt->rowCount();
	}


  function updateCookieall($duration){
    $query ="UPDATE  affiliates
      SET
      cookie_duration=:cookie_duration
      WHERE id_merchant=:id_merchant";
    $stmt = $this->conn->prepare($query);
    $stmt->bindValue(':id_merchant',$this->session);
    $stmt->bindValue(':cookie_duration',$duration);
    if($stmt->execute()){return 1;}else{return 0;}
  }
  function updateRate($type_com,$flat_rate,$com_percent){
    $query ="UPDATE  affiliates
      SET
      type_com=:type_com,
      flat_rate=:flat_rate,
      com_percent=:com_percent
      WHERE id_merchant=:id_merchant";
    $stmt = $this->conn->prepare($query);
    $stmt->bindValue(':id_merchant',$this->session);
    $stmt->bindValue(':type_com',$type_com);
    $stmt->bindValue(':flat_rate',$flat_rate);
    $stmt->bindValue(':com_percent',$com_percent);
    if($stmt->execute()){return 1;}else{return 0;}
  }
  function UpdateCouponCode($coupon){
    $query ="UPDATE  affiliates
      SET
      coupon_code=:coupon_code
      WHERE id_merchant=:id_merchant";
    $stmt = $this->conn->prepare($query);
    $stmt->bindValue(':id_merchant',$this->session);
    $stmt->bindValue(':coupon_code',$coupon);
    if($stmt->execute()){return 1;}else{return 0;}
  }


	function SaveSettingsTracking($arg){

		$this->conn->query("SET SESSION sql_mode=''");

		if($this->ispresent_tracking()>0){

			$query ="UPDATE  settings_tracking
				SET
				cookie_duration=:cookie_duration,
				commission_type=:commission_type,
				commission_percent=:commission_percent,
        flat_rate=:flat_rate,
        typecom_update=:typecom_update,
        cookie_update=:cookie_update,
        coupon_code=:coupon_code,
        coupon_update=:coupon_update
				WHERE id_merchant=:id_merchant";
			$stmt = $this->conn->prepare($query);
			$stmt->bindValue(':id_merchant',$this->session);
			$stmt->bindValue(':cookie_duration',$arg['cookie_duration']);
			$stmt->bindValue(':commission_type',$arg['commission_type']);
			$stmt->bindValue(':commission_percent',$arg['commission_percent']);
      $stmt->bindValue(':flat_rate',$arg['flat_rate']);
      $stmt->bindValue(':typecom_update',$arg['typecom_update']);
      $stmt->bindValue(':cookie_update',$arg['cookie_update']);
      $stmt->bindValue(':coupon_code',$arg['coupon_code']);
      $stmt->bindValue(':coupon_update',$arg['coupon_update']);
			if($stmt->execute()){
        if($arg['cookie_update']=='1'){$this->updateCookieall($arg['cookie_duration']);}
        if($arg['typecom_update']=='1'){$this->updateRate($arg['commission_type'],$arg['flat_rate'],$arg['commission_percent']);}
        //if($arg['coupon_update']=='1'){$this->UpdateCouponCode($arg['coupon_code']);}
        return 1;
      }else{return 0;}
		}

		$query ="INSERT INTO  settings_tracking
			SET
			id_merchant=:id_merchant,
			cookie_duration=:cookie_duration,
			commission_type=:commission_type,
			commission_percent=:commission_percent,
      flat_rate=:flat_rate,
      typecom_update=:typecom_update,
      cookie_update=:cookie_update,
      coupon_code=:coupon_code,
      coupon_update=:coupon_update,
			dateadded=:dateadded";
		$stmt = $this->conn->prepare($query);
		$stmt->bindValue(':id_merchant',$this->session);
		$stmt->bindValue(':cookie_duration',$arg['cookie_duration']);
		$stmt->bindValue(':commission_type',$arg['commission_type']);
		$stmt->bindValue(':commission_percent',$arg['commission_percent']);
    $stmt->bindValue(':flat_rate',$arg['flat_rate']);
    $stmt->bindValue(':typecom_update',$arg['typecom_update']);
    $stmt->bindValue(':cookie_update',$arg['cookie_update']);
    $stmt->bindValue(':coupon_code',$arg['coupon_code']);
    $stmt->bindValue(':coupon_update',$arg['coupon_update']);
		$stmt->bindValue(':dateadded',date('Y-m-d'));
		if($stmt->execute()){
      if($arg['cookie_update']=='1'){$this->updateCookieall($arg['cookie_duration']);}
      if($arg['typecom_update']=='1'){$this->updateRate($arg['commission_type'],$arg['flat_rate'],$arg['commission_percent']);}
      //if($arg['coupon_update']=='1'){$this->UpdateCouponCode($arg['coupon_code']);}
      return 1;}else{return 0;}

	}


	function SettingsTrackingInfo(){
		$query="select * from settings_tracking WHERE id_merchant=:id_merchant";
		$stmt = $this->conn->prepare( $query );
		$stmt->bindValue(':id_merchant',$this->session);
		$stmt->execute();
		if($stmt->rowCount()==0){return 0;}
		$row = $stmt->fetch(PDO::FETCH_ASSOC);
		return $row;
	}


	/*----------------- Settings Payment------------------- */

	function ispresent_payment(){
		$query="select * from settings_payment WHERE id_merchant=:id_merchant";
		$stmt = $this->conn->prepare( $query );
		$stmt->bindValue(':id_merchant',$this->session);
		$stmt->execute();
		return $stmt->rowCount();
	}



  function updateminpayment($amount){
    $query ="UPDATE  affiliates
      SET
      min_payment=:min_payment
      WHERE id_merchant=:id_merchant and status='is_active' and is_deleted=0";
    $stmt = $this->conn->prepare($query);
    $stmt->bindValue(':id_merchant',$this->session);
    $stmt->bindValue(':min_payment',$amount);
    if($stmt->execute()){return 1;}else{return 0;}
  }
	function SaveSettingsPayment($arg){

		$this->conn->query("SET SESSION sql_mode=''");

		if($this->ispresent_payment()>0){

			$query ="UPDATE  settings_payment
				SET
				min_payment=:min_payment
				WHERE id_merchant=:id_merchant";
			$stmt = $this->conn->prepare($query);
			$stmt->bindValue(':id_merchant',$this->session);
			$stmt->bindValue(':min_payment',$arg['min_payment']);
			if($stmt->execute()){
        if($arg['is_update']=='1'||$arg['is_update']=='true'){$this->updateminpayment($arg['min_payment']);}
        return 1;
      }else{return 0;}

		}

		$query ="INSERT INTO  settings_payment
			SET
			id_merchant=:id_merchant,
			min_payment=:min_payment,
			dateadded=:dateadded";
		$stmt = $this->conn->prepare($query);
		$stmt->bindValue(':id_merchant',$this->session);
		$stmt->bindValue(':min_payment',$arg['min_payment']);
		$stmt->bindValue(':dateadded',date('Y-m-d'));
		if($stmt->execute()){
      if($arg['is_update']=='1'||$arg['is_update']=='true'){$this->updateminpayment($arg['min_payment']);}
      return 1;
    }else{return 0;}

	}


	function SettingsPaymentInfo(){
		$query="select * from settings_payment WHERE id_merchant=:id_merchant";
		$stmt = $this->conn->prepare( $query );
		$stmt->bindValue(':id_merchant',$this->session);
		$stmt->execute();
		if($stmt->rowCount()==0){return 0;}
		$row = $stmt->fetch(PDO::FETCH_ASSOC);
		return array(
			'min_payment' 		=> $row['min_payment'],
		);
	}




}
$form = new Controller();
