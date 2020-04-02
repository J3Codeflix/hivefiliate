<?php
class Controller extends Database{

    public function __construct(){
        $this->conn 		  = $this->getConnection();
    }

    function deleteUser($id){
          $query ="DELETE FROM admin_users WHERE id=:id";
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
