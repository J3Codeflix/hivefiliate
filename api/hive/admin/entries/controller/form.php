<?php
class Controller extends Database{

  public function __construct(){
      $this->conn = $this->getConnection();
	}

	function ChangeEntries($value,$type){
  	  $this->conn->query("SET SESSION sql_mode=''");
  		$query ="UPDATE entries
  			SET
  			val=:val
        WHERE type=:type";
  		$stmt = $this->conn->prepare($query);
  		$stmt->bindValue(':type',$type);
      $stmt->bindValue(':val',$value);
  		if($stmt->execute()){return 1;}else{return 0;}
	}
}
$form = new Controller();
