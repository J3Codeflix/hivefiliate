<?php
class Controller extends Database{

    public function __construct(){
        $this->conn 		  = $this->getConnection();
    }


    function DeleteAccount($id){
      $query ="UPDATE affiliates
          SET
            status=:status,
            is_deleted=:is_deleted,
            deleted_date=:deleted_date
            WHERE id=:id";
      $stmt = $this->conn->prepare($query);
      $stmt->bindValue(':id',$id);
      $stmt->bindValue(':status','is_deleted');
      $stmt->bindValue(':is_deleted','1');
      $stmt->bindValue(':deleted_date',date('Y-m-d'));
      if($stmt->execute()){return 1;}else{return 0;}
    }

    function AccountRetrieve($id){
      $query ="UPDATE affiliates
          SET
            status=:status,
            is_deleted=:is_deleted,
            deleted_date=:deleted_date
            WHERE id=:id";
      $stmt = $this->conn->prepare($query);
      $stmt->bindValue(':id',$id);
      $stmt->bindValue(':status','is_active');
      $stmt->bindValue(':is_deleted','0');
      $stmt->bindValue(':deleted_date',date('Y-m-d'));
      if($stmt->execute()){return 1;}else{return 0;}
    }

    /* ---------------------------------------------------------------------------------------------------------
    ---------------------------------- Merchant Account Delete Entire information ------------------------------*/

    /* Affiliates Payment History*/
    function DeleteonAffiliatesPaymentHistory($id){
      $query ="DELETE FROM affiliates_payhistory WHERE id_affiliate=:id";
      $stmt = $this->conn->prepare($query);
      $stmt->bindValue(':id',$id);
      if($stmt->execute()){return 1;}else{return 0;}
    }

    /* Affiliates */
    function DeleteonAffiliates($id){
      $query ="DELETE FROM affiliates WHERE id=:id";
      $stmt = $this->conn->prepare($query);
      $stmt->bindValue(':id',$id);
      if($stmt->execute()){return 1;}else{return 0;}
    }

    /* Affiliates Order */
    function DeleteonOrders($id){
      $query ="DELETE FROM orders WHERE affiliate_id=:id";
      $stmt = $this->conn->prepare($query);
      $stmt->bindValue(':id',$id);
      if($stmt->execute()){return 1;}else{return 0;}
    }

    /* Affiliates Visit order */
    function DeleteonStoreVisit($id){
      $query ="DELETE FROM store_visit WHERE id_affiliate=:id";
      $stmt = $this->conn->prepare($query);
      $stmt->bindValue(':id',$id);
      if($stmt->execute()){return 1;}else{return 0;}
    }




    function AffiliateWipeData($id){

        $error_array = array();
        $error=0;
        if(empty($id)||$id<1){
          $error_array['DeleteonAffiliates']='Error';
          return json_encode($error_array);exit;
        }

        if($this->DeleteonAffiliates($id)==0){                    $error_array['DeleteonAffiliates']                ='Not Deleted';  $error=1;}
        if($this->DeleteonAffiliatesPaymentHistory($id)==0){      $error_array['DeleteonAffiliatesPaymentHistory']  ='Not Deleted';  $error=1;}
        if($this->DeleteonOrders($id)==0){                        $error_array['DeleteonOrders']                    ='Not Deleted';  $error=1;}
        if($this->DeleteonStoreVisit($id)==0){                    $error_array['DeleteonStoreVisit']                    ='Not Deleted';  $error=1;}

        if($error==0){return 1;}
        return json_encode($error_array);exit;

    }
}
$delete = new Controller();
