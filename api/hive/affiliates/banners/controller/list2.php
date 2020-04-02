<?php
class Controller extends Database{

	private $paginations;

    public function __construct(){
        $this->conn 		  		= $this->getConnection();
        $this->paginations    = new Paginations;
        $this->session        = $this->MerchantSessionHandler();
				$this->entrylist 	  	= $this->showEntries('mrc_affiliates');
	}



	/* Order List */

    function initList($page_number,$search){

		$entries = $this->entrylist;
		$limit   = $entries['val'];

	    return array(
	    	'entries'                    => $entries,
	        'listtable'                  => $this->listtable($page_number,$search,$limit),
	        'paginations'                => $this->paginations->paginations($this->searchfunction($search),$page_number,$limit),
	    );
	}


	function searchfunction($search){

	  $order_id						='';
	  $affiliate_id				='';
	  $tracking_method		='';
	  $order_status				='';
	  $date_order					='';
	  $and								='';

	  if(!empty($search['order_id'])){ 			$order_id=" or order_id='".$search['order_id']."'";}
	  if(!empty($search['affiliate_id'])){ 		$affiliate_id=" or affiliate_id='".$search['affiliate_id']."'";}
	  if(!empty($search['tracking_method'])){ 	$tracking_method=" or tracking_method='".$search['tracking_method']."'";}
	  if(!empty($search['order_status'])){ 		$order_status=" or order_status='".$search['order_status']."'";}
	  if(!empty($search['date_from'])&&!empty($search['date_to'])){
		  $date_order=" or (date_order between '".$search['date_from']."' AND '".$search['date_to']."')";
	}

	  if(!empty($search['order_id'])){
		    $and =" and (order_id='".$search['order_id']."' $affiliate_id $tracking_method  $order_status $date_order)";
	  }else if(!empty($search['affiliate_id'])){
		 	  $and =" and (affiliate_id='".$search['affiliate_id']."' $order_id $tracking_method  $order_status $date_order)";
	  }
	  else if(!empty($search['tracking_method'])){
				$and =" and (tracking_method='".$search['tracking_method']."' $order_id $affiliate_id  $order_status $date_order)";
	  }
	  else if(!empty($search['order_status'])){
		   	$and =" and (order_status='".$search['order_status']."' $order_id $affiliate_id  $tracking_method $date_order)";
	  }
	  else if(!empty($search['date_order'])){
		   	$and =" and ((date_order between '".$search['date_from']."' AND '".$search['date_to']."') $order_id $affiliate_id  $tracking_method $order_status)";
	  }

	  $where="WHERE merchant_id='".$this->session."' and is_order='".$search['is_order']."' $and";
	  $query ="SELECT *, DATE_FORMAT(date_order, '%b %d, %Y') as date_order  FROM orders $where ORDER BY id desc";
	  return $query;
	}

	function affiliateinfo($id){
			$query ="select * from affiliates WHERE id='".$id."'";
			$stmt = $this->conn->prepare($query);
	  	$stmt->execute();
			$row = $stmt->fetch(PDO::FETCH_ASSOC);
			return $row;
	}

	function listtable($page_number,$search,$limit){
	  	$where  = $this->searchfunction($search);
	  	$limitquery  = $this->paginations->limitquery($page_number,$limit);

	  	$query="$where $limitquery";
	  	$stmt = $this->conn->prepare($query);
	  	$stmt->execute();
	  	$array = array();

	    foreach ($stmt->fetchAll() as $row) {

		  $aff = $this->affiliateinfo($row['affiliate_id']);


		  if($row['order_status']=='Paid'){
			  $statuscolor = 'positive';
		  }else if($row['order_status']=='Not paid'||$row['order_status']=='Cancelled'){
			  $statuscolor = 'negative';
		  }else{
			  $statuscolor = 'warning';
		  }

	      $array[] = [
	         'id'    						=> $row['id'],
			 'affiliate_id'   	   			=> $row['affiliate_id'],
			 'name'   	   					=> $aff['first_name'].' '.$aff['last_name'].' (ID: '.$row['affiliate_id'].')',
			 'order_id'   	   				=> $row['order_id'],
			 'tracking_method'   	   		=> $row['tracking_method'],
			 'order_price'   	   			=> defaultcurr().number_format($row['order_price'],2),
			 'aff_earnings'   	   			=> defaultcurr().number_format($row['aff_earnings'],2),
			 'date_order'   	   			=> $row['date_order'],
			 'order_status'   	   			=> $row['order_status'],
			 'landing_page'   	   			=> $row['landing_page'],
			 'referal_page'   	   			=> $row['referal_page'],
			 'notes'   	   					=> $row['notes'],
			 'statcolor'   	   				=> $statuscolor,
	     ];
	    }
	   return $array;
	}



	function getbannersettings(){
			$query ="select * from banner_setting WHERE merchant_id='".$this->session."'";
			$stmt = $this->conn->prepare($query);
			$stmt->execute();
			if($stmt->rowCount()==0){return 0;}
			$row = $stmt->fetch(PDO::FETCH_ASSOC);
			return array(
				'id'    						=> $row['id'],
				'is_shown'   	   				=> $row['is_shown'],
				'text_description'   	   		=> $row['text_description'],
			);
	}

	function getaffiliateslist(){

		$query ="select * from affiliates WHERE id_merchant='".$this->session."'";
		$stmt = $this->conn->prepare($query);
		$stmt->execute();
		$array = array();
	    foreach ($stmt->fetchAll() as $row) {
	      $array[] = [
			 'key'    						=> $row['id'],
			 'text'    						=> $row['email'].' (ID:'.$row['id'].')',
			 'value'    					=> $row['id'],
	     ];
	    }
	   return $array;
	}


	/* List of categories banner */

	function nameofaffiliate($id){
		$query ="select email,id from affiliates WHERE id_merchant='".$this->session."' and id='".$id."'";
		$stmt = $this->conn->prepare($query);
		$stmt->execute();
		return $stmt->fetch(PDO::FETCH_ASSOC);
	}

	function arrayaffiliate($arg){
		if(count($arg)>0){
			$array = array();
			$datarray=explode(',',$arg);
			foreach ($datarray as $data) {
				if($data!=''){
					$aff = $this->nameofaffiliate($data);
					$array[] = '<div>'.$aff['email'].' (ID: '.$aff['id'].')</div>';
				}
			}
			return implode("", $array);
		}else{
			return '';
		}
	}

	function getbannercategorieslist(){
		$query ="select * from banner_categories WHERE id_merchant='".$this->session."'";
		$stmt = $this->conn->prepare($query);
		$stmt->execute();
		$array = array();
	    foreach ($stmt->fetchAll() as $row) {
		  $affvisible='Visible to all';
		  if($this->arrayaffiliate($row['affiliate_id'])!=''){
			$affvisible=$this->arrayaffiliate($row['affiliate_id']);
		  }
	      $array[] = [
			 'id'    						=> $row['id'],
			 'category_name'    			=> $row['category_name'],
			 'affiliate_id'    				=> $affvisible,
	     ];
	    }
	   return $array;
	}

	function getcategory(){
		$query ="select * from banner_categories WHERE id_merchant='".$this->session."'";
		$stmt = $this->conn->prepare($query);
		$stmt->execute();
		$array = array();
	    foreach ($stmt->fetchAll() as $row) {
	      $array[] = [
			 'key'    						=> $row['id'],
			 'text'    						=> $row['category_name'],
			 'value'    					=> $row['id'],
	     ];
	    }
	   return $array;
	}

	/* List of Banners */
  function bannecategoryname($id){
				$query ="select * from banner_categories WHERE id='".$id."'";
				$stmt = $this->conn->prepare($query);
				$stmt->execute();
				$row = $stmt->fetch(PDO::FETCH_ASSOC);
				return $row['category_name'];
	}
	function bannerSettings($id){
				$query ="select * from banner_setting WHERE merchant_id='".$id."'";
				$stmt = $this->conn->prepare($query);
				$stmt->execute();
				if($stmt->rowCount()==0){return 0;}
				$row = $stmt->fetch(PDO::FETCH_ASSOC);
				if($row['text_description']==''||$row['is_shown']=='false'){return 0;}
				return $row['text_description'];
	}

	function listofBanners(){
		$query ="select *, DATE_FORMAT(dateadded, '%M %d, %Y') as dateadded from banner WHERE id_merchant='".$this->session."' order by id desc";
		$stmt = $this->conn->prepare($query);
		$stmt->execute();
		$array = array();
	    foreach ($stmt->fetchAll() as $row) {
	      $array[] = [
			 'id'    									=> $row['id'],
			 'name'    								=> $row['image'],
			 'id_merchant'    				=> $row['id_merchant'],
			 'is_show'    						=> $row['is_show'],
			 'bann_catname'    				=> $this->bannecategoryname($row['bann_category']),
			 'bann_category'    			=> $row['bann_category'],
			 'url_banner'    					=> $row['url_banner'],
			 'banner_width'    				=> $row['banner_width'],
			 'banner_height'    			=> $row['banner_height'],
			 'note_banner'    				=> $row['note_banner'],
			 'image'    							=> baseurluploads($row['image']),
			 'dimension'    					=> $row['banner_width'].'x'.$row['banner_height'],
			 'dateadded'    					=> $row['dateadded'],
			 'banner_message'    			=> $this->bannerSettings($row['id_merchant']),
	     ];
	    }
	   return $array;
	}


}

$list = new Controller();
