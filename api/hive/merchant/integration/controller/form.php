<?php 
class Controller extends Database{

    public function __construct(){
        $this->conn 		 	 = $this->getConnection();
		$this->session        	 = $this->MerchantSessionHandler();
	}

	function IsMerchantLogin(){
		$query="select * from merchant WHERE id=:id";
		$stmt = $this->conn->prepare( $query );
		$stmt->bindValue(':id',$this->session);
		$stmt->execute();
		$row = $stmt->fetch(PDO::FETCH_ASSOC);
		if($stmt->rowCount()==0){return 0;}else{return 1;}
	}

}
$form = new Controller();