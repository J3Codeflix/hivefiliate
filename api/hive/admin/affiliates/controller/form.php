<?php
class Controller extends Database{

  public function __construct(){
      $this->conn 		 	        = $this->getConnection();
      $this->session            = $this->AdminSessionHandler();
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
		$query ="select * from admin_users where email=:email";
		$stmt = $this->conn->prepare($query);
		$stmt->bindValue(':email',$email);
		$stmt->execute();
		return $stmt->rowCount();
	}



	function checkingEmailFunction($email){
		if($this->checkemailmerchant($email)>0||$this->checkaffiliatesemail($email)>0||$this->checkstaffemail($email)>0||$this->checkadminemail($email)>0){
			return 1;
		}
		return 0;
	}

  function infomerchant($id){
    $query ="select store_name,hash_id,email from merchant where id=:id";
    $stmt = $this->conn->prepare($query);
    $stmt->bindValue(':id',$id);
    $stmt->execute();
    return $stmt->fetch(PDO::FETCH_ASSOC);
  }

  function defaultsettings(){
      $query ="select * from admin_settings order by id desc limit 1";
      $stmt = $this->conn->prepare($query);
      $stmt->execute();
      if($stmt->rowCount()==0){
        return array(
          'commission_percent' => 3,
          'cookie_duration' => 7,
        );
      }
      $row = $stmt->fetch(PDO::FETCH_ASSOC);
      return array(
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
           'commission_percent' => $row['commission_percent'],
           'cookie_duration' => $row['cookie_duration'],
         );
      }

  }


	function insertAffiliate($arg){
  	  $this->conn->query("SET SESSION sql_mode=''");
      $settings = $this->DefaultaffPercentage($arg['id_merchant']);
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
            com_percent=:com_percent,
            cookie_duration=:cookie_duration,
  		      dateadded=:dateadded";
  	  $stmt = $this->conn->prepare($query);
  		$stmt->bindValue(':role','as_affiliate');
  		$stmt->bindValue(':id_merchant',$arg['id_merchant']);
  		$stmt->bindValue(':id_hash',uniqueHash(32));
  		$stmt->bindValue(':email',$arg['email']);
  		$stmt->bindValue(':password',csrf_token($arg['password']));
  		$stmt->bindValue(':first_name',$arg['first_name']);
  		$stmt->bindValue(':last_name',$arg['last_name']);
  		$stmt->bindValue(':status','is_active');
      $stmt->bindValue(':com_percent',$settings['commission_percent']);
      $stmt->bindValue(':cookie_duration',$settings['cookie_duration']);
  		$stmt->bindValue(':dateadded',date('Y-m-d'));
  		if($stmt->execute()){return 1;}else{return 0;}
	}

  function updateAffiliate($arg){
  	  $this->conn->query("SET SESSION sql_mode=''");
      if(!empty($arg['password'])){
        $query ="UPDATE affiliates
    		    SET
  		        id_merchant=:id_merchant,
        			password=:password,
        			first_name=:first_name,
        			last_name=:last_name
              WHERE id=:id";
    	  $stmt = $this->conn->prepare($query);
    		$stmt->bindValue(':id',$arg['id']);
        $stmt->bindValue(':id_merchant',$arg['id_merchant']);
        $stmt->bindValue(':password',csrf_token($arg['password']));
        $stmt->bindValue(':first_name',$arg['first_name']);
        $stmt->bindValue(':last_name',$arg['last_name']);
    		if($stmt->execute()){return 1;}else{return 0;}
      }else{
        $query ="UPDATE affiliates
    		    SET
  		        id_merchant=:id_merchant,
        			first_name=:first_name,
        			last_name=:last_name
              WHERE id=:id";
    	  $stmt = $this->conn->prepare($query);
    		$stmt->bindValue(':id',$arg['id']);
        $stmt->bindValue(':id_merchant',$arg['id_merchant']);
        $stmt->bindValue(':first_name',$arg['first_name']);
        $stmt->bindValue(':last_name',$arg['last_name']);
    		if($stmt->execute()){return 1;}else{return 0;}
      }

	}



}
$form = new Controller();
