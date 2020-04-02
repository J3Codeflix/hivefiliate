<?php
class VisitController extends Database{

    public function __construct(){
      $this->conn = $this->getConnection();
	}


  /* Affiliate Info */
  function affiliateinfo($hivefiliate_id){
			$query ="select * from affiliates WHERE id=:id";
			$stmt = $this->conn->prepare($query);
			$stmt->bindValue(':id',$hivefiliate_id);
			$stmt->execute();
			if($stmt->rowCount()==0){return 0;}
			$row = $stmt->fetch(PDO::FETCH_ASSOC);
			return array(
					'id_merchant' => $row['id_merchant'],
					'id_hash' 		=> $row['id_hash'],
					'email' 			=> $row['email'],
					'first_name' 	=> $row['first_name'],
					'last_name' 	=> $row['last_name'],
			);
	}

  /* Merchant Plan */
  function checkplanmerchant($id){
			$query ="select * from merchant WHERE id=:id and date_expiration>='".date('Y-m-d')."'";
			$stmt = $this->conn->prepare($query);
			$stmt->bindValue(':id',$id);
			$stmt->execute();
			return $stmt->rowCount();
	}

  /* Check Existing Visitor */
  function CheckExistVisitor($hivefiliate_id,$hivefiliate_user,$location_type){
      $date = date('Y-m-d');
			$query ="select * from store_visit WHERE id_affiliate=:id_affiliate and id_useragent=:id_useragent and shop=:shop and dateadded='".$date."'";
			$stmt = $this->conn->prepare($query);
			$stmt->bindValue(':id_affiliate',$hivefiliate_id);
      $stmt->bindValue(':id_useragent',$hivefiliate_user);
      $stmt->bindValue(':shop',$location_type);
			$stmt->execute();
			return $stmt->rowCount();
	}


  /* Update Exist Visitor Count */

  function getcurrentvisit($hivefiliate_id,$hivefiliate_user,$location_type){
      $query ="select * from store_visit WHERE id_useragent=:id_useragent and id_affiliate=:id_affiliate and shop=:shop";
      $stmt = $this->conn->prepare($query);
      $stmt->bindValue(':id_affiliate',$hivefiliate_id);
      $stmt->bindValue(':id_useragent',$hivefiliate_user);
      $stmt->bindValue(':shop',$location_type);
      $stmt->execute();
      $row = $stmt->fetch(PDO::FETCH_ASSOC);
      return $row['visit_count']+1;
  }
  function UpdateVisitor($hivefiliate_id,$hivefiliate_user,$location_type){
			$query ="UPDATE store_visit
							SET
							visit_count=:visit_count
							WHERE id_useragent=:id_useragent and id_affiliate=:id_affiliate and shop=:shop";
			$stmt = $this->conn->prepare($query);
      $stmt->bindValue(':id_affiliate',$hivefiliate_id);
      $stmt->bindValue(':id_useragent',$hivefiliate_user);
      $stmt->bindValue(':shop',$location_type);
			$stmt->bindValue(':visit_count',$this->getcurrentvisit($hivefiliate_id,$hivefiliate_user,$location_type));
			if($stmt->execute()){
					return 1;
			}else{
					return 0;
			}
	}


  /* Insert Visitor Agent */
  function InsertVisitor($hivefiliate_id,$location_type){

      $hivefiliate_user = $this->getUserIpAddr();
      $aff              = $this->affiliateinfo($hivefiliate_id);

      if($aff==0){return 0;}  // No exist affiliate
      if($this->checkplanmerchant($aff['id_merchant'])==0){return 0;} // Merchant Expired Plan

      if($this->CheckExistVisitor($hivefiliate_id,$hivefiliate_user,$location_type)>0){
        return $this->UpdateVisitor($hivefiliate_id,$hivefiliate_user,$location_type); // Update if existing Visitor
      }

      $this->conn->query("SET SESSION sql_mode=''");

      $query ="INSERT INTO store_visit
              SET
              id_merchant=:id_merchant,
              id_affiliate=:id_affiliate,
              id_hashaffiliate=:id_hashaffiliate,
              id_useragent=:id_useragent,
              visit_count=:visit_count,
              shop=:shop,
              dateadded=:dateadded";
      $stmt = $this->conn->prepare($query);
      $stmt->bindValue(':id_merchant',$aff['id_merchant']);
      $stmt->bindValue(':id_affiliate',$hivefiliate_id);
      $stmt->bindValue(':id_hashaffiliate',$aff['id_hash']);
      $stmt->bindValue(':id_useragent',$hivefiliate_user);
      $stmt->bindValue(':visit_count','1');
      $stmt->bindValue(':shop',$location_type);
      $stmt->bindValue(':dateadded',date('Y-m-d'));
      if($stmt->execute()){
          return 1;
      }else{
          return 0;
      }
  }

}
$app_visit = new VisitController();
