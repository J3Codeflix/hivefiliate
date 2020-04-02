<?php
class Controller extends Database{

    public function __construct(){
        $this->conn 		 	 = $this->getConnection();
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
      $query ="select * from admin_users where email=:email";
      $stmt = $this->conn->prepare($query);
      $stmt->bindValue(':email',$email);
      $stmt->execute();
      return $stmt->rowCount();
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

    function checkingEmailFunction($email){
      if($this->checkemailmerchant($email)>0||$this->checkaffiliatesemail($email)>0||$this->checkstaffemail($email)>0||$this->checkadminemail($email)>0){
        return 1;
      }
      return 0;
    }


    function ShopifySetup($arg){
      $query ="select * from integration_app WHERE app_name=:app_name and code=:code and hmac=:hmac and id_merchant=0";
      $stmt = $this->conn->prepare($query);
      $stmt->bindValue(':app_name',$arg['shop']);
      $stmt->bindValue(':code',$arg['code']);
      $stmt->bindValue(':hmac',$arg['hmac']);
      $stmt->execute();
      return $stmt->rowCount();
    }



    /* Insert Regisration to the database */

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

    function defaultminpayment($id){
        $this->conn->query("SET SESSION sql_mode=''");
        $query ="INSERT INTO settings_payment
            SET
              id_merchant=:id_merchant,
              min_payment=:min_payment,
              dateadded=:dateadded";
        $stmt = $this->conn->prepare($query);
        $stmt->bindValue(':id_merchant',$id);
        $stmt->bindValue(':min_payment','10');
        $stmt->bindValue(':dateadded',date('Y-m-d'));
        $stmt->execute();
    }

    function updatesiteaddress($paramshop,$id){
        $query ="INSERT INTO settings_general
                SET
                site_address=:site_address,
                site_type=:site_type,
                id_merchant=:id_merchant,
                dateadded=:dateadded";
        $stmt = $this->conn->prepare($query);
        $stmt->bindValue(':id_merchant',$id);
        $stmt->bindValue(':site_address','https://'.$paramshop);
        $stmt->bindValue(':site_type','1');
        $stmt->bindValue(':dateadded',date('Y-m-d'));
        if($stmt->execute()){return 1;}else{return 0;}
    }


    function updatestore($id,$code,$hmac,$shop){
      $this->conn->query("SET SESSION sql_mode=''");
      $query ="UPDATE integration_app
          SET
            id_merchant=:id_merchant
            WHERE app_name=:app_name and code=:code and hmac=:hmac";
      $stmt = $this->conn->prepare($query);
      $stmt->bindValue(':app_name',$shop);
      $stmt->bindValue(':code',$code);
      $stmt->bindValue(':hmac',$hmac);
      $stmt->bindValue(':id_merchant',$id);
      $stmt->execute();
    }


    function RegisteredMerchant($arg){
  		$this->conn->query("SET SESSION sql_mode=''");
  		$date = date('Y-m-d');

      $store_id = preg_replace('/\s+/', '', $arg['store_name']);
      $store_id = strtolower($store_id);



      $hashstore = uniqueHash(5);


      $query ="INSERT INTO merchant
      		SET
      		  role=:role,
            email=:email,
  			    password=:password,
  			    store_name=:store_name,
            store_id=:store_id,
  			    hash_id=:hash_id,
            hash_text=:hash_text,
            hash_staff=:hash_staff,
  			    date_expiration=:date_expiration,
            type_platform=:type_platform,
            website_url=:website_url,
      		  dateadded=:dateadded";
      $stmt = $this->conn->prepare($query);
  		$stmt->bindValue(':role','as_merchant');
  		$stmt->bindValue(':email',$arg['email']);
  		$stmt->bindValue(':password',csrf_token($arg['password']));
  		$stmt->bindValue(':store_name',$arg['store_name']);
      $stmt->bindValue(':store_id',$hashstore);
  		$stmt->bindValue(':hash_id',$hashstore);
      $stmt->bindValue(':hash_text',uniqueHash(32));
      $stmt->bindValue(':hash_staff',$hashstore);
  		$stmt->bindValue(':date_expiration',date('Y-m-d', strtotime($date. ' + 14 days')));
      $stmt->bindValue(':type_platform','shopify');
      $stmt->bindValue(':website_url',$arg['shop']);
  		$stmt->bindValue(':dateadded',date('Y-m-d'));

    	if($stmt->execute()){
           $id = $this->conn->lastInsertId();
           $this->defaultSettings($id);
           $this->defaultminpayment($id);
           $this->updatestore($id,$arg['code'],$arg['hmac'],$arg['shop']);
           $this->updatesiteaddress($arg['shop'],$id);
			     SetSessionHandler($id);
    		   return 1;
    	}else{
    		   return 0;
		  }
  }


}
$shopify = new Controller();
