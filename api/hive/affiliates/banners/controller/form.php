<?php
class Controller extends Database{

   public function __construct(){
          $this->conn 		 	 = $this->getConnection();
		      $this->session        	 = $this->MerchantSessionHandler();
		      $this->merchant          = $this->MerchantData();
	 }


	function ispresent(){
		     $query="select * from banner_setting WHERE merchant_id=:merchant_id";
		     $stmt = $this->conn->prepare( $query );
		     $stmt->bindValue(':merchant_id',$this->session);
		     $stmt->execute();
		     return $stmt->rowCount();
	}

	function SaveOrder($arg){
		$this->conn->query("SET SESSION sql_mode=''");
		if($this->ispresent()>0){
			$query ="UPDATE  banner_setting
				SET
				is_shown=:is_shown,
				text_description=:text_description
				WHERE merchant_id=:merchant_id";
			$stmt = $this->conn->prepare($query);
			$stmt->bindValue(':merchant_id',$this->session);
			$stmt->bindValue(':is_shown',boleanfalse($arg['is_shown']));
			$stmt->bindValue(':text_description',$arg['text_description']);
			if($stmt->execute()){return 1;}else{return 0;}
		}

		$query ="INSERT INTO  banner_setting
			SET
			merchant_id=:merchant_id,
			is_shown=:is_shown,
			text_description=:text_description,
			dateadded=:dateadded";
		$stmt = $this->conn->prepare($query);
		$stmt->bindValue(':merchant_id',$this->session);
		$stmt->bindValue(':is_shown',boleanfalse($arg['is_shown']));
		$stmt->bindValue(':text_description',$arg['text_description']);
		$stmt->bindValue(':dateadded',date('Y-m-d'));
		if($stmt->execute()){return 1;}else{return 0;}

	}


	function AddBannerCategories($arg){
  		if(count($arg['affiliate_id'])>0){$affiliate_id=implode(',',$arg['affiliate_id']);}else{$affiliate_id='';}
  		$query ="INSERT INTO  banner_categories
  			SET
  			id_merchant=:id_merchant,
  			category_name=:category_name,
  			affiliate_id=:affiliate_id,
  			dateadded=:dateadded";
  		$stmt = $this->conn->prepare($query);
  		$stmt->bindValue(':id_merchant',$this->session);
  		$stmt->bindValue(':category_name',$arg['category_name']);
  		$stmt->bindValue(':affiliate_id',$affiliate_id);
  		$stmt->bindValue(':dateadded',date('Y-m-d'));
  		if($stmt->execute()){return 1;}else{return 0;}
	}


	/* Add Banner */
	function checkfilename($image){
  		$query="select * from banner WHERE image=:image";
  		$stmt = $this->conn->prepare( $query );
  		$stmt->bindValue(':image',$image);
  		$stmt->execute();
  		return $stmt->rowCount();
	}
	function addBanner($arg){

  		$query ="INSERT INTO  banner
  			SET
  			id_merchant=:id_merchant,
  			is_show=:is_show,
  			bann_category=:bann_category,
  			url_banner=:url_banner,
  			banner_width=:banner_width,
  			banner_height=:banner_height,
  			note_banner=:note_banner,
  			image=:image,
  			dateadded=:dateadded";
  		$stmt = $this->conn->prepare($query);
  		$stmt->bindValue(':id_merchant',$this->session);
  		$stmt->bindValue(':is_show',$arg['is_show']);
  		$stmt->bindValue(':bann_category',$arg['bann_category']);
  		$stmt->bindValue(':url_banner',$arg['url_banner']);
  		$stmt->bindValue(':banner_width',$arg['banner_width']);
  		$stmt->bindValue(':banner_height',$arg['banner_height']);
  		$stmt->bindValue(':note_banner',$arg['note_banner']);
  		$stmt->bindValue(':image',$arg['image']);
  		$stmt->bindValue(':dateadded',date('Y-m-d'));
  		if($stmt->execute()){return 1;}else{return 0;}

	}

	function updateBanner($arg){

  		$query ="UPDATE  banner
  			SET
  			is_show=:is_show,
  			bann_category=:bann_category,
  			url_banner=:url_banner,
  			banner_width=:banner_width,
  			banner_height=:banner_height,
  			note_banner=:note_banner,
  			image=:image
  			WHERE id=:id";
  		$stmt = $this->conn->prepare($query);
  		$stmt->bindValue(':id',$arg['id']);
  		$stmt->bindValue(':is_show',$arg['is_show']);
  		$stmt->bindValue(':bann_category',$arg['bann_category']);
  		$stmt->bindValue(':url_banner',$arg['url_banner']);
  		$stmt->bindValue(':banner_width',$arg['banner_width']);
  		$stmt->bindValue(':banner_height',$arg['banner_height']);
  		$stmt->bindValue(':note_banner',$arg['note_banner']);
  		$stmt->bindValue(':image',$arg['image']);
  		if($stmt->execute()){return 1;}else{return 0;}

	}


}
$form = new Controller();
