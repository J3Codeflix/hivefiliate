<?php 
class Controller extends Database{

  
    public function __construct(){
        $this->conn 		  = $this->getConnection();
        $this->session    = $this->MerchantSessionHandler();
    }


    function DeleteSingleStaff($id){
          $query ="DELETE FROM staff WHERE id=:id";
          $stmt = $this->conn->prepare($query);
          $stmt->bindValue(':id',$id);
          if($stmt->execute()){
            return 1;
          }else{
            return 0;
          }
    }

   

}
$delete = new Controller();