<?php
class Controller extends Database{

   public function __construct(){
        $this->conn 		 	   = $this->getConnection();
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
			$stmt->bindValue(':is_shown',$arg['is_shown']);
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
		$stmt->bindValue(':is_shown',$arg['is_shown']);
		$stmt->bindValue(':text_description',$arg['text_description']);
		$stmt->bindValue(':dateadded',date('Y-m-d'));
		if($stmt->execute()){return 1;}else{return 0;}

	}

  function getallafiliates(){
    $query="select id from affiliates WHERE id_merchant=:id_merchant and status='is_active'";
    $stmt = $this->conn->prepare( $query );
    $stmt->bindValue(':id_merchant',$this->session);
    $stmt->execute();
    if($stmt->rowCount()==0){return 0;}
    $elements = array();
    foreach($stmt->fetchAll() as $row) {
        $elements[] = $row['id'];
    }
    return implode(',', $elements);

  }
	function AddBannerCategories($arg){
		if(count($arg['affiliate_id'])>0){
      $affiliate_id=implode(',',$arg['affiliate_id']);
    }else{
      if($this->getallafiliates()==0){
        $affiliate_id='';
      }else{
        $affiliate_id=$this->getallafiliates();
      }
    }
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
  function bannerCategoryname($id){
		$query="select * from banner_categories WHERE id=:id";
		$stmt = $this->conn->prepare( $query );
		$stmt->bindValue(':id',$id);
		$stmt->execute();
    if($stmt->rowCount()==0){return '';}
		$row = $stmt->fetch(PDO::FETCH_ASSOC);
    return array(
        'name'=>$row['category_name'],
        'aff'=>$row['affiliate_id'],
    );
	}
	function addBanner($arg){



        if(empty($arg['bann_category'])){
            $banname      ='All';
            $id_affiliate = $this->getallafiliates();


        }else{

          $bann           = $this->bannerCategoryname($arg['bann_category']);
          $banname        = $bann['name'];
          if($bann['aff']==''){
            $id_affiliate = $this->getallafiliates();
          }else{
            $id_affiliate = $bann['aff'];
          }
        }

    		$query ="INSERT INTO  banner
    			SET
    			id_merchant=:id_merchant,
          id_affiliate=:id_affiliate,
    			is_show=:is_show,
    			bann_category=:bann_category,
          category_name=:category_name,
    			url_banner=:url_banner,
    			banner_width=:banner_width,
    			banner_height=:banner_height,
    			note_banner=:note_banner,
    			image=:image,
    			dateadded=:dateadded";
    		$stmt = $this->conn->prepare($query);
    		$stmt->bindValue(':id_merchant',$this->session);
        $stmt->bindValue(':id_affiliate',$id_affiliate);
    		$stmt->bindValue(':is_show',$arg['is_show']);
    		$stmt->bindValue(':bann_category',$arg['bann_category']);
        $stmt->bindValue(':category_name',$banname);
    		$stmt->bindValue(':url_banner',$arg['url_banner']);
    		$stmt->bindValue(':banner_width',$arg['banner_width']);
    		$stmt->bindValue(':banner_height',$arg['banner_height']);
    		$stmt->bindValue(':note_banner',$arg['note_banner']);
    		$stmt->bindValue(':image',$arg['image']);
    		$stmt->bindValue(':dateadded',date('Y-m-d'));
    		if($stmt->execute()){return 1;}else{return 0;}
	}
	function updateBanner($arg){



        if(empty($arg['bann_category'])){
            $banname      ='All';
            $id_affiliate = $this->getallafiliates();
        }else{
          $bann           = $this->bannerCategoryname($arg['bann_category']);
          $banname        = $bann['name'];
          if($bann['aff']==''){
            $id_affiliate = $this->getallafiliates();
          }else{
            $id_affiliate = $bann['aff'];
          }
        }

    		$query ="UPDATE  banner
    			SET
          id_affiliate=:id_affiliate,
    			is_show=:is_show,
    			bann_category=:bann_category,
          category_name=:category_name,
    			url_banner=:url_banner,
    			banner_width=:banner_width,
    			banner_height=:banner_height,
    			note_banner=:note_banner,
    			image=:image
    			WHERE id=:id";
    		$stmt = $this->conn->prepare($query);
        $stmt->bindValue(':id_affiliate',$id_affiliate);
    		$stmt->bindValue(':id',$arg['id']);
    		$stmt->bindValue(':is_show',$arg['is_show']);
    		$stmt->bindValue(':bann_category',$arg['bann_category']);
        $stmt->bindValue(':category_name',$banname);
    		$stmt->bindValue(':url_banner',$arg['url_banner']);
    		$stmt->bindValue(':banner_width',$arg['banner_width']);
    		$stmt->bindValue(':banner_height',$arg['banner_height']);
    		$stmt->bindValue(':note_banner',$arg['note_banner']);
    		$stmt->bindValue(':image',$arg['image']);
    		if($stmt->execute()){return 1;}else{return 0;}


	}


}
$form = new Controller();
