<?php
class Controller extends Database{

	private $paginations;

    public function __construct(){
        $this->conn 		  		= $this->getConnection();
        $this->paginations    = new Paginations;
        $this->session        = $this->MerchantSessionHandler();
				$this->entrylist 	    = $this->showEntries('admin_orders');
				$this->adminsession   = $this->AdminSessionHandler();
	}

	function admindeletepermission(){
		$query="select * from admin_users where id='".$this->adminsession."' and is_delete=1";
		$stmt = $this->conn->prepare($query);
		$stmt->execute();
		return $stmt->rowCount();
	}

  function initList($page_number,$search){

		$entries = $this->entrylist;
		$limit   = $entries['val'];

    return array(
			  'store'								=> $this->allmerchant(),
				'affiliate'						=> $this->allaffiliates(),
    	  'entries'             => $entries,
        'listtable'           => $this->listtable($page_number,$search,$limit),
        'paginations'         => $this->paginations->paginations($this->searchfunction($search),$page_number,$limit),
    );
	}

	function allmerchant(){
		$query ="select id,email,store_name from merchant WHERE is_deleted=0";
		$stmt = $this->conn->prepare($query);
		$stmt->execute();
		$array = array();

    foreach ($stmt->fetchAll() as $row) {
      $array[] = [
         'key'    							=> $row['id'],
				 'value'    						=> $row['id'],
				 'text'    							=> '(ID:'.$row['id'].') - ('.$row['store_name'].' - '.$row['email'].')',
     ];
    }
	  return $array;
	}
	function allaffiliates(){
		$query ="select id,email,first_name,last_name from affiliates WHERE is_deleted=0";
		$stmt = $this->conn->prepare($query);
		$stmt->execute();
		$array = array();
    foreach ($stmt->fetchAll() as $row) {
      $array[] = [
         'key'    							=> $row['id'],
				 'value'    						=> $row['id'],
				 'text'    							=> '(ID:'.$row['id'].') - ('.$row['first_name'].' '.$row['last_name'].' - '.$row['email'].')',
     ];
    }
	  return $array;
	}




	function searchfunction($search){

		$where='';
	  if(!empty($search['search_keywords'])){
			if($search['search_field']==1){
				$where =" WHERE merchant_id='".$search['search_keywords']."'";
			}
			if($search['search_field']==2){
				$where =" WHERE affiliate_id='".$search['search_keywords']."'";
			}
			if($search['search_field']==3){
				$where =" WHERE order_id='".$search['search_keywords']."'";
			}
			if($search['search_field']==4){
				$where =" WHERE order_status='".$search['search_keywords']."'";
			}
			if($search['search_field']==5){
				$where =" WHERE tracking_method='".$search['search_keywords']."'";
			}
			if($search['search_field']==6){
				$where =" WHERE date_order='".$search['search_keywords']."'";
			}
	  }

  $query ="SELECT *,
		DATE_FORMAT(date_order, '%b %d, %Y') as date_order
		FROM orders $where ORDER BY id desc";
    return $query;
  }

	/* Order Status */
	function orderstatus($status){
		if($status=='Paid'){
			$status='<div className="icon_green"><i className="dot circle icon"></i>'.$status.'</div>';
		}else if($status=='Not paid'){
			$status='<div className="icon_red"><i className="dot circle icon"></i>'.$status.'</div>';
		}else if($status=='Incomplete'){
			$status='<div className="icon_warning"><i className="dot circle icon"></i>'.$status.'</div>';
		}else if($status=='Cancelled'){
			$status='<div className="icon_red"><i className="dot circle icon"></i>'.$status.'</div>';
		}else if($status=='Refunded'){
			$status='<div className="icon_warning"><i className="dot circle icon"></i>'.$status.'</div>';
		}else if($status=='Hidden'){
			$status='<div className="icon_warning"><i className="dot circle icon"></i>'.$status.'</div>';
		}else{
			$status='';
		}
		return $status;
	}

	/* Is Order */
	function isorderstatus($status){
		if($status=='is_approved'){
			$status='<div className="icon_green"><i className="dot circle icon"></i>Approved</div>';
		}else if($status=='is_denied'){
			$status='<div className="icon_red"><i className="dot circle icon"></i>Denied</div>';
		}else if($status=='is_pending'){
			$status='<div className="icon_warning"><i className="dot circle icon"></i>Pending</div>';
		}else{
			$status='';
		}
		return $status;
	}

	function tracking($track){
		if($track=='Tracking by link'){
			$traking ='<div className="ui teal horizontal label">'.$track.'</div>';
		}else if($track=='Tracking by code'){
			$traking ='<div className="ui blue horizontal label">'.$track.'</div>';
		}else if($track=='Tracking by qr'){
			$traking ='<div className="ui olive horizontal label">'.$track.'</div>';
		}else if($track=='Tracking by sku'){
			$traking ='<div className="ui purple horizontal label">'.$track.'</div>';
		}else if($track=='Tracking by email'){
			$traking ='<div className="ui orange horizontal label">'.$track.'</div>';
		}else{
			$traking ='';
		}
		return $traking;
	}



  /* Merchant Store */
	function merchantstore($id){
		$query ="select * from merchant WHERE id='".$id."'";
		$stmt = $this->conn->prepare($query);
		$stmt->execute();
		return $stmt->fetch(PDO::FETCH_ASSOC);
	}

	/* Affiliate */
	function affiliates($id){
		$query ="select * from affiliates WHERE id='".$id."'";
		$stmt = $this->conn->prepare($query);
		$stmt->execute();
		return $stmt->fetch(PDO::FETCH_ASSOC);
	}


	function listtable($page_number,$search,$limit){
	  $where  = $this->searchfunction($search);
	  $limitquery  = $this->paginations->limitquery($page_number,$limit);

	  $query="$where $limitquery";
	  $stmt = $this->conn->prepare($query);
	  $stmt->execute();
	  $array = array();

    foreach ($stmt->fetchAll() as $row) {

			$merchant 							= $this->merchantstore($row['merchant_id']);
			$aff 										= $this->affiliates($row['affiliate_id']);
			$orderstatus  					= $this->orderstatus($row['order_status']);
			$isorder 		  					= $this->isorderstatus($row['is_order']);


      $array[] = [
         'id'    							=> $row['id'],
				 'store'    					=> $merchant['store_name'],
				 'store_email'     		=> $merchant['email'],
				 'aff_name'     			=> $aff['first_name'].' '.$aff['last_name'],
				 'aff_email'    			=> $aff['email'],
				 'id_merchant'    		=> $row['id_merchant'],
				 'order_id'    				=> $row['order_id'],
				 'tracking_label'    	=> $this->tracking($row['tracking_method']),
				 'tracking_method'    => $row['tracking_method'],
				 'order_price'    		=> defaultcurr().number_format($row['order_price'],2),
				 'aff_earnings'    		=> defaultcurr().number_format($row['aff_earnings'],2),
				 'order_status'    		=> $orderstatus,
				 'is_order'    				=> $isorder,
				 'is_orderstat'    		=> $row['is_order'],
				 'date_order'    			=> $row['date_order'],
				 'action_delete'  		=> $this->admindeletepermission(),
				 'details'    				=> array(
					 'is_order'    					=> $row['is_order'],
					 'merchant_id'    			=> $row['merchant_id'],
					 'affiliate_id'    			=> $row['affiliate_id'],
					 'order_id'    					=> $row['order_id'],
					 'tracking_method'    	=> $row['tracking_method'],
					 'order_price'    			=> $row['order_price'],
					 'aff_earnings'    			=> $row['aff_earnings'],
					 'date_order'    				=> $row['date_order'],
					 'order_status'    			=> $row['order_status'],
					 'landing_page'    			=> $row['landing_page'],
					 'referal_page'    			=> $row['referal_page'],
					 'notes'    						=> $row['notes'],
					 'location_type'    		=> $row['location_type'],
				 ),
     ];
    }
	  return $array;
	}

	function InfoAffiliates($id){
			$query ="select * from affiliates WHERE id='".$id."'";
			$stmt = $this->conn->prepare($query);
			$stmt->execute();
			$row = $stmt->fetch(PDO::FETCH_ASSOC);
			return array(
				'com_percent'   	   			=> $row['com_percent'],
			);
	}
}

$list = new Controller();
