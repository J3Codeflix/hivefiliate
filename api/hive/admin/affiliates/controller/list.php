<?php
class Controller extends Database{

	private $paginations;

    public function __construct(){
        $this->conn 		  		= $this->getConnection();
        $this->paginations    = new Paginations;
        $this->session        = $this->MerchantSessionHandler();
				$this->entrylist 	    = $this->showEntries('admin_affiliates');
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
			  'merchant'						=> $this->allmerchant(),
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

	function searchfunction($search){
		$and='';
	  if(!empty($search['search_keywords'])){
			if($search['search_field']==1){
				$and =" and id_merchant='".$search['search_keywords']."'";
			}
			if($search['search_field']==2){
				$and =" and (first_name LIKE '%".$search['search_keywords']."%' or last_name LIKE '%".$search['search_keywords']."%')";
			}
			if($search['search_field']==3){
				$and =" and email='".$search['email']."'";
			}
			if($search['search_field']==4){
				$and =" and status='".$search['search_keywords']."'";
			}
	  }

		$where="WHERE is_deleted='".$search['is_deleted']."' $and";
	  $query ="SELECT *,
			DATE_FORMAT(dateadded, '%b %d, %Y') as dateadded
			FROM affiliates $where ORDER BY id desc";
	  return $query;
	}


	/* Affiliate Status */
	function affiliatestatus($status){
		if($status=='is_active'){
			$status='<div className="icon_green"><i className="dot circle icon"></i>Active</div>';
		}else if($status=='is_pending'){
			$status='<div className="icon_warning"><i className="dot circle icon"></i>Pending</div>';
		}else if($status=='is_denied'){
			$status='<div className="icon_red"><i className="dot circle icon"></i>Denied</div>';
		}else if($status=='is_block'){
			$status='<div className="icon_red"><i className="dot circle icon"></i>Block</div>';
		}else{
			$status='<div className="icon_red"><i className="dot circle icon"></i>Deleted</div>';
		}
		return $status;
	}
  /* Affiliate Store */
	function affiliatestore($id){
		$query ="select * from merchant WHERE id='".$id."'";
		$stmt = $this->conn->prepare($query);
		$stmt->execute();
		return $stmt->fetch(PDO::FETCH_ASSOC);
	}

	/* Paid Earnings */
	function paidEarnings($id,$aff){
		$query ="select *,sum(aff_earnings) as earnings from orders WHERE affiliate_id='".$aff."' and merchant_id='".$id."' and is_paid=1";
		$stmt = $this->conn->prepare($query);
		$stmt->execute();
		if($stmt->rowCount()==0){return 0;}
		$row = $stmt->fetch(PDO::FETCH_ASSOC);
		return $row['earnings'];
	}


	/* Unpaid Earnings */
	function unpaidEarnings($id,$aff){
		$query ="select *,sum(aff_earnings) as earnings from orders WHERE affiliate_id='".$aff."' and merchant_id='".$id."' and is_paid=0";
		$stmt = $this->conn->prepare($query);
		$stmt->execute();
		if($stmt->rowCount()==0){return 0;}
		$row = $stmt->fetch(PDO::FETCH_ASSOC);
		return $row['earnings'];
	}

	/* Visitor */
	function Visitor($id,$aff){
		$query ="select * from store_visit WHERE id_affiliate='".$aff."' and id_merchant='".$id."'";
		$stmt = $this->conn->prepare($query);
		$stmt->execute();
		return $stmt->rowCount();
	}

	/* Approved Orders */
	function ApprovedOrders($id,$aff){
		$query ="select * from orders WHERE affiliate_id='".$aff."' and merchant_id='".$id."' and order_status='Paid'";
		$stmt = $this->conn->prepare($query);
		$stmt->execute();
		return $stmt->rowCount();
	}

	/* Pending Orders */
	function PendingOrders($id,$aff){
		$query ="select * from orders WHERE affiliate_id='".$aff."' and merchant_id='".$id."' and order_status='Pending'";
		$stmt = $this->conn->prepare($query);
		$stmt->execute();
		return $stmt->rowCount();
	}




	function listtable($page_number,$search,$limit){
	  $where  = $this->searchfunction($search);
	  $limitquery  = $this->paginations->limitquery($page_number,$limit);

	  $query="$where $limitquery";
	  $stmt = $this->conn->prepare($query);
	  $stmt->execute();
	  $array = array();

    foreach ($stmt->fetchAll() as $row) {

			$merchant 		= $this->affiliatestore($row['id_merchant']);
			$paidearn 		= $this->paidEarnings($row['id_merchant'],$row['id']);
			$unpaidearn 	= $this->unpaidEarnings($row['id_merchant'],$row['id']);


      $array[] = [
         'id'    							=> $row['id'],
				 'id_merchant'    		=> $row['id_merchant'],
				 'store'    					=> $merchant['store_name'],
				 'store_email'    	  => $merchant['email'],
				 'email'   	   				=> $row['email'],
				 'status'   	   			=> $this->affiliatestatus($row['status']),
				 'first_name'   	   	=> $row['first_name'],
				 'last_name'   	   		=> $row['last_name'],
				 'name'   	   				=> $row['first_name'].' '.$row['last_name'],
				 'dateadded'   	   	  => $row['dateadded'],
				 'visitor'   	   	  	=> $this->Visitor($row['id_merchant'],$row['id']),
				 'approved_orders'   	=> $this->ApprovedOrders($row['id_merchant'],$row['id']),
				 'pending_orders'   	=> $this->PendingOrders($row['id_merchant'],$row['id']),
				 'paid_earnings'   	  => defaultcurr().number_format($paidearn,2),
				 'unpaid_earnings'   	=> defaultcurr().number_format($unpaidearn,2),
				 'action_delete'  		=> $this->admindeletepermission()
     ];
    }
	  return $array;
	}
}

$list = new Controller();
