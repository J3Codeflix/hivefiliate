<?php
class VisitController extends Database{

  public function __construct(){
    $this->conn = $this->getConnection();
  }

  function domainstore($url){
      $domain = parse_url($url, PHP_URL_HOST);
      $domain = preg_replace('/^www\./', '', $domain);
      return $domain;
  }

  function affiliateinfo($hivefiliate_id){
      $query ="select * from affiliates WHERE id=:id";
      $stmt = $this->conn->prepare($query);
      $stmt->bindValue(':id',$hivefiliate_id);
      $stmt->execute();
      if($stmt->rowCount()==0){return 0;}
      $row = $stmt->fetch(PDO::FETCH_ASSOC);
      return array(
          'id_merchant' => $row['id_merchant'],
          'id_hash' 		=> $row['id_hash'],
          'email' 			=> $row['email'],
          'first_name' 	=> $row['first_name'],
          'last_name' 	=> $row['last_name'],
      );
  }

  function checkplanmerchant($id){
      $query ="select * from merchant WHERE id=:id and date_expiration>='".date('Y-m-d')."'";
      $stmt = $this->conn->prepare($query);
      $stmt->bindValue(':id',$id);
      $stmt->execute();
      return $stmt->rowCount();
  }


  function CheckExistVisitor($hivefiliate_id,$hivefiliate_user,$location_type){
      $date = date('Y-m-d');
			$query ="select * from store_visit WHERE id_affiliate=:id_affiliate and id_useragent=:id_useragent and shop=:shop and dateadded='".$date."'";
			$stmt = $this->conn->prepare($query);
			$stmt->bindValue(':id_affiliate',$hivefiliate_id);
      $stmt->bindValue(':id_useragent',$hivefiliate_user);
      $stmt->bindValue(':shop',$location_type);
			$stmt->execute();
			return $stmt->rowCount();
	}

  function getcurrentvisit($hivefiliate_id,$hivefiliate_user,$location_type){
      $query ="select * from store_visit WHERE id_useragent=:id_useragent and id_affiliate=:id_affiliate and shop=:shop";
      $stmt = $this->conn->prepare($query);
      $stmt->bindValue(':id_affiliate',$hivefiliate_id);
      $stmt->bindValue(':id_useragent',$hivefiliate_user);
      $stmt->bindValue(':shop',$location_type);
      $stmt->execute();
      $row = $stmt->fetch(PDO::FETCH_ASSOC);
      return $row['visit_count']+1;
  }


  function UpdateVisitor($hivefiliate_id,$hivefiliate_user,$location_type){
			$query ="UPDATE store_visit
							SET
							visit_count=:visit_count
							WHERE id_useragent=:id_useragent and id_affiliate=:id_affiliate and shop=:shop";
			$stmt = $this->conn->prepare($query);
      $stmt->bindValue(':id_affiliate',$hivefiliate_id);
      $stmt->bindValue(':id_useragent',$hivefiliate_user);
      $stmt->bindValue(':shop',$location_type);
			$stmt->bindValue(':visit_count',$this->getcurrentvisit($hivefiliate_id,$hivefiliate_user,$location_type));
			if($stmt->execute()){
					return 1;
			}else{
					return 0;
			}
	}



  /* ----------------------------------------------------------------
  -----------------Save cookie customer agent--------------------- */

  function checkaffiliateid($id){
    $query ="select * from affiliates WHERE id=:id";
    $stmt = $this->conn->prepare($query);
    $stmt->bindValue(':id',$id);
    $stmt->execute();
    return $stmt->rowCount();
  }

  function createDateCookie($cookie_duration){
     $datenow = date('Y-m-d');
     $date = date_create($datenow);
     date_add($date,date_interval_create_from_date_string($cookie_duration." days"));
     return date_format($date,"Y-m-d");
  }


  function updatecookieduration($cookie_duration,$id,$shop,$ip){
    $query ="UPDATE shop_trackcustomer
            SET
            date_expire=:date_expire
            WHERE shop=:shop and id_affiliate=:id_affiliate and ip_address=:ip_address";
    $stmt = $this->conn->prepare($query);
    $stmt->bindValue(':id_affiliate',$id);
    $stmt->bindValue(':shop',$shop);
    $stmt->bindValue(':ip_address',$ip);
    $stmt->bindValue(':date_expire',$this->createDateCookie($cookie_duration));
    $stmt->execute();
  }

  function CheckExpireCookie($cookie_duration,$id,$shop,$ip){
    $date = date('Y-m-d');
    $query ="select * from shop_trackcustomer WHERE id_affiliate=:id_affiliate and shop=:shop and ip_address=:ip_address";
		$stmt = $this->conn->prepare($query);
		$stmt->bindValue(':id_affiliate',$id);
    $stmt->bindValue(':shop',$shop);
    $stmt->bindValue(':ip_address',$ip);
		$stmt->execute();
    if($stmt->rowCount()==0){
      return 0;
    }else{
      $this->updatecookieduration($cookie_duration,$id,$shop,$ip);
      return 1;
    }
  }


  function SaveCustomerVisitor($cookie_duration,$id,$url,$ip){

    if($this->checkaffiliateid($id)==0){return 0;}
    if($this->CheckExpireCookie($cookie_duration,$id,$url,$ip)>0){return 0;}

    $query ="INSERT INTO shop_trackcustomer
            SET
            id_affiliate=:id_affiliate,
            ip_address=:ip_address,
            date_expire=:date_expire,
            shop=:shop,
            dateadded=:dateadded";
    $stmt = $this->conn->prepare($query);
    $stmt->bindValue(':id_affiliate',$id);
    $stmt->bindValue(':ip_address',$ip);
    $stmt->bindValue(':date_expire',$this->createDateCookie($cookie_duration));
    $stmt->bindValue(':shop',$url);
    $stmt->bindValue(':dateadded',date('Y-m-d'));
    if($stmt->execute()){
        return 1;
    }else{
        return 0;
    }

    
  }

	function getCookieduration($id,$url,$ip){
		$query ="select cookie_duration from affiliates WHERE id=:id";
		$stmt = $this->conn->prepare($query);
		$stmt->bindValue(':id',$id);
		$stmt->execute();

		if($stmt->rowCount()==0){return 0;}

		$row = $stmt->fetch(PDO::FETCH_ASSOC);

    $cookie_duration = 7;
		if($row['cookie_duration']!=''){
      $cookie_duration = $row['cookie_duration'];
    }
    $this->SaveCustomerVisitor($cookie_duration,$id,$url,$ip);
    return $cookie_duration;
	}

  /* -----------------------------------------------------------------
  -----------------Save cookie customer agent end--------------------- */



  function insertvisit($arg){

    if(empty($arg['aff_id'])||$arg['aff_id']==''){return '';}

    $hivefiliate_id   = $arg['aff_id'];
    $location_type    = $this->domainstore($arg['domain_url']);
    $hivefiliate_user = $arg['user_ip'];
    $aff              = $this->affiliateinfo($hivefiliate_id);

    if($aff==0){return 0;}
    if($this->checkplanmerchant($aff['id_merchant'])==0){return 0;}
    $this->getCookieduration($hivefiliate_id,$location_type,$hivefiliate_user);

    if($this->CheckExistVisitor($hivefiliate_id,$hivefiliate_user,$location_type)>0){
      return $this->UpdateVisitor($hivefiliate_id,$hivefiliate_user,$location_type);
    }


    $this->conn->query("SET SESSION sql_mode=''");

    $query ="INSERT INTO store_visit
            SET
            id_merchant=:id_merchant,
            id_affiliate=:id_affiliate,
            id_hashaffiliate=:id_hashaffiliate,
            id_useragent=:id_useragent,
            visit_count=:visit_count,
            shop=:shop,
            dateadded=:dateadded";
    $stmt = $this->conn->prepare($query);
    $stmt->bindValue(':id_merchant',$aff['id_merchant']);
    $stmt->bindValue(':id_affiliate',$hivefiliate_id);
    $stmt->bindValue(':id_hashaffiliate',$aff['id_hash']);
    $stmt->bindValue(':id_useragent',$hivefiliate_user);
    $stmt->bindValue(':visit_count','1');
    $stmt->bindValue(':shop',$location_type);
    $stmt->bindValue(':dateadded',date('Y-m-d'));
    if($stmt->execute()){
        return 1;
    }else{
        return 0;
    }
	}


}
$visit = new VisitController();
