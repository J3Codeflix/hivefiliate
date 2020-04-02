<?php
class Controller extends Database{

  public function __construct(){
      $this->conn 		 	        = $this->getConnection();
      $this->session            = $this->AdminSessionHandler();
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
  			dateadded=:dateadded";
  		$stmt = $this->conn->prepare($query);
  		$stmt->bindValue(':merchant_id',$arg['merchant_id']);
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
  		$stmt->bindValue(':dateadded',date('Y-m-d'));
  		if($stmt->execute()){return 1;}else{return 0;}
	}

  function UpdateOrder($arg){
  		$this->conn->query("SET SESSION sql_mode=''");
  		$query ="UPDATE orders
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
  			is_order=:is_order
        WHERE id=:id";
  		$stmt = $this->conn->prepare($query);
      $stmt->bindValue(':id',$arg['id']);
  		$stmt->bindValue(':merchant_id',$arg['merchant_id']);
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
  		if($stmt->execute()){return 1;}else{return 0;}
	}


  function infomerchant($id){
    $query ="select * from merchant where id=:id";
    $stmt = $this->conn->prepare($query);
    $stmt->bindValue(':id',$id);
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




}
$form = new Controller();
