<?php
class Controller extends Database{

    public function __construct(){
        $this->conn 		 	 = $this->getConnection();
		    $this->session        	 = $this->MerchantSessionHandler();
		    $this->merchant          = $this->MerchantData();
        $this->sessionstaff      = $this->StaffSessionHandler();
	}


	function CheckOldPassword($old,$email){
		$query="select * from merchant WHERE email=:email";
		$stmt = $this->conn->prepare( $query );
		$stmt->bindValue(':email',$email);
		$stmt->execute();
		$row = $stmt->fetch(PDO::FETCH_ASSOC);
		if($stmt->rowCount()==0){ return 0; exit;}
		if (crypt($old, extend_token().$row['password']) == extend_token().$row['password']) {
			return 1;
		}else{
			return 0;
		}
	}

  function checkstoreupdate($store,$id){
    $store_id = preg_replace('/\s+/', '', $store);
    $store_id = strtolower($store_id);
    $query ="select * from merchant where store_id=:store_id and id!='".$id."'";
    $stmt = $this->conn->prepare($query);
    $stmt->bindValue(':store_id',$store_id);
    $stmt->execute();
    return $stmt->rowCount();
  }
  function storeid($store_name){
    $store_id = preg_replace('/\s+/', '', $store_name);
    $store_id = strtolower($store_id);
    return $store_id;
  }


	function UpdateAccount($arg){

		$this->conn->query("SET SESSION sql_mode=''");

		if(empty($arg['new_password'])){

			$query ="UPDATE merchant
				SET
				store_name=:store_name
				WHERE id=:id";
			$stmt = $this->conn->prepare($query);
			$stmt->bindValue(':id',$arg['id']);
			$stmt->bindValue(':store_name',$arg['store_name']);
			if($stmt->execute()){return 1;}else{return 0;}

		}else{

			$query ="UPDATE merchant
				SET
				store_name=:store_name,
				password=:password,
				WHERE id=:id";
			$stmt = $this->conn->prepare($query);
			$stmt->bindValue(':id',$arg['id']);
			$stmt->bindValue(':store_name',$arg['store_name']);
			$stmt->bindValue(':password',csrf_token($arg['new_password']));
			if($stmt->execute()){session_destroy();return 1;}else{return 0;}
		}
	}


  function UpdateAccountStaff($arg){
    if(empty($arg['password'])){
        $query ="UPDATE staff
          SET
          first_name=:first_name,
          last_name=:last_name
          WHERE id=:id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindValue(':id',$this->sessionstaff);
        $stmt->bindValue(':first_name',$arg['first_name']);
        $stmt->bindValue(':last_name',$arg['last_name']);
        if($stmt->execute()){return 1;}else{return 0;}
    }else{
        $query ="UPDATE staff
          SET
          first_name=:first_name,
          last_name=:last_name,
          password=:password
          WHERE id=:id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindValue(':id',$this->sessionstaff);
        $stmt->bindValue(':first_name',$arg['first_name']);
        $stmt->bindValue(':last_name',$arg['last_name']);
        $stmt->bindValue(':password',csrf_token($arg['password']));
        if($stmt->execute()){session_destroy();return 1;}else{return 0;}
    }
  }

  function PaypalCheckSettings(){
    $query="select * from adminsett_paypalapi limit 1";
		$stmt = $this->conn->prepare( $query );
		$stmt->execute();
    if($stmt->rowCount()==0){return 0;}
    $row = $stmt->fetch(PDO::FETCH_ASSOC);
    if($row['is_live']==''||$row['is_live']=='false'){return 0;}
    return array(
      'is_live'  => $row['is_live'],
      'paypal_clientid'   => $row['paypal_clientid']
    );
  }


}
$form = new Controller();
