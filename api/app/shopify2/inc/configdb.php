<?php
require '/home/hiveelia/public_html/api/hive/config/session.php';
require '/home/hiveelia/public_html/api/hive/config/database.php';
class Controller extends Database{

  public function __construct(){
      $this->conn       = $this->getConnection();
      $this->session    = $this->MerchantSessionHandler();
	}

  function ismerchantlogin(){
    $query ="select * from merchant WHERE id=:id";
    $stmt = $this->conn->prepare($query);
    $stmt->bindValue(':id',$this->session);
    $stmt->execute();
    return $stmt->rowCount();
  }

	function checkInstallapp($tokenid){
			$query ="select * from integration_app WHERE token_id=:token_id";
			$stmt = $this->conn->prepare($query);
			$stmt->bindValue(':token_id',$tokenid);
			$stmt->execute();
			return $stmt->rowCount();
	}


  function checkmerchant(){
			$query ="select * from integration_app WHERE id_merchant=:id_merchant";
			$stmt = $this->conn->prepare($query);
			$stmt->bindValue(':id_merchant',$this->session);
			$stmt->execute();
			return $stmt->rowCount();
	}


  /* For site address */
  function checksiteaddress(){
    $query ="select * from settings_general WHERE id_merchant=:id_merchant";
    $stmt = $this->conn->prepare($query);
    $stmt->bindValue(':id_merchant',$this->session);
    $stmt->execute();
    return $stmt->rowCount();
  }
  function updatesiteaddress($paramshop){
    $query ="UPDATE settings_general
            SET
            site_address=:site_address,
            site_type=:site_type
            WHERE id_merchant=:id_merchant";
    $stmt = $this->conn->prepare($query);
    $stmt->bindValue(':id_merchant',$this->session);
    $stmt->bindValue(':site_address','https://'.$paramshop);
    $stmt->bindValue(':site_type','1');
    if($stmt->execute()){return 1;}else{return 0;}
  }
  function insertsiteaddress($paramshop){
    $this->conn->query("SET SESSION sql_mode=''");
    $query ="INSERT INTO settings_general
            SET
            id_merchant=:id_merchant,
            is_send=:is_send,
            auto_approved=:auto_approved,
            site_address=:site_address,
            site_type=:site_type,
            dateadded=:dateadded";
    $stmt = $this->conn->prepare($query);
    $stmt->bindValue(':id_merchant',$this->session);
    $stmt->bindValue(':is_send','false');
    $stmt->bindValue(':auto_approved','false');
    $stmt->bindValue(':site_address','https://'.$paramshop);
    $stmt->bindValue(':site_type','1');
    $stmt->bindValue(':dateadded',date('Y-m-d'));
    if($stmt->execute()){return 1;}else{return 0;}
  }
  /* For site address end */


	function SaveInstallApi($app_id,$tokenapi,$paramshop){

			//if($this->checkInstallapp($tokenapi)>0){
					//return 'The app already installed on your shopify store';
			//}

      $this->conn->query("SET SESSION sql_mode=''");

      if($this->checkmerchant()>0){
  			$query ="UPDATE integration_app
  							SET
  							app_id=:app_id,
  							token_id=:token_id,
  							app_name=:app_name
                WHERE id_merchant=:id_merchant";
  			$stmt = $this->conn->prepare($query);
  			$stmt->bindValue(':id_merchant',$this->session);
  			$stmt->bindValue(':app_id',$app_id);
  			$stmt->bindValue(':token_id',$tokenapi);
  			$stmt->bindValue(':app_name',$paramshop);
  			if($stmt->execute()){

            if($this->checksiteaddress()>0){
              $this->updatesiteaddress($paramshop);
            }else{
              $this->insertsiteaddress($paramshop);
            }

  					return 'The app successfully installed on your shopify store';
  			}else{
  					return 'app_failed';
  			}
      }

			$query ="INSERT INTO integration_app
							SET
							id_merchant=:id_merchant,
							app_id=:app_id,
							token_id=:token_id,
							app_name=:app_name,
							dateadded=:dateadded";
			$stmt = $this->conn->prepare($query);
			$stmt->bindValue(':id_merchant',$this->session);
			$stmt->bindValue(':app_id',$app_id);
			$stmt->bindValue(':token_id',$tokenapi);
			$stmt->bindValue(':app_name',$paramshop);
			$stmt->bindValue(':dateadded',date('Y-m-d'));
			if($stmt->execute()){

          if($this->checksiteaddress()>0){
            $this->updatesiteaddress($paramshop);
          }else{
            $this->insertsiteaddress($paramshop);
          }

					return 'The app successfully installed on your shopify store';
			}else{
					return 'app_failed';
			}
	}


  /* Check Installed Shopify */
  function checkAuthorizationID($token_id,$shop){
    $query ="select * from integration_app WHERE id_merchant=:id_merchant and token_id=:token_id and app_name=:app_name";
    $stmt = $this->conn->prepare($query);
    $stmt->bindValue(':id_merchant',$this->session);
    $stmt->bindValue(':token_id',$token_id);
    $stmt->bindValue(':app_name',$shop);
    $stmt->execute();
    return $stmt->rowCount();
  }


}
$app = new Controller();
