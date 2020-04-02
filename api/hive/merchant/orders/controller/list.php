<?php
class Controller extends Database{

	private $paginations;

    public function __construct(){
        $this->conn 		  = $this->getConnection();
        $this->paginations    = new Paginations;
        $this->session        = $this->MerchantSessionHandler();
				$this->entrylist 	  = $this->showEntries('mrc_affiliates');
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

	  if(!empty($search['order_id'])){ 						$order_id=" or order_id='".$search['order_id']."'";}
	  if(!empty($search['affiliate_id'])){ 				$affiliate_id=" or affiliate_id='".$search['affiliate_id']."'";}
	  if(!empty($search['tracking_method'])){ 		$tracking_method=" or tracking_method='".$search['tracking_method']."'";}
	  if(!empty($search['order_status'])){ 				$order_status=" or order_status='".$search['order_status']."'";}

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
		  }else if($row['order_status']=='Pending'||$row['order_status']=='Cancelled'){
			  $statuscolor = 'negative';
		  }else{
			  $statuscolor = 'warning';
		  }


			$creditaff = $aff['first_name'].' '.$aff['last_name'].' (ID: '.$row['affiliate_id'].')';

			if($row['affiliate_id']==0){
				$creditaff ='No Affiliate';
			}

	      $array[] = [
			     'id'    								=> $row['id'],
					 'affiliate_id'   	   			=> $row['affiliate_id'],
					 'name'   	   							=> $creditaff,
					 'order_id'   	   					=> $row['order_id'],
					 'tracking_method'   	   		=> $row['tracking_method'],
					 'order_price'   	   				=> defaultcurr().number_format($row['order_price'],2),
					 'aff_earnings'   	   			=> defaultcurr().number_format($row['aff_earnings'],2),
					 'date_order'   	   				=> $row['date_order'],
					 'order_status'   	   			=> $row['order_status'],
					 'landing_page'   	   			=> $row['landing_page'],
					 'referal_page'   	   			=> $row['referal_page'],
					 'notes'   	   							=> $row['notes'],
					 'statcolor'   	   				  => $statuscolor,
	     ];
	    }
	   return $array;
	}



	function getorderdetails($id){
		$query ="select * from orders WHERE id='".$id."'";
		$stmt = $this->conn->prepare($query);
	  	$stmt->execute();
		$row = $stmt->fetch(PDO::FETCH_ASSOC);
		return array(
			'id'    									=> $row['id'],
			'affiliate_id'   	   			=> $row['affiliate_id'],
			'order_id'   	   					=> $row['order_id'],
			'tracking_method'   	   	=> $row['tracking_method'],
			'order_price'   	   			=> $row['order_price'],
			'aff_earnings'   	   			=> $row['aff_earnings'],
			'date_order'   	   				=> $row['date_order'],
			'order_status'   	   			=> $row['order_status'],
			'landing_page'   	   			=> $row['landing_page'],
			'referal_page'   	   			=> $row['referal_page'],
			'notes'   	   					  => $row['notes'],
			'location_type'   	   		=> $row['location_type'],
			'ip_address'   	   				=> $row['ip_address'],
			'device_type'   	   			=> $row['device_type'],
			'order_type'   	   				=> $row['order_type'],
			'is_paid'   	   					=> $row['is_paid'],
		);

	}

	/* Get Info Affiliates */
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
