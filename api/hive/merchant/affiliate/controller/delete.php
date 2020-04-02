<?php
class Controller extends Database{


    public function __construct(){
        $this->conn 		  = $this->getConnection();
        $this->session    = $this->MerchantSessionHandler();
    }


    function DeletePaymentHistory($id){
          $query ="DELETE FROM affiliates_payhistory WHERE id=:id";
          $stmt = $this->conn->prepare($query);
          $stmt->bindValue(':id',$id);
          if($stmt->execute()){
            return 1;
          }else{
            return 0;
          }
    }


    /* Delete Affiliate Completely */

    function DeleteAffStorevisit($id){
        $query ="DELETE FROM store_visit WHERE id_affiliate=:id_affiliate and id_merchant=:id_merchant";
        $stmt = $this->conn->prepare($query);
        $stmt->bindValue(':id_affiliate',$id);
        $stmt->bindValue(':id_merchant',$this->session);
        if($stmt->execute()){return 1;}else{return 0;}
    }
    function DeleteAffOrder($id){
        $query ="DELETE FROM orders WHERE affiliate_id=:affiliate_id and merchant_id=:merchant_id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindValue(':affiliate_id',$id);
        $stmt->bindValue(':merchant_id',$this->session);
        if($stmt->execute()){return 1;}else{return 0;}
    }
    function DeleteAffPaymentHistory($id){
        $query ="DELETE FROM affiliates_payhistory WHERE id_affiliate=:id_affiliate and id_merchant=:id_merchant";
        $stmt = $this->conn->prepare($query);
        $stmt->bindValue(':id_affiliate',$id);
        $stmt->bindValue(':id_merchant',$this->session);
        if($stmt->execute()){return 1;}else{return 0;}
    }
    function DeleteAffiliates($id){
        $query ="DELETE FROM affiliates WHERE id=:id and id_merchant=:id_merchant";
        $stmt = $this->conn->prepare($query);
        $stmt->bindValue(':id',$id);
        $stmt->bindValue(':id_merchant',$this->session);
        if($stmt->execute()){return 1;}else{return 0;}
    }

    /*----------- Delete All---------------------- */
    function deleteAll(){
        $query ="select * from affiliates WHERE status='is_deleted'";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        foreach ($stmt->fetchAll() as $row) {
          $this->DeleteAffStorevisit($row['id']);
          $this->DeleteAffOrder($row['id']);
          $this->DeleteAffPaymentHistory($row['id']);
          $this->DeleteAffiliates($row['id']);
        }
        return 1;
    }

    function DeleteDeletedAffiliates(){
        $query ="DELETE FROM affiliates WHERE status='is_deleted' and id_merchant=:id_merchant";
        $stmt = $this->conn->prepare($query);
        $stmt->bindValue(':id_merchant',$this->session);
        if($stmt->execute()){return 1;}else{return 0;}
    }

    function DeleteAffiliateCompletly($id,$status){
        if($status=='single'){
          $this->DeleteAffStorevisit($id);
          $this->DeleteAffOrder($id);
          $this->DeleteAffPaymentHistory($id);
          $this->DeleteAffiliates($id);
          return 1;
        }
        if($status=='all'){
          if($this->deleteAll()==1){
            return $this->DeleteDeletedAffiliates();
          }
        }
    }



}
$delete = new Controller();
