<?php
class CookieController extends Database{
    public function __construct(){
      $this->conn = $this->getConnection();
	}


  /* User IP Address */
  function getUserIpAddr(){
      if(!empty($_SERVER['HTTP_CLIENT_IP'])){
          $ip = $_SERVER['HTTP_CLIENT_IP'];
      }elseif(!empty($_SERVER['HTTP_X_FORWARDED_FOR'])){
          $ip = $_SERVER['HTTP_X_FORWARDED_FOR'];
      }else{
          $ip = $_SERVER['REMOTE_ADDR'];
      }
      return $ip;
  }

  function getshop($url){
    $paramshop=$url;
    return $paramshop;
    /*$parsedUrl = parse_url('https://'.$paramshop);
    $host = explode('.', $parsedUrl['host']);
    //$subdomain = $host[0];
    return $host;*/
  }


  /* ---------------------------------------------------------------------------
  Get and Save Cookie Customer Agent
  ----------------------------------------------------------------------------*/

  /* create cookie date expiration */
  function createDateCookie($cookie_duration){
     $datenow = date('Y-m-d');
     $date = date_create($datenow);
     date_add($date,date_interval_create_from_date_string($cookie_duration." days"));
     return date_format($date,"Y-m-d");
  }


  /* update cookie duration */
  function updatecookieduration($cookie_duration,$id,$shop){
    $query ="UPDATE shop_trackcustomer
            SET
            date_expire=:date_expire
            WHERE shop=:shop and id_affiliate=:id_affiliate and ip_address=:ip_address";
    $stmt = $this->conn->prepare($query);
    $stmt->bindValue(':id_affiliate',$id);
    $stmt->bindValue(':shop',$shop);
    $stmt->bindValue(':ip_address',$this->getUserIpAddr());
    $stmt->bindValue(':date_expire',$this->createDateCookie($cookie_duration));
    $stmt->execute();
  }

  /* check cookie existing */
  function CheckExpireCookie($cookie_duration,$id,$shop){
    $date = date('Y-m-d');
    $query ="select * from shop_trackcustomer WHERE id_affiliate=:id_affiliate and shop=:shop and ip_address=:ip_address";
		$stmt = $this->conn->prepare($query);
		$stmt->bindValue(':id_affiliate',$id);
    $stmt->bindValue(':shop',$shop);
    $stmt->bindValue(':ip_address',$this->getUserIpAddr());
		$stmt->execute();
    if($stmt->rowCount()==0){
      return 0;
    }else{
      $this->updatecookieduration($cookie_duration,$id,$shop);
      return 1;
    }
  }


  /* check if affiliate is valid */
  function checkaffiliateid($id){
    $query ="select * from affiliates WHERE id=:id";
    $stmt = $this->conn->prepare($query);
    $stmt->bindValue(':id',$id);
    $stmt->execute();
    return $stmt->rowCount();
  }


  /* Save cookie customer agent */
  function SaveCustomerVisitor($cookie_duration,$id,$url){

    if($this->checkaffiliateid($id)==0){return 0;}
    if($this->CheckExpireCookie($cookie_duration,$id,$url)>0){return 0;}

    $query ="INSERT INTO shop_trackcustomer
            SET
            id_affiliate=:id_affiliate,
            ip_address=:ip_address,
            date_expire=:date_expire,
            shop=:shop,
            dateadded=:dateadded";
    $stmt = $this->conn->prepare($query);
    $stmt->bindValue(':id_affiliate',$id);
    $stmt->bindValue(':ip_address',$this->getUserIpAddr());
    $stmt->bindValue(':date_expire',$this->createDateCookie($cookie_duration));
    $stmt->bindValue(':shop',$this->getshop($url));
    $stmt->bindValue(':dateadded',date('Y-m-d'));
    if($stmt->execute()){
        return 1;
    }else{
        return 0;
    }

  }


  /* Get specified cookie duration */
	function getCookieduration($id,$url){
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
    $this->SaveCustomerVisitor($cookie_duration,$id,$url);
    return $cookie_duration;
	}

}
$app_cookie = new CookieController();
