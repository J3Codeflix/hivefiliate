<?php
class Controller extends Database{

  public function __construct(){
      $this->conn 		  = $this->getConnection();
 	}

	function PricingSubscriptions(){
			$query ="select * from pricing_plan where id=2";
			$stmt = $this->conn->prepare($query);
			$stmt->execute();
      $row = $stmt->fetch(PDO::FETCH_ASSOC);
			return $row['price_plan'];
	}



}
$list = new Controller();
