<?php
class SetcookieController extends Database{

  public function __construct(){
    $this->conn = $this->getConnection();
  }

  function domainstore($url){
      $domain = parse_url($url, PHP_URL_HOST);
      $domain = preg_replace('/^www\./', '', $domain);
      return $domain;
  }

  function merchantid($public_key,$secret_key,$shop){
    $query ="select * from merchant WHERE public_key=:public_key and secret_key=:secret_key and website_url=:website_url and date_expiration>='".date('Y-m-d')."'";
    $stmt = $this->conn->prepare($query);
    $stmt->bindValue(':public_key',$public_key);
    $stmt->bindValue(':secret_key',$secret_key);
    $stmt->bindValue(':website_url',$shop);
    $stmt->execute();
    if($stmt->rowCount()==0){return 0;}
    return $stmt->fetch(PDO::FETCH_ASSOC);
  }

  function affiliateid($id){
    $query ="select * from affiliates WHERE id=:id";
    $stmt = $this->conn->prepare($query);
    $stmt->bindValue(':id',$id);
    $stmt->execute();
    if($stmt->rowCount()==0){return 0;}
    return $stmt->fetch(PDO::FETCH_ASSOC);
  }


  /* ---------- Shop Tracker Cookie -------------------------*/

  function createDateCookie($cookie_duration){
     $datenow = date('Y-m-d');
     $date = date_create($datenow);
     date_add($date,date_interval_create_from_date_string($cookie_duration." days"));
     return date_format($date,"Y-m-d");
  }

  function checktracker($affiliate_id,$hivefiliate_user,$location_type){
    $query ="select * from shop_trackcustomer WHERE id_affiliate=:id_affiliate and ip_address=:ip_address and shop=:shop";
    $stmt = $this->conn->prepare($query);
    $stmt->bindValue(':id_affiliate',$affiliate_id);
    $stmt->bindValue(':ip_address',$hivefiliate_user);
    $stmt->bindValue(':shop',$location_type);
    $stmt->execute();
    return $stmt->rowCount();
  }

  function updatetracker($affiliate_id,$hivefiliate_user,$location_type,$cookie_duration){
    $query ="UPDATE shop_trackcustomer
            SET
            date_expire=:date_expire
            WHERE id_affiliate=:id_affiliate and ip_address=:ip_address and shop=:shop";
    $stmt = $this->conn->prepare($query);
    $stmt->bindValue(':id_affiliate',$affiliate_id);
    $stmt->bindValue(':ip_address',$hivefiliate_user);
    $stmt->bindValue(':date_expire',$this->createDateCookie($cookie_duration));
    $stmt->bindValue(':shop',$location_type);
    if($stmt->execute()){
        return 1;
    }else{
        return 0;
    }
  }

  function getCookieduration($id){
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
    return $cookie_duration;
  }


  function shoptracker($affiliate_id,$hivefiliate_user,$location_type){

    $cookie_duration = $this->getCookieduration($affiliate_id);

    if($this->checktracker($affiliate_id,$hivefiliate_user,$location_type)>0){
      return $this->updatetracker($affiliate_id,$hivefiliate_user,$location_type,$cookie_duration);
    }

    $query ="INSERT INTO shop_trackcustomer
            SET
            id_affiliate=:id_affiliate,
            ip_address=:ip_address,
            date_expire=:date_expire,
            shop=:shop,
            dateadded=:dateadded";
    $stmt = $this->conn->prepare($query);
    $stmt->bindValue(':id_affiliate',$affiliate_id);
    $stmt->bindValue(':ip_address',$hivefiliate_user);
    $stmt->bindValue(':date_expire',$this->createDateCookie($cookie_duration));
    $stmt->bindValue(':shop',$location_type);
    $stmt->bindValue(':dateadded',date('Y-m-d'));
    if($stmt->execute()){
        return 1;
    }else{
        return 0;
    }
  }

  /* ---------- Shop Tracker Cookie end -------------------------*/


  /* ---------- Visti update tracker -----------------------------------*/
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


  /* ---------- Visti tracker end -------------------------------*/

  /* ---------- CHeck if valid url -------------------------------*/

  function ismerchantvalid($affiliate_id,$merchant_id){
    $query ="select * from affiliates WHERE id=:id and id_merchant=:id_merchant";
    $stmt = $this->conn->prepare($query);
    $stmt->bindValue(':id',$affiliate_id);
    $stmt->bindValue(':id_merchant',$merchant_id);
    $stmt->execute();
    return $stmt->rowCount();
  }
  /* ---------- CHeck if valid url end -------------------------------*/


  function settingcookie($arg){


    $location_type    = $this->domainstore($arg['domain_url']);
    $hivefiliate_user = $arg['user_ip'];


    $merchant_id      = $this->merchantid($arg['public_key'],$arg['secret_key'],$location_type);
    $affiliate_id     = $this->affiliateid($arg['aff_id']);

    if($merchant_id==0){return 0;}
    if($affiliate_id==0){return 0;}

    $merchant_id      = $merchant_id['id'];
    $affiliate_id     = $affiliate_id['id'];

    $this->shoptracker($affiliate_id,$hivefiliate_user,$location_type);

    if($this->CheckExistVisitor($affiliate_id,$hivefiliate_user,$location_type)>0){
       return $this->UpdateVisitor($affiliate_id,$hivefiliate_user,$location_type);
    }

    if($this->ismerchantvalid($affiliate_id,$merchant_id,$location_type)==0){return 0;}

    $this->conn->query("SET SESSION sql_mode=''");
    $query ="INSERT INTO store_visit
            SET
            id_merchant=:id_merchant,
            id_affiliate=:id_affiliate,
            id_useragent=:id_useragent,
            visit_count=:visit_count,
            shop=:shop,
            dateadded=:dateadded";
    $stmt = $this->conn->prepare($query);
    $stmt->bindValue(':id_merchant',$merchant_id);
    $stmt->bindValue(':id_affiliate',$affiliate_id);
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
$setcookie = new SetcookieController();
