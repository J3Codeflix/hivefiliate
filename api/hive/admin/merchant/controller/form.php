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

  function defaultSettings($id){
      $this->conn->query("SET SESSION sql_mode=''");
      $query ="INSERT INTO settings_tracking
          SET
            id_merchant=:id_merchant,
            cookie_duration=:cookie_duration,
            commission_type=:commission_type,
            commission_percent=:commission_percent,
            flat_rate=:flat_rate,
            dateadded=:dateadded";
      $stmt = $this->conn->prepare($query);
      $stmt->bindValue(':id_merchant',$id);
      $stmt->bindValue(':cookie_duration','7');
      $stmt->bindValue(':commission_type','1');
      $stmt->bindValue(':commission_percent','3');
      $stmt->bindValue(':flat_rate','3');
      $stmt->bindValue(':dateadded',date('Y-m-d'));
      $stmt->execute();
  }



  function checkstore($store){
    $store_id = preg_replace('/\s+/', '', $store);
    $store_id = strtolower($store_id);
    $query ="select * from merchant where store_id=:store_id";
    $stmt = $this->conn->prepare($query);
    $stmt->bindValue(':store_id',$store_id);
    $stmt->execute();
    return $stmt->rowCount();
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


	function insertStore($arg){
	  $this->conn->query("SET SESSION sql_mode=''");
    $date = date('Y-m-d');
    $store_id = $this->storeid($arg['store_name']);
    $query ="INSERT INTO merchant
    		SET
    		  role=:role,
          email=:email,
			    password=:password,
			    store_name=:store_name,
          store_id=:store_id,
          description=:description,
			    hash_id=:hash_id,
          hash_text=:hash_text,
          hash_staff=:hash_staff,
			    date_expiration=:date_expiration,
    		  dateadded=:dateadded";
    $stmt = $this->conn->prepare($query);
		$stmt->bindValue(':role','as_merchant');
		$stmt->bindValue(':email',$arg['email']);
		$stmt->bindValue(':password',csrf_token($arg['password']));
		$stmt->bindValue(':store_name',$arg['store_name']);
    $stmt->bindValue(':store_id',$store_id);
    $stmt->bindValue(':description',$arg['description']);
		$stmt->bindValue(':hash_id',$store_id);
    $stmt->bindValue(':hash_text',uniqueHash(32));
    $stmt->bindValue(':hash_staff',$store_id);
		$stmt->bindValue(':date_expiration',date('Y-m-d', strtotime($date. ' + 14 days')));
		$stmt->bindValue(':dateadded',date('Y-m-d'));
		if($stmt->execute()){
      $this->defaultSettings($this->conn->lastInsertId());
      return 1;
    }else{return 0;}
	}

  function updateStore($arg){
      $this->conn->query("SET SESSION sql_mode=''");
      $store_id = $this->storeid($arg['store_name']);
      if(empty($arg['empty'])){

          $query ="UPDATE merchant
              SET
                store_name=:store_name,
                store_id=:store_id,
                hash_id=:hash_id,
                hash_staff=:hash_staff,
                description=:description
                WHERE id=:id";
          $stmt = $this->conn->prepare($query);
          $stmt->bindValue(':id',$arg['id']);
          $stmt->bindValue(':store_name',$arg['store_name']);
          $stmt->bindValue(':store_id',$store_id);
          $stmt->bindValue(':hash_id',$store_id);
          $stmt->bindValue(':hash_staff',$store_id);
          $stmt->bindValue(':description',$arg['description']);
          if($stmt->execute()){return 1;}else{return 0;}

      }else{

          $query ="UPDATE merchant
              SET
                password=:password,
                store_name=:store_name,
                store_id=:store_id,
                hash_id=:hash_id,
                hash_staff=:hash_staff,
                description=:description
                WHERE id=:id";
          $stmt = $this->conn->prepare($query);
          $stmt->bindValue(':id',$arg['id']);
          $stmt->bindValue(':password',csrf_token($arg['password']));
          $stmt->bindValue(':store_name',$arg['store_name']);
          $stmt->bindValue(':store_id',$store_id);
          $stmt->bindValue(':hash_id',$store_id);
          $stmt->bindValue(':hash_staff',$store_id);
          $stmt->bindValue(':description',$arg['description']);
          if($stmt->execute()){return 1;}else{return 0;}

      }

  }




}
$form = new Controller();
