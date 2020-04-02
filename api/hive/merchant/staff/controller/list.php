<?php
class Controller extends Database{

	private $paginations;

    public function __construct(){
        $this->conn 		  = $this->getConnection();
        $this->paginations    = new Paginations;
        $this->session        = $this->MerchantSessionHandler();
				$this->entrylist 	    = $this->showEntries('mrc_affiliates');
	}



	/* Affiliates List */

  function initList($page_number,$search){
		$entries = $this->entrylist;
		$limit   = $entries['val'];
	    return array(
	    		'entries'                    => $entries,
	        'listtable'                  => $this->listtable($page_number,$search,$limit),
	        'paginations'                => $this->paginations->paginations($this->searchfunction($search),$page_number,$limit),
					'merchant'                   => $this->getmerchantaccount(),
	    );
	}

  function getmerchantaccount(){
			$query ="select * from merchant WHERE id='".$this->session."'";
			$stmt = $this->conn->prepare($query);
			$stmt->execute();
			if($stmt->rowCount()==0){return 0;}
			$row = $stmt->fetch(PDO::FETCH_ASSOC);
			return array(
				'hash_staff'=> $row['hash_staff']
			);
	}

	function searchfunction($search){
	  $and='';
	  if(!empty($search['keywords'])){
		$and =" and (email LIKE '%".$search['keywords']."%' or first_name LIKE '%".$search['keywords']."%' or first_name LIKE '%".$search['keywords']."%')";
	 }

	  $where="WHERE id_merchant='".$this->session."' $and";

	  $query ="SELECT * FROM staff $where ORDER BY ID desc";
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

				$last_logdate = '';
				if($row['last_logdate']!='0000-00-00'){
					$last_logdate = $row['last_logdate'].' '.$row['last_logtime'];
				}

	      $array[] = [
	         'id'    							=> $row['id'],
					 'email'   	   				=> $row['email'],
					 'fullname'   	   		=> $row['first_name'].' '.$row['last_name'],
					 'first_name'   	   	=> $row['first_name'],
					 'last_name'   	   		=> $row['last_name'],
					 'last_log'   	   		=> $last_logdate,
					 'view_log'   	   		=> '',
					 'dash_view'   	   		=> $row['dash_view'],
					 'aff_view'   	   		=> $row['aff_view'],
					 'aff_edit'   	   		=> $row['aff_edit'],
					 'aff_pay'   	   			=> $row['aff_pay'],
					 'aff_delete'   	   	=> $row['aff_delete'],
					 'order_view'   	   	=> $row['order_view'],
					 'order_edit'   	   	=> $row['order_edit'],
					 'bann_view'   	   		=> $row['bann_view'],
					 'bann_edit'   	   		=> $row['bann_edit'],
					 'bann_delete'   	   	=> $row['bann_delete'],
	     ];
	    }
	   return $array;
	}


	/* Details Staff Edit */

	function staffdetails($id){
		$query ="select * from staff WHERE id='".$id."'";
		$stmt = $this->conn->prepare($query);
	  	$stmt->execute();
		$row = $stmt->fetch(PDO::FETCH_ASSOC);
		return array(
			 'id'    				=> $row['id'],
			 'email'   	   			=> $row['email'],
			 'first_name'   	   	=> $row['first_name'],
			 'last_name'   	   		=> $row['last_name'],
			 'dash_view'   	   		=> boleanfalse($row['dash_view']),
			 'aff_view'   	   		=> boleanfalse($row['aff_view']),
			 'aff_edit'   	   		=> boleanfalse($row['aff_edit']),
			 'aff_pay'   	   		=> boleanfalse($row['aff_pay']),
			 'aff_delete'   	   	=> boleanfalse($row['aff_delete']),
			 'order_view'   	   	=> boleanfalse($row['order_view']),
			 'order_edit'   	   	=> boleanfalse($row['order_edit']),
			 'bann_view'   	   		=> boleanfalse($row['bann_view']),
			 'bann_edit'   	   		=> boleanfalse($row['bann_edit']),
			 'bann_delete'   	   	=> boleanfalse($row['bann_delete']),
			 'status'   	   		=> $row['status'],
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
	         'id'    				=> $row['id'],
			 'paid_sum'   	   		=> 'US $'.number_format($row['paid_sum'],2),
			 'payment_date'   	   	=> $row['payment_date'],
			 'comments'   	   		=> $row['comments'],
			 'admin_comments'   	=> $row['admin_comments'],
	     ];
	    }
	   return $array;
	}






}

$list = new Controller();
