<?php
class Controller extends Database{

    public function __construct(){
      $this->conn 		 	 = $this->getConnection();
  		$this->session        	 = $this->MerchantSessionHandler();
  		$this->merchant          = $this->MerchantData();
  	}

    function getUserIpAddr(){
        if(!empty($_SERVER['HTTP_CLIENT_IP'])){
            //ip from share internet
            $ip = $_SERVER['HTTP_CLIENT_IP'];
        }elseif(!empty($_SERVER['HTTP_X_FORWARDED_FOR'])){
            //ip pass from proxy
            $ip = $_SERVER['HTTP_X_FORWARDED_FOR'];
        }else{
            $ip = $_SERVER['REMOTE_ADDR'];
        }
        return $ip;
    }

    function userAgent() {
        return $_SERVER["HTTP_USER_AGENT"];
        //return preg_match("/(android|avantgo|blackberry|bolt|boost|cricket|docomo|fone|hiptop|mini|mobi|palm|phone|pie|tablet|up\.browser|up\.link|webos|wos)/i", $_SERVER["HTTP_USER_AGENT"]);
    }


	function getAffiliate(){
		$query="select * from affiliates WHERE id_merchant=:id_merchant";
		$stmt = $this->conn->prepare( $query );
		$stmt->bindValue(':id_merchant',$this->session);
		$stmt->execute();
		$array = array();

	    foreach ($stmt->fetchAll() as $row) {
	      $array[] = [
	         'key'    				=> $row['id'],
			 'text'   	   			=> $row['first_name'].' '.$row['last_name'],
			 'value'   	   			=> $row['id'],
	     ];
	    }
	   return $array;

	}

  function infomerchant(){
    $query ="select * from merchant where id=:id";
    $stmt = $this->conn->prepare($query);
    $stmt->bindValue(':id',$this->session);
    $stmt->execute();
    return $stmt->fetch(PDO::FETCH_ASSOC);
  }
  function infoaffiliate($id){
    $query ="select * from affiliates where id=:id";
    $stmt = $this->conn->prepare($query);
    $stmt->bindValue(':id',$id);
    $stmt->execute();
    return $stmt->fetch(PDO::FETCH_ASSOC);
  }
	function SaveOrder($arg){

		$this->conn->query("SET SESSION sql_mode=''");

			$query ="INSERT INTO  orders
				SET
				merchant_id=:merchant_id,
				affiliate_id=:affiliate_id,
				order_id=:order_id,
				tracking_method=:tracking_method,
				order_price=:order_price,
				aff_earnings=:aff_earnings,
				date_order=:date_order,
				order_status=:order_status,
				landing_page=:landing_page,
				referal_page=:referal_page,
				notes=:notes,
				is_order=:is_order,
        location_type=:location_type,
        ip_address=:ip_address,
        device_type=:device_type,
        order_type=:order_type,
				dateadded=:dateadded";
			$stmt = $this->conn->prepare($query);
			$stmt->bindValue(':merchant_id',$this->session);
			$stmt->bindValue(':affiliate_id',$arg['affiliate_id']);
			$stmt->bindValue(':order_id',$arg['order_id']);
			$stmt->bindValue(':tracking_method',$arg['tracking_method']);
			$stmt->bindValue(':order_price',$arg['order_price']);
			$stmt->bindValue(':aff_earnings',$arg['aff_earnings']);
			$stmt->bindValue(':date_order',$arg['date_order']);
			$stmt->bindValue(':order_status',$arg['order_status']);
			$stmt->bindValue(':landing_page',$arg['landing_page']);
			$stmt->bindValue(':referal_page',$arg['referal_page']);
			$stmt->bindValue(':notes',$arg['notes']);
			$stmt->bindValue(':is_order','is_approved');
      $stmt->bindValue(':location_type',$_SERVER['HTTP_HOST']);
      $stmt->bindValue(':ip_address',$this->getUserIpAddr());
      $stmt->bindValue(':device_type',$this->userAgent());
      $stmt->bindValue(':order_type','Manually added ordered by merchant');
			$stmt->bindValue(':dateadded',date('Y-m-d'));
			if($stmt->execute()){session_destroy();return 1;}else{return 0;}

	}

	function UpdateOrder($arg){

		$this->conn->query("SET SESSION sql_mode=''");

			$query ="UPDATE  orders
				SET
				affiliate_id=:affiliate_id,
				order_price=:order_price,
				aff_earnings=:aff_earnings,
				date_order=:date_order,
				order_status=:order_status,
				landing_page=:landing_page,
				referal_page=:referal_page,
				notes=:notes
				WHERE id=:id";
			$stmt = $this->conn->prepare($query);
			$stmt->bindValue(':id',$arg['id']);
			$stmt->bindValue(':affiliate_id',$arg['affiliate_id']);
			$stmt->bindValue(':order_price',$arg['order_price']);
			$stmt->bindValue(':aff_earnings',$arg['aff_earnings']);
			$stmt->bindValue(':date_order',$arg['date_order']);
			$stmt->bindValue(':order_status',$arg['order_status']);
			$stmt->bindValue(':landing_page',$arg['landing_page']);
			$stmt->bindValue(':referal_page',$arg['referal_page']);
			$stmt->bindValue(':notes',$arg['notes']);
			if($stmt->execute()){return 1;}else{return 0;}

	}



}
$form = new Controller();
