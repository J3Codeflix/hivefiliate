<?php
class Controller extends Database{

	private $paginations;

    public function __construct(){
        $this->conn 		  		= $this->getConnection();
        $this->paginations    = new Paginations;
        $this->session        = $this->AffiliateSessionHandler();
				$this->entrylist 	  	= $this->showEntries('mrc_affiliates');
	}

	function idmerchant(){
				$query ="select * from affiliates WHERE id='".$this->session."'";
				$stmt = $this->conn->prepare($query);
				$stmt->execute();
				if($stmt->rowCount()==0){return 0;}
				$row = $stmt->fetch(PDO::FETCH_ASSOC);
				return $row['id_merchant'];
	}

	/* List of Banners */
  function bannecategoryname($id){
				$query ="select * from banner_categories WHERE id='".$id."'";
				$stmt = $this->conn->prepare($query);
				$stmt->execute();
				$row = $stmt->fetch(PDO::FETCH_ASSOC);
				return $row['category_name'];
	}


	function bannerSettings(){
				$query ="select * from banner_setting WHERE merchant_id='".$this->idmerchant()."' and is_shown='true'";
				$stmt = $this->conn->prepare($query);
				$stmt->execute();
				if($stmt->rowCount()==0){return 0;}
				$row = $stmt->fetch(PDO::FETCH_ASSOC);
				if($row['text_description']==''||$row['is_shown']=='false'){return 0;}
				return $row['text_description'];
	}


	function listngBanners(){
			 $query ="select *, DATE_FORMAT(dateadded, '%M %d, %Y') as dateadded from banner WHERE is_show='true' and FIND_IN_SET('".$this->session."', id_affiliate) order by id desc";
			 $stmt = $this->conn->prepare($query);
			 $stmt->execute();
			 $array = array();
			 foreach ($stmt->fetchAll() as $row) {
				 $array[] = [
						'id'    									=> $row['id'],
						'name'    								=> $row['image'],
						'id_merchant'    					=> $row['id_merchant'],
						'is_show'    							=> $row['is_show'],
						'bann_catname'    				=> $this->bannecategoryname($row['bann_category']),
						'bann_category'    				=> $row['bann_category'],
						'url_banner'    					=> $row['url_banner'],
						'banner_width'    				=> $row['banner_width'],
						'banner_height'    				=> $row['banner_height'],
						'note_banner'    					=> $row['note_banner'],
						'image'    								=> baseurluploads($row['image']),
						'dimension'    						=> $row['banner_width'].'x'.$row['banner_height'],
						'dateadded'    						=> $row['dateadded']
				];
			 }
			return $array;
	}

	function listofBanners(){
		  return array(
				'list'=> $this->listngBanners(),
				'settings'=> $this->bannerSettings(),
			);
	}



}

$list = new Controller();
