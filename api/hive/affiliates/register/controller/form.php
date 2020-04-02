<?php
class Controller extends Database{

    public function __construct(){
    $this->conn 		 	       = $this->getConnection();
		$this->session        	 = $this->SessionHandler();
	}




  /* --------- Check Email --------------------------------------*/
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



	function checkMerchantID($hash_id){
		$query ="select * from merchant where hash_id=:hash_id";
		$stmt = $this->conn->prepare($query);
		$stmt->bindValue(':hash_id',$hash_id);
		$stmt->execute();
		if($stmt->rowCount()==0){return 0;}
		$row = $stmt->fetch(PDO::FETCH_ASSOC);
		return $row['id'];
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
             'commission_percent' => $row['commission_percent'],
             'cookie_duration' => $row['cookie_duration'],
           );
        }

  }

    function getmerchantdetails($id){
      $query ="select * from merchant where hash_id=:id";
      $stmt = $this->conn->prepare($query);
      $stmt->bindValue(':id',$id);
      $stmt->execute();
      if($stmt->rowCount()==0){return 0;}
      $row = $stmt->fetch(PDO::FETCH_ASSOC);
      return $row;
    }

    function RegisterAffiliates($arg){

      if($this->checkMerchantID($arg['id_merchant'])==0){
		       return 'invalid_merchant';
	    }

  		$this->conn->query("SET SESSION sql_mode=''");
      $settings = $this->DefaultaffPercentage($this->checkMerchantID($arg['id_merchant']));

      	$query ="INSERT INTO affiliates
      		SET
  			     id_merchant=:id_merchant,
      		   role=:role,
  			     status=:status,
  			     first_name=:first_name,
  			     last_name=:last_name,
             email=:email,
  			     password=:password,
  			     id_hash=:id_hash,
             com_percent=:com_percent,
             cookie_duration=:cookie_duration,
      		   dateadded=:dateadded";
  		$stmt = $this->conn->prepare($query);
  		$stmt->bindValue(':id_merchant',$this->checkMerchantID($arg['id_merchant']));
  		$stmt->bindValue(':role','as_affiliate');
  		$stmt->bindValue(':status','is_pending');
  		$stmt->bindValue(':first_name',$arg['first_name']);
  		$stmt->bindValue(':last_name',$arg['last_name']);
  		$stmt->bindValue(':email',$arg['email']);
  		$stmt->bindValue(':password',csrf_token($arg['password']));
  		$stmt->bindValue(':id_hash',uniqueHash(32));
      $stmt->bindValue(':com_percent',$settings['commission_percent']);
      $stmt->bindValue(':cookie_duration',$settings['cookie_duration']);
  		$stmt->bindValue(':dateadded',date('Y-m-d'));

    	if($stmt->execute()){
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
		return $stmt->rowCount();
	}

}
$form = new Controller();
