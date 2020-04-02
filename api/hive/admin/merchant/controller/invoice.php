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
  			$status='<div className="icon_green"><i className="dot circle icon"></i>Paid</div>';
  		}else{
  			$status='<div className="icon_red"><i className="dot circle icon"></i>Pending </div>';
  		}

      $array[] = [
         'id'    							=> $row['id'],
				 'invoice_number'   	=> $row['invoice_number'],
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


  function processby(){
    $query ="select * from admin_users WHERE id='".$this->session."'";
		$stmt = $this->conn->prepare($query);
		$stmt->execute();
		return $stmt->fetch(PDO::FETCH_ASSOC);
  }

  function ProcessPayment($arg){
    $admin = $this->processby();
    $query ="UPDATE invoice
     SET
     is_process=:is_process,
     admin_notes=:admin_notes,
     date_process=:date_process,
     time_process=:time_process,
     process_by=:process_by,
     process_byemail=:process_byemail
     WHERE id=:id";
    $stmt = $this->conn->prepare($query);
    $stmt->bindValue(':id',$arg['id']);
    $stmt->bindValue(':is_process','1');
    $stmt->bindValue(':admin_notes',$arg['admin_notes']);
    $stmt->bindValue(':date_process',date('Y-m-d'));
    $stmt->bindValue(':time_process',date('h:i A'));
    $stmt->bindValue(':process_by',$admin['fullname']);
    $stmt->bindValue(':process_byemail',$admin['email']);
    if($stmt->execute()){
      return 1;
    }else{
      return 0;
    }
  }


	/* List Details */
	function totalpayment($id){
    $query ="select sum(aff_earnings) as earnings from orders where reference_id=:reference_id";
		$stmt = $this->conn->prepare($query);
		$stmt->bindValue(':reference_id',$id);
		$stmt->execute();
    $row = $stmt->fetch(PDO::FETCH_ASSOC);
    return $row['earnings'];
  }

	function invoicenumber($id){
    $query ="select invoice_number,DATE_FORMAT(payment_date,'%m/%d/%Y') as payment_date from invoice where reference_id=:reference_id limit 1";
		$stmt = $this->conn->prepare($query);
		$stmt->bindValue(':reference_id',$id);
		$stmt->execute();
    $row = $stmt->fetch(PDO::FETCH_ASSOC);
		return $row;
  }


	function getaffid($id){
    $query ="select id_affiliate from invoice where reference_id=:id";
		$stmt = $this->conn->prepare($query);
		$stmt->bindValue(':id',$id);
		$stmt->execute();
    $row = $stmt->fetch(PDO::FETCH_ASSOC);
		return $row['id_affiliate'];
	}

	function infoaffiliate($id){

    $query ="select * from affiliates where id=:id";
		$stmt = $this->conn->prepare($query);
		$stmt->bindValue(':id',$this->getaffid($id));
		$stmt->execute();
    $row = $stmt->fetch(PDO::FETCH_ASSOC);

    $total 		= $this->totalpayment($id);
		$invoice 	= $this->invoicenumber($id);

    return array(
      'name'            => $row['first_name'].' '.$row['last_name'],
      'email'           => $row['email'],
      'total_int'       => $total,
      'total'           => defaultcurr().number_format($total,2),
      'invoice_number'  => $invoice['invoice_number'],
      'Invoice_date'    => $invoice['payment_date']
    );
  }
	function ListDetails($id){
    $query ="select *,DATE_FORMAT(date_order, '%b %d, %Y') as date_order from orders where reference_id=:id";
		$stmt = $this->conn->prepare($query);
		$stmt->bindValue(':id',$id);
		$stmt->execute();
    $array = array();
	    foreach ($stmt->fetchAll() as $row) {
	      $array[] = [
	         'id'    							=> $row['id'],
					 'order_id'   	   		=> $row['order_id'],
           'date_order'   	    => $row['date_order'],
           'tracking_method'   	=> $row['tracking_method'],
					 'order_price'   	    => defaultcurr().number_format($row['order_price'],2),
					 'aff_earnings'   	  => defaultcurr().number_format($row['aff_earnings'],2),
	     ];
	    }
	   return $array;
  }

	function InvoiceDetails($id){
		return array(
			'list' => $this->ListDetails($id),
			'info' => $this->infoaffiliate($id),
		);
	}



}
$invoice = new Controller();
