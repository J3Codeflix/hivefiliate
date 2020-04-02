<?php
class Controller extends Database{

	private $paginations;

    public function __construct(){
        $this->conn 		  		= $this->getConnection();
        $this->paginations    = new Paginations;
        $this->session        = $this->AdminSessionHandler();
				$this->entrylist 	    = $this->showEntries('admin_merchant');
	}


	function allmerchant(){
		$query ="select id,store_name from merchant order by store_name asc";
		$stmt = $this->conn->prepare($query);
		$stmt->execute();
		$array = array();

    foreach ($stmt->fetchAll() as $row) {
			$array[] = [
         'key'    						=> $row['id'],
				 'text'   						=> $row['store_name'],
				 'value'   	   	    	=> $row['id'],
     ];
    }
		return $array;
	}
	function allaffiliate(){
		$query ="select id,CONCAT(first_name,' ',last_name) as name from affiliates order by first_name asc";
		$stmt = $this->conn->prepare($query);
		$stmt->execute();
		$array = array();

    foreach ($stmt->fetchAll() as $row) {
			$array[] = [
         'key'    						=> $row['id'],
				 'text'   						=> $row['name'],
				 'value'   	   	    	=> $row['id'],
     ];
    }
		return $array;
	}

  function initList($page_number,$search){

		$entries = $this->entrylist;
		$limit   = $entries['val'];

    return array(
			'merchant'           	=> $this->allmerchant(),
			'affiliate'           => $this->allaffiliate(),
  	  'entries'             => $entries,
      'listtable'           => $this->listtable($page_number,$search,$limit),
      'paginations'         => $this->paginations->paginations($this->searchfunction($search),$page_number,$limit),
    );
	}


	function searchfunction($search){
		$where='';
	  if(!empty($search['search_keywords'])){
			if($search['search_field']==1){
				$where =" WHERE id_merchant='".$search['search_keywords']."'";
			}
			if($search['search_field']==2){
				$where =" WHERE id_affiliate='".$search['search_keywords']."'";
			}
			if($search['search_field']==3){
				$where =" WHERE invoice_number='".$search['search_keywords']."'";
			}
			if($search['search_field']==4){
				$where =" WHERE payment_date='".$search['search_keywords']."'";
			}
	  }
	  $query ="SELECT *,
			DATE_FORMAT(payment_date, '%b %d, %Y') as payment_date,
			DATE_FORMAT(date_process, '%b %d, %Y') as date_process,
			DATE_FORMAT(dateadded, '%b %d, %Y') as dateadded
			FROM invoice $where ORDER BY id desc";
	  return $query;
	}


  function affinfo($id){
    $query ="select * from affiliates WHERE id='".$id."'";
		$stmt = $this->conn->prepare($query);
		$stmt->execute();
		return $stmt->fetch(PDO::FETCH_ASSOC);
  }
  function merchantinfo($id){
    $query ="select * from merchant WHERE id='".$id."'";
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

      $aff = $this->affinfo($row['id_affiliate']);
      $mrc = $this->merchantinfo($row['id_merchant']);

      if($row['is_process']=='1'){
  			$status='<div className="icon_green"><i className="dot circle icon"></i>Approved</div>';
  		}else{
  			$status='<div className="icon_red"><i className="dot circle icon"></i>Pending Approval</div>';
  		}

      $array[] = [
         'id'    							=> $row['id'],
				 'invoice_number'   	=> $row['invoice_number'],
         'month_invoice'   	  => $row['month_invoice'],
				 'reference_id'   		=> $row['reference_id'],
				 'amount'   	   	    => $row['amount'],
				 'payment_date'   	  => $row['payment_date'],
         'affiliate'   	      => $aff['first_name'].' '.$aff['last_name'],
         'merchant'   	      => $mrc['store_name'],
         'aff_email'   	      => $aff['email'],
         'mrc_email'   	      => $mrc['email'],
         'comments1'   	      => $row['comments1'],
         'status'   	        => $status,
         'is_process'   	    => $row['is_process'],
         'total'   	          => defaultcurr().number_format($row['amount'],2),
				 'process_by'   	    => $row['process_by'],
				 'process_byemail'   	=> $row['process_byemail'],
				 'paypal_email'   	  => $aff['paypal_email'],
				 'date_process'   	  => $row['date_process'].' '.$row['time_process'],
				 'admin_notes'   			=> $row['admin_notes'],
     ];
    }
	  return $array;
	}


}
$list = new Controller();
