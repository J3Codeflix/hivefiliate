<?php
class Controller extends Database{

	private $paginations;

    public function __construct(){
        $this->conn 		  = $this->getConnection();
        $this->paginations    = new Paginations;
        $this->session        = $this->AffiliateSessionHandler();
		    $this->entrylist 	    = $this->showEntries('mrc_affiliates');
	}



	/* Order List */

    function initList($page_number,$search){

		$entries = $this->entrylist;
		$limit   = $entries['val'];

	    return array(
	    	'entries'                    => $entries,
	      'listtable'                  => $this->listtable($page_number,$search,$limit),
				'paginations'                => $this->paginations->paginations($this->searchfunction($search),$page_number,$limit),
				'total'						 					 => $this->totalorders($search)
	    );
	}


	function searchfunction($search){

	  $and				='';
	  if($search['is_overall']=='true'){
		if(!empty($search['date_from'])&&!empty($search['date_to'])){
			$and=" and (dateadded between '".$search['date_from']."' AND '".$search['date_to']."')";
		}
	  }
	  $where="WHERE affiliate_id='".$this->session."' and order_status='Paid' $and";

	  $query ="SELECT *,
	  		sum(aff_earnings) as aff_earnings,
				sum(order_price) as order_price,
	  		DATE_FORMAT(date_order, '%b %d, %Y') as date_order,
				DATE_FORMAT(dateadded, '%b %d, %Y') as dateadded,
				dateadded as dateinserted
				FROM orders $where GROUP BY dateadded ORDER BY dateadded desc";
	  return $query;
	}

	function countVisitor($date,$merchant_id){
		$query="select * from store_visit WHERE dateadded='".$date."' and id_affiliate='".$this->session."' and id_merchant='".$merchant_id."'";
		$stmt = $this->conn->prepare($query);
		$stmt->execute();
		return $stmt->rowCount();
	}

  function countorder($date){
		$query="select * from orders WHERE dateadded='".$date."' and affiliate_id='".$this->session."' and order_status='Paid'";
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

		  $conversion ='0%';
		  if($row['order_price']>0){
			  $conversion ='100%';
		  }

	      $array[] = [
				 'dateadded'    					=> $row['dateadded'],
				 'visitor'    				    => $this->countVisitor($row['dateinserted'],$row['merchant_id']),
				 'order'    				    	=> $this->countorder($row['dateinserted']),
				 'order_price'   	   			=> defaultcurr().number_format($row['order_price'],2),
				 'aff_earnings'   	   		=> defaultcurr().number_format($row['aff_earnings'],2),
				 'conversion'    					=> $conversion,
	     ];
	    }
	   return $array;
	}

	/* Total Overall */
	function totalVisit($search){
		$and				='';
		if($search['is_overall']=='true'){
		  if(!empty($search['date_from'])&&!empty($search['date_to'])){
			  $and=" and (dateadded between '".$search['date_from']."' AND '".$search['date_to']."')";
		  }
		}
		$query="select * from store_visit WHERE id_affiliate='".$this->session."' $and";
		$stmt = $this->conn->prepare($query);
		$stmt->execute();
		return $stmt->rowCount();
	}
	function totalcountOrders($search){
		$and				='';
		if($search['is_overall']=='true'){
		  if(!empty($search['date_from'])&&!empty($search['date_to'])){
			  $and=" and (dateadded between '".$search['date_from']."' AND '".$search['date_to']."')";
		  }
		}
		$query="select * from orders WHERE affiliate_id='".$this->session."' and order_status='Paid' $and";
		$stmt = $this->conn->prepare($query);
		$stmt->execute();
		return $stmt->rowCount();
	}

	function totalPrice($search){
		$and				='';
		if($search['is_overall']=='true'){
		  if(!empty($search['date_from'])&&!empty($search['date_to'])){
			  $and=" and (dateadded between '".$search['date_from']."' AND '".$search['date_to']."')";
		  }
		}
		$query="select sum(order_price) as price from orders WHERE affiliate_id='".$this->session."' and order_status='Paid' $and";
		$stmt = $this->conn->prepare($query);
		$stmt->execute();
		if($stmt->rowCount()==0){return 0;}
		$row = $stmt->fetch(PDO::FETCH_ASSOC);
		return $row['price'];
	}

	function totalEarnings($search){
		$and				='';
		if($search['is_overall']=='true'){
		  if(!empty($search['date_from'])&&!empty($search['date_to'])){
			  $and=" and (dateadded between '".$search['date_from']."' AND '".$search['date_to']."')";
		  }
		}
		$query="select sum(aff_earnings) as earnings from orders WHERE affiliate_id='".$this->session."' and order_status='Paid' $and";
		$stmt = $this->conn->prepare($query);
		$stmt->execute();
		if($stmt->rowCount()==0){return 0;}
		$row = $stmt->fetch(PDO::FETCH_ASSOC);
		return $row['earnings'];
	}

	function totalPaidEarnings($search){
		$and				='';
		if($search['is_overall']=='true'){
		  if(!empty($search['date_from'])&&!empty($search['date_to'])){
			  $and=" and (date_order between '".$search['date_from']."' AND '".$search['date_to']."')";
		  }
		}
		$query="select sum(aff_earnings) as aff_earnings from orders WHERE is_paid=1 and affiliate_id='".$this->session."' $and";
		$stmt = $this->conn->prepare($query);
		$stmt->execute();
		if($stmt->rowCount()==0){return 0;}
		$row = $stmt->fetch(PDO::FETCH_ASSOC);
		return $row['aff_earnings'];
	}

	function totalUnpaidEarnings($search){
		return $this->totalEarnings($search)-$this->totalPaidEarnings($search);
	}

	function totalorders($search){
		return array(
			'total_visit' 					=> $this->totalVisit($search),
			'total_order' 					=> $this->totalcountOrders($search),
			'total_price' 					=> defaultcurr().number_format($this->totalPrice($search),2),
			'total_earnings' 				=> defaultcurr().number_format($this->totalPaidEarnings($search),2),
			'total_unpaid' 					=> defaultcurr().number_format($this->totalUnpaidEarnings($search),2),
			'total_allearnings' 		=> defaultcurr().number_format($this->totalEarnings($search),2),
		);
	}


}

$list = new Controller();
