<?php 
class Controller extends Database{

  
    public function __construct(){
        $this->conn 		  = $this->getConnection();
        $this->session    = $this->MerchantSessionHandler();
    }


    function removebannerCategories($id){
          $query ="DELETE FROM banner_categories WHERE id=:id";
          $stmt = $this->conn->prepare($query);
          $stmt->bindValue(':id',$id);
          if($stmt->execute()){
            return 1;
          }else{
            return 0;
          }
    }

    function deleteBanner($id){
          $query ="DELETE FROM banner WHERE id=:id";
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