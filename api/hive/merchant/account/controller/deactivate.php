<?php
class Controller extends Database{

    public function __construct(){
        $this->conn 		          = $this->getConnection();
        $this->session            = $this->MerchantSessionHandler();
    }

    /* ---------------------------------------------------------------------------------------------------------
    ---------------------------------- Merchant Account Delete Entire information ------------------------------*/

    /* Affiliates */
    function DeleteonAffiliates($id){
      $query ="DELETE FROM affiliates WHERE id_merchant=:id";
      $stmt = $this->conn->prepare($query);
      $stmt->bindValue(':id',$id);
      if($stmt->execute()){return 1;}else{return 0;}
    }
    function DeleteonAffiliatesPaymentHistory($id){
      $query ="DELETE FROM affiliates_payhistory WHERE id_merchant=:id";
      $stmt = $this->conn->prepare($query);
      $stmt->bindValue(':id',$id);
      if($stmt->execute()){return 1;}else{return 0;}
    }

    /* Banner */
    function DeleteonBanner($id){
      $query ="DELETE FROM banner WHERE id_merchant=:id";
      $stmt = $this->conn->prepare($query);
      $stmt->bindValue(':id',$id);
      if($stmt->execute()){return 1;}else{return 0;}
    }
    function DeleteonBannerCat($id){
      $query ="DELETE FROM banner_categories WHERE id_merchant=:id";
      $stmt = $this->conn->prepare($query);
      $stmt->bindValue(':id',$id);
      if($stmt->execute()){return 1;}else{return 0;}
    }
    function DeleteonBannerSettings($id){
      $query ="DELETE FROM banner_setting WHERE merchant_id=:id";
      $stmt = $this->conn->prepare($query);
      $stmt->bindValue(':id',$id);
      if($stmt->execute()){return 1;}else{return 0;}
    }

    /* Integration app */
    function DeleteonIntegration($id){
      $query ="DELETE FROM integration_app WHERE id_merchant=:id";
      $stmt = $this->conn->prepare($query);
      $stmt->bindValue(':id',$id);
      if($stmt->execute()){return 1;}else{return 0;}
    }

    /* Delete Orders */
    function DeleteonOrders($id){
      $query ="DELETE FROM orders WHERE merchant_id=:id";
      $stmt = $this->conn->prepare($query);
      $stmt->bindValue(':id',$id);
      if($stmt->execute()){return 1;}else{return 0;}
    }

    /* Settings */
    function DeleteonSettings($id){
      $query ="DELETE FROM settings_general WHERE id_merchant=:id";
      $stmt = $this->conn->prepare($query);
      $stmt->bindValue(':id',$id);
      if($stmt->execute()){return 1;}else{return 0;}
    }
    function DeleteonSettingsPayment($id){
      $query ="DELETE FROM settings_payment WHERE id_merchant=:id";
      $stmt = $this->conn->prepare($query);
      $stmt->bindValue(':id',$id);
      if($stmt->execute()){return 1;}else{return 0;}
    }
    function DeleteonSettingsTracking($id){
      $query ="DELETE FROM settings_tracking WHERE id_merchant=:id";
      $stmt = $this->conn->prepare($query);
      $stmt->bindValue(':id',$id);
      if($stmt->execute()){return 1;}else{return 0;}
    }

    /* Staff */
    function DeleteonStaff($id){
      $query ="DELETE FROM staff WHERE id_merchant=:id";
      $stmt = $this->conn->prepare($query);
      $stmt->bindValue(':id',$id);
      if($stmt->execute()){return 1;}else{return 0;}
    }

    /* Store Visit */
    function DeleteonStoreVisit($id){
      $query ="DELETE FROM store_visit WHERE id_merchant=:id";
      $stmt = $this->conn->prepare($query);
      $stmt->bindValue(':id',$id);
      if($stmt->execute()){return 1;}else{return 0;}
    }

    /* Merchant Store */
    function DeleteonMerchantStore($id){
      $query ="DELETE FROM merchant WHERE id=:id";
      $stmt = $this->conn->prepare($query);
      $stmt->bindValue(':id',$id);
      if($stmt->execute()){return 1;}else{return 0;}
    }
    function DeleteonMerchantStorePayment($id){
      $query ="DELETE FROM merchant_payment WHERE merchant_id=:id";
      $stmt = $this->conn->prepare($query);
      $stmt->bindValue(':id',$id);
      if($stmt->execute()){return 1;}else{return 0;}
    }

    /* Temporary Deactivate */
    function TemporaryDeactivation($id){
      $query="UPDATE merchant
        SET
        is_deleted=:is_deleted,
        date_action=:date_action,
        action_by=:action_by
      WHERE id=:id";
      $stmt = $this->conn->prepare( $query );
      $stmt->bindValue(':id',$id);
      $stmt->bindValue(':is_deleted','1');
      $stmt->bindValue(':date_action',date('Y-m-d'));
      $stmt->bindValue(':action_by','merchant');
      if($stmt->execute()){
        return 1;
      }else{
        return 0;
      }
    }

    function AccountMerchantWipeoutCompletely(){

        $id = $this->session;

        $error_array = array();
        $error=0;
        if(empty($id)||$id<1){
          $error_array['DeleteonAffiliates']='Error';
          return json_encode($error_array);exit;
        }

        return $this->TemporaryDeactivation($id);
        exit;

        if($this->DeleteonAffiliates($id)==0){                    $error_array['DeleteonAffiliates']                ='Not Deleted';  $error=1;}
        if($this->DeleteonAffiliatesPaymentHistory($id)==0){      $error_array['DeleteonAffiliatesPaymentHistory']  ='Not Deleted';  $error=1;}
        if($this->DeleteonBanner($id)==0){                        $error_array['DeleteonBanner']                    ='Not Deleted';  $error=1;}
        if($this->DeleteonBannerCat($id)==0){                     $error_array['DeleteonBannerCat']                 ='Not Deleted';  $error=1;}
        if($this->DeleteonBannerSettings($id)==0){                $error_array['DeleteonBannerSettings']            ='Not Deleted';  $error=1;}
        if($this->DeleteonIntegration($id)==0){                   $error_array['DeleteonIntegration']               ='Not Deleted';  $error=1;}
        if($this->DeleteonOrders($id)==0){                        $error_array['DeleteonOrders']                    ='Not Deleted';  $error=1;}
        if($this->DeleteonSettings($id)==0){                      $error_array['DeleteonSettings']                  ='Not Deleted';  $error=1;}
        if($this->DeleteonSettingsPayment($id)==0){               $error_array['DeleteonSettingsPayment']           ='Not Deleted';  $error=1;}
        if($this->DeleteonSettingsTracking($id)==0){              $error_array['DeleteonSettingsTracking']          ='Not Deleted';  $error=1;}
        if($this->DeleteonStaff($id)==0){                         $error_array['DeleteonStaff']                     ='Not Deleted';  $error=1;}
        if($this->DeleteonStoreVisit($id)==0){                    $error_array['DeleteonStoreVisit']                ='Not Deleted';  $error=1;}
        if($this->DeleteonMerchantStore($id)==0){                 $error_array['DeleteonMerchantStore']             ='Not Deleted';  $error=1;}
        if($this->DeleteonMerchantStorePayment($id)==0){          $error_array['DeleteonMerchantStorePayment']      ='Not Deleted';  $error=1;}

        if($error==0){return 1;}
        return json_encode($error_array);exit;

    }

    function CheckPassword($password){
        $query="select * from merchant WHERE id=:id";
    	  $stmt = $this->conn->prepare( $query );
    	  $stmt->bindValue(':id',$this->session);
    	  $stmt->execute();
        if($stmt->rowCount()==0){return 0;}
    	  $row = $stmt->fetch(PDO::FETCH_ASSOC);
        if (crypt($password, extend_token().$row['password']) == extend_token().$row['password']) {
    		    return 1;
    	  }else{
    		    return 0;
    	  }
    }


    /* Cancel Removal Account */
    function CancelRemovalAccount(){
      $query="UPDATE merchant
        SET
        is_deleted=:is_deleted,
        date_action=:date_action,
        action_by=:action_by
      WHERE id=:id";
      $stmt = $this->conn->prepare( $query );
      $stmt->bindValue(':id',$this->session);
      $stmt->bindValue(':is_deleted','0');
      $stmt->bindValue(':date_action','0000-00-00');
      $stmt->bindValue(':action_by','');
      if($stmt->execute()){
        return 1;
      }else{
        return 0;
      }
    }



}
$diactivate = new Controller();
