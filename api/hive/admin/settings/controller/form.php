<?php
class Controller extends Database{

  public function __construct(){
      $this->conn 		 	        = $this->getConnection();
      $this->session            = $this->AdminSessionHandler();
	}


  /* ----------------- Subscription Info ------------------------ */

  function SubcriptionPlan($id){
    $query="select * from pricing_plan where id='".$id."'";
    $stmt = $this->conn->prepare($query);
    $stmt->execute();
    return $stmt->fetch(PDO::FETCH_ASSOC);
  }
  function SubscriptionInfo(){
    $pro          = $this->SubcriptionPlan(2);
    $enterprise   = $this->SubcriptionPlan(3);
    return array(
      'plan_professional'   => $pro['price_plan'],
      'plan_enterprise'     => $enterprise['price_plan'],
    );
  }

  /* Subscription Update */
  function SaveSubPro($id,$arg){
    if($id==2){
      $query ="UPDATE pricing_plan
        SET
        price_plan=:price_plan
        WHERE id=:id";
      $stmt = $this->conn->prepare($query);
      $stmt->bindValue(':id',$id);
      $stmt->bindValue(':price_plan',$arg['plan_professional']);
      if($stmt->execute()){return 1;}else{return 0;}
    }
    if($id==3){
      $query ="UPDATE pricing_plan
        SET
        price_plan=:price_plan
        WHERE id=:id";
      $stmt = $this->conn->prepare($query);
      $stmt->bindValue(':id',$id);
      $stmt->bindValue(':price_plan',$arg['plan_enterprise']);
      if($stmt->execute()){return 1;}else{return 0;}
    }
  }

  function SaveSubscription($arg){
    if($this->SaveSubPro(2,$arg)==1&&$this->SaveSubPro(3,$arg)==1){
      return 1;
    }else{
      return 0;
    }
  }


  /* Info paypal api */

  function paypalinfo(){
    $query="select paypal_clientid,is_live from adminsett_paypalapi order by id desc limit 1";
    $stmt = $this->conn->prepare($query);
    $stmt->execute();
    if($stmt->rowCount()==0){return 0;}
    return $stmt->fetch(PDO::FETCH_ASSOC);
  }


  /* Form Controll */

  function checkifexist(){
      $query="select * from adminsett_paypalapi";
      $stmt = $this->conn->prepare($query);
      $stmt->execute();
      return $stmt->rowCount();
  }

  function SavePaypalSettings($arg){
  		$this->conn->query("SET SESSION sql_mode=''");

      if($this->checkifexist()>0){
        $query ="UPDATE adminsett_paypalapi
    			SET
    			paypal_clientid=:paypal_clientid,
    			is_live=:is_live";
    		$stmt = $this->conn->prepare($query);
    		$stmt->bindValue(':paypal_clientid',$arg['paypal_clientid']);
    		$stmt->bindValue(':is_live',$arg['is_live']);
    		if($stmt->execute()){return 1;}else{return 0;}
      }else{
        $query ="INSERT INTO  adminsett_paypalapi
    			SET
    			paypal_clientid=:paypal_clientid,
    			is_live=:is_live,
    			dateadded=:dateadded";
    		$stmt = $this->conn->prepare($query);
    		$stmt->bindValue(':paypal_clientid',$arg['paypal_clientid']);
    		$stmt->bindValue(':is_live',$arg['is_live']);
    		$stmt->bindValue(':dateadded',date('Y-m-d'));
    		if($stmt->execute()){return 1;}else{return 0;}
      }
	}

  /* App Configurations */

  function Appconfiginfo(){
    $query="select * from adminsett_config order by id desc limit 1";
    $stmt = $this->conn->prepare($query);
    $stmt->execute();
    if($stmt->rowCount()==0){return 0;}
    return $stmt->fetch(PDO::FETCH_ASSOC);
  }

  function checkappexist(){
      $query="select * from adminsett_config";
      $stmt = $this->conn->prepare($query);
      $stmt->execute();
      return $stmt->rowCount();
  }

  function SaveConfigurations($arg){
  		$this->conn->query("SET SESSION sql_mode=''");

      if($this->checkappexist()>0){
        $query ="UPDATE adminsett_config
    			SET
    			notif_slsaff=:notif_slsaff,
          notif_slsmerc=:notif_slsmerc,
          notif_paysentaff=:notif_paysentaff";
    		$stmt = $this->conn->prepare($query);
    		$stmt->bindValue(':notif_slsaff',$arg['notif_slsaff']);
    		$stmt->bindValue(':notif_slsmerc',$arg['notif_slsmerc']);
        $stmt->bindValue(':notif_paysentaff',$arg['notif_paysentaff']);
    		if($stmt->execute()){return 1;}else{return 0;}
      }else{
        $query ="INSERT INTO  adminsett_config
    			SET
          notif_slsaff=:notif_slsaff,
          notif_slsmerc=:notif_slsmerc,
          notif_paysentaff=:notif_paysentaff,
    			dateadded=:dateadded";
    		$stmt = $this->conn->prepare($query);
    		$stmt->bindValue(':notif_slsaff',$arg['notif_slsaff']);
    		$stmt->bindValue(':notif_slsmerc',$arg['notif_slsmerc']);
        $stmt->bindValue(':notif_paysentaff',$arg['notif_paysentaff']);
    		$stmt->bindValue(':dateadded',date('Y-m-d'));
    		if($stmt->execute()){return 1;}else{return 0;}
      }
	}




}
$form = new Controller();
