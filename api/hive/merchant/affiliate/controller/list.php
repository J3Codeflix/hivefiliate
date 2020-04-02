<?php
class Controller extends Database{

	private $paginations;

    public function __construct(){
        $this->conn 		  = $this->getConnection();
        $this->paginations    = new Paginations;
        $this->session        = $this->MerchantSessionHandler();
				$this->entrylist 	  = $this->showEntries('mrc_affiliates');
	}


	/*----------------------------- Earnings, Orders, and Visitor---------------------------------------- */

	function UniqueVisitors($idmrc,$idaff){
		$query ="select * from store_visit WHERE id_merchant='".$idmrc."' and id_affiliate='".$idaff."'";
		$stmt = $this->conn->prepare($query);
		$stmt->execute();
		return $stmt->rowCount();
	}
	function ApprovedOrders($idmrc,$idaff){
		$query ="select * from orders WHERE merchant_id='".$idmrc."' and affiliate_id='".$idaff."' and is_order='is_approved'";
		$stmt = $this->conn->prepare($query);
		$stmt->execute();
		return $stmt->rowCount();
	}
	function PendingOrders($idmrc,$idaff){
		$query ="select * from orders WHERE merchant_id='".$idmrc."' and affiliate_id='".$idaff."' and is_order='is_pending'";
		$stmt = $this->conn->prepare($query);
		$stmt->execute();
		return $stmt->rowCount();
	}
	function PaidEarnings($idmrc,$idaff){
		$query ="select sum(amount) as amount from invoice WHERE id_merchant='".$idmrc."' and id_affiliate='".$idaff."'";
		$stmt = $this->conn->prepare($query);
		$stmt->execute();
		if($stmt->rowCount()==0){return 0;}
		$row = $stmt->fetch(PDO::FETCH_ASSOC);
		return $row['amount'];
	}
	function UnPaidEarnings($idmrc,$idaff){
		$query ="select sum(aff_earnings) as earnings from orders WHERE merchant_id='".$idmrc."' and affiliate_id='".$idaff."' and order_status='Paid' and is_paid=0";
		$stmt = $this->conn->prepare($query);
		$stmt->execute();
		if($stmt->rowCount()==0){return 0;}
		$row = $stmt->fetch(PDO::FETCH_ASSOC);
		return $row['earnings'];
	}

	function TotalEarnings($idmrc,$idaff){
		$query ="select sum(aff_earnings) as earnings from orders WHERE merchant_id='".$idmrc."' and affiliate_id='".$idaff."' and order_status='Paid'";
		$stmt = $this->conn->prepare($query);
		$stmt->execute();
		if($stmt->rowCount()==0){return 0;}
		$row = $stmt->fetch(PDO::FETCH_ASSOC);
		if($row['earnings']==''){return 0;}
		return $row['earnings'];
	}
	function TotalSales($idmrc,$idaff){
		$query ="select sum(order_price) as price from orders WHERE merchant_id='".$idmrc."' and affiliate_id='".$idaff."' and order_status='Paid'";
		$stmt = $this->conn->prepare($query);
		$stmt->execute();
		if($stmt->rowCount()==0){return 0;}
		$row = $stmt->fetch(PDO::FETCH_ASSOC);
		if($row['price']==''){return 0;}
		return $row['price'];
	}

	/*-------------------------- Affiliates List----------------------------------------------- */

  function initList($page_number,$search){

		$entries = $this->entrylist;
		$limit   = $entries['val'];

	    return array(
	    	'entries'                    	 => $entries,
	        'listtable'                  => $this->listtable($page_number,$search,$limit),
	        'paginations'                => $this->paginations->paginations($this->searchfunction($search),$page_number,$limit),
	    );
	}


	function searchfunction($search){

	  $and='';

	  if(!empty($search['keywords'])&&!empty($search['datefrom'])&&!empty($search['dateto'])){
		 $and =" and ((email LIKE '%".$search['keywords']."%' or first_name LIKE '%".$search['keywords']."%' or first_name LIKE '%".$search['keywords']."%')
		 			  or (dateadded between '".$search['datefrom']."' AND '".$search['dateto']."'))";
	  }
	  if(empty($search['keywords'])&&!empty($search['datefrom'])&&!empty($search['dateto'])){
		 $and =" and (dateadded between '".$search['datefrom']."' AND '".$search['dateto']."')";
	  }
	  if(!empty($search['keywords'])&&empty($search['datefrom'])&&empty($search['dateto'])){
		$and =" and (email LIKE '%".$search['keywords']."%' or first_name LIKE '%".$search['keywords']."%' or first_name LIKE '%".$search['keywords']."%')";
	 }

	  $where="WHERE id_merchant='".$this->session."' and status='".$search['status']."' $and";

	  $query ="SELECT * FROM affiliates $where ORDER BY ID desc";
	  return $query;
	}

	function listtable($page_number,$search,$limit){
	  $where  = $this->searchfunction($search);
	  $limitquery  = $this->paginations->limitquery($page_number,$limit);

	  $query="$where $limitquery";
	  $stmt = $this->conn->prepare($query);
	  $stmt->execute();
	  $array = array();

	    foreach ($stmt->fetchAll() as $row) {
	      $array[] = [
	         'id'    							=> $row['id'],
					 'email'   	   				=> $row['email'],
					 'fullname'   	   		=> $row['first_name'].' '.$row['last_name'],
					 'first_name'   	   	=> $row['first_name'],
					 'last_name'   	   		=> $row['last_name'],
					 'unique_visitors'   	=> $this->UniqueVisitors($row['id_merchant'],$row['id']),
					 'approved_orders'   	=> $this->ApprovedOrders($row['id_merchant'],$row['id']),
					 'pending_orders'   	=> $this->PendingOrders($row['id_merchant'],$row['id']),
					 'paid_earnings'   	  => defaultcurr().number_format($this->PaidEarnings($row['id_merchant'],$row['id']),2),
					 'unpaid_earnings'   	=> defaultcurr().number_format($this->UnPaidEarnings($row['id_merchant'],$row['id']),2),
	     ];
	    }
	   return $array;
	}


	/* Details Affiliate Edit */
	function afflinks($mrc,$aff){
			$query ="select * from settings_general WHERE id_merchant='".$mrc."'";
			$stmt = $this->conn->prepare($query);
			$stmt->execute();
			if($stmt->rowCount()==0){
				return '';
			}
			$row = $stmt->fetch(PDO::FETCH_ASSOC);
			return $row['site_address'].'/?aff='.$aff;
	}

	function affdetails($id){
			$query ="select *, DATE_FORMAT(dateadded, '%M %d, %Y') as dateadded from affiliates WHERE id='".$id."'";
			$stmt = $this->conn->prepare($query);
	  	$stmt->execute();
			$row = $stmt->fetch(PDO::FETCH_ASSOC);
			return array(
				'id' 							=> $row['id'],
				'name' 						=> $row['first_name'].' '.$row['last_name'],
				'email' 					=> $row['email'],
				'dateadded' 			=> $row['dateadded'],
				'first_name' 			=> $row['first_name'],
				'last_name' 			=> $row['last_name'],
				'merchant_notes' 	=> $row['merchant_notes'],
				'aff_links' 			=> $this->afflinks($row['id_merchant'],$id),
				'status' 					=> $row['status'],
				'min_payment' 		=> $row['min_payment'],
				'com_percent' 	  => $row['com_percent'],
				'cookie_duration' => $row['cookie_duration'],
				'type_com' 				=> $row['type_com'],
				'flat_rate' 			=> $row['flat_rate'],
				'coupon_code' 		=> $row['coupon_code'],
				'paypal_email' 		=> $row['paypal_email'],
				'type_discount' 	=> $row['type_discount'],
				'amount' 					=> $row['amount'],
				'discount_description' 		=> $row['discount_description'],
			);
	}

	/* Affiliate Payment Hisotry list */

	function initList_PaymentHistory($page_number,$search){

		$entries = $this->entrylist;
		$limit   = $entries['val'];

	    return array(
	    	  'entries'                    => $entries,
	        'listtable'                  => $this->listtable_PaymentHistory($page_number,$search,$limit),
	        'paginations'                => $this->paginations->paginations($this->searchfunction_PaymentHistory($search),$page_number,$limit),
	    );
	}


	function searchfunction_PaymentHistory($search){
	  $and='';
	  if(!empty($search['payment_date'])){
		 $and =" and payment_date='".$search['payment_date']."'";
	  }
	  $where="WHERE id_affiliate='".$search['id']."' $and";
	  $query ="SELECT *, DATE_FORMAT(payment_date, '%m/%d/%Y') as payment_date FROM affiliates_payhistory $where ORDER BY ID desc";
	  return $query;
	}

	function listtable_PaymentHistory($page_number,$search,$limit){
	  $where  = $this->searchfunction_PaymentHistory($search);
	  $limitquery  = $this->paginations->limitquery($page_number,$limit);

	  $query="$where $limitquery";
	  $stmt = $this->conn->prepare($query);
	  $stmt->execute();
	  $array = array();

	    foreach ($stmt->fetchAll() as $row) {
	      $array[] = [
	         'id'    							=> $row['id'],
					 'paid_sum'   	   		=> defaultcurr().number_format($row['paid_sum'],2),
					 'payment_date'   	  => $row['payment_date'],
					 'comments'   	   		=> $row['comments'],
					 'admin_comments'   	=> $row['admin_comments'],
	     ];
	    }
	   return $array;
	}


	/* Affiliate Tab Earnings */
	function AfftabEarnings($id){
		 return array(
			 'unique_visitors'   	=> $this->UniqueVisitors($this->session,$id),
			 'approved_orders'   	=> $this->ApprovedOrders($this->session,$id),
			 'pending_orders'   	=> $this->PendingOrders($this->session,$id),
			 'paid_earnings'   	  => defaultcurr().number_format($this->PaidEarnings($this->session,$id),2),
			 'unpaid_earnings'   	=> defaultcurr().number_format($this->UnPaidEarnings($this->session,$id),2),
			 'total_earnings'   	=> defaultcurr().number_format($this->TotalEarnings($this->session,$id),2),
			 'total_sales'   	  	=> defaultcurr().number_format($this->TotalSales($this->session,$id),2),
			 'total_earnumber'   	=> $this->TotalEarnings($this->session,$id),
		 );
	}


	/* Payment Sent */

	function MerchantPaymentSent($page_number,$search){

		$entries = $this->entrylist;
		$limit   = $entries['val'];

	    return array(
	    	  'entries'                    => $entries,
	        'listtable'                  => $this->tableMerchantPaymentSent($page_number,$search,$limit),
	        'paginations'                => $this->paginations->paginations($this->searchMerchantPaymentSent($search),$page_number,$limit),
	    );
	}


	function searchMerchantPaymentSent($search){
	  $and='';
	  if(!empty($search['payment_date'])){
		 $and =" and payment_date='".$search['payment_date']."'";
	  }
	  $where="WHERE id_merchant='".$this->session."' $and";
	  $query ="SELECT *, DATE_FORMAT(payment_date, '%m/%d/%Y') as payment_date FROM affiliates_payhistory $where ORDER BY ID desc";
	  return $query;
	}

	function affiliateinfo($id){
		$query ="select * from affiliates WHERE id='".$id."'";
		$stmt = $this->conn->prepare($query);
		$stmt->execute();
		return $stmt->fetch(PDO::FETCH_ASSOC);
	}

	function tableMerchantPaymentSent($page_number,$search,$limit){
	  $where  = $this->searchMerchantPaymentSent($search);
	  $limitquery  = $this->paginations->limitquery($page_number,$limit);

	  $query="$where $limitquery";
	  $stmt = $this->conn->prepare($query);
	  $stmt->execute();
	  $array = array();

	    foreach ($stmt->fetchAll() as $row) {

				$aff = $this->affiliateinfo($row['id_affiliate']);


	      $array[] = [
	         'id'    							=> $row['id'],
					 'paid_sum'   	   		=> defaultcurr().number_format($row['paid_sum'],2),
					 'payment_date'   	  => $row['payment_date'],
					 'comments'   	   		=> $row['comments'],
					 'admin_comments'   	=> $row['admin_comments'],
					 'id_aff'    					=> $row['id_affiliate'],
					 'aff_email'    			=> $aff['email'],
					 'aff_name'    			  => $aff['first_name'].' '.$aff['last_name'],
	     ];
	    }
	   return $array;
	}




}

$list = new Controller();
