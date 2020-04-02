<?php 
class Controller extends Database{

  
    public function __construct(){
        $this->conn 		  = $this->getConnection();
        $this->session        = $this->SessionHandler();
    }


    function unlinkdimage($id){
        $query ="SELECT * FROM options_colors WHERE id='".$id."'";
        $stmt  = $this->conn->prepare($query);
        $stmt->execute();
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        if(file_exists("../uploads/colors/".$row['image'])){
          unlink("../uploads/colors/".$row['image']);
        }
    }


    function delete($id){
          $this->unlinkdimage($id);
          $query ="DELETE FROM options_colors WHERE id=:id";
          $stmt = $this->conn->prepare($query);
          $stmt->bindValue(':id',$id);
          if($stmt->execute()){
            return 1;
          }else{
            return 0;
          }
    }


    function unlinkdimages(){
        $query ="SELECT * FROM options_colors";
        $stmt  = $this->conn->prepare($query);
        $stmt->execute();
        foreach($stmt->fetchAll() as $row){
          if(file_exists("../uploads/colors/".$row['image'])){
            unlink("../uploads/colors/".$row['image']);
          }
        }
    }

    function deleteall(){
          $this->unlinkdimages();
          $query ="DELETE FROM options_colors";
          $stmt = $this->conn->prepare($query);
          if($stmt->execute()){
            return 1;
          }else{
            return 0;
          }
    }

   


}
$delete = new Controller();