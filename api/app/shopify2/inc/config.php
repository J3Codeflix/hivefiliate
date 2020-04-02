<?php
require '/home/hiveelia/public_html/api/hive/config/session.php';
require '/home/hiveelia/public_html/api/hive/config/database.php';
class Controller extends Database{

  public function __construct(){
      $this->conn       = $this->getConnection();
      $this->session    = $this->MerchantSessionHandler();
	}

  function checkexistapp($tokenapi,$paramshop){
    $query ="select * from integration_app WHERE token_id=:token_id and app_name=:app_name";
    $stmt = $this->conn->prepare($query);
    $stmt->bindValue(':token_id',$tokenapi);
    $stmt->bindValue(':app_name',$paramshop);
    $stmt->execute();
    return $stmt->rowCount();
  }

  /* Saving shopify */
	function SaveInstallApi($app_id,$tokenapi,$paramshop,$hmac,$code){
      if($this->checkexistapp($tokenapi,$paramshop)>0){return '';}
        $this->conn->query("SET SESSION sql_mode=''");
  			$query ="INSERT INTO integration_app
  							SET
  							app_id=:app_id,
  							token_id=:token_id,
  							app_name=:app_name,
                code=:code,
                hmac=:hmac,
                dateadded=:dateadded";
  			$stmt = $this->conn->prepare($query);
  			$stmt->bindValue(':app_id',$app_id);
  			$stmt->bindValue(':token_id',$tokenapi);
  			$stmt->bindValue(':app_name',$paramshop);
        $stmt->bindValue(':code',$code);
        $stmt->bindValue(':hmac',$hmac);
        $stmt->bindValue(':dateadded',date('Y-m-d'));
  			if($stmt->execute()){
  					return 1;
  			}else{
  					return 0;
  			}
	}


  /* Check Installed Shopify */
  function checkAuthorizationID($token_id,$shop){
    $query ="select * from integration_app WHERE token_id=:token_id and app_name=:app_name";
    $stmt = $this->conn->prepare($query);
    $stmt->bindValue(':token_id',$token_id);
    $stmt->bindValue(':app_name',$shop);
    $stmt->execute();
    return $stmt->rowCount();
  }

  /* Get Access Token */
  function AccessToken($shop){
    $query ="select * from integration_app WHERE app_name=:app_name limit 1";
    $stmt = $this->conn->prepare($query);
    $stmt->bindValue(':app_name',$shop);
    $stmt->execute();
    if($stmt->rowCount()==0){
      return 0;
    }else{
      $row = $stmt->fetch(PDO::FETCH_ASSOC);
      return $row['token_id'];
    }
  }




  /*--------------------------------------
   Webhook Enpoint ----------------------*/
   function removesiteaddress($shop_domain){
     $query ="DELETE FROM settings_general WHERE site_address=:site_address";
     $stmt = $this->conn->prepare($query);
     $stmt->bindValue(':site_address','https://'.$shop_domain);
     if($stmt->execute()){return 1;}else{return 0;}
   }

  function shopEraseWebhook($shop_domain){
    $this->removesiteaddress($shop_domain);
    $query ="DELETE FROM integration_app WHERE app_name=:app_name";
    $stmt = $this->conn->prepare($query);
    $stmt->bindValue(':app_name',$shop_domain);
    if($stmt->execute()){return 1;}else{return 0;}
  }

  /*--------------------------------------
   Check Store -------------------------*/
  function shopwebsiteurl($shop){
    $query ="select * from integration_app WHERE app_name=:app_name limit 1";
    $stmt = $this->conn->prepare($query);
    $stmt->bindValue(':app_name',$shop);
    $stmt->execute();
    return $stmt->rowCount();
  }




}
$app = new Controller();
