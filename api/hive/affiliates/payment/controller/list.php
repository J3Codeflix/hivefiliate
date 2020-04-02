<?php
class Controller extends Database{

	private $paginations;

    public function __construct(){
        $this->conn 		  = $this->getConnection();
        $this->paginations    = new Paginations;
        $this->session        = $this->AffiliateSessionHandler();
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



	function detailsinvoice($id){
		$query ="SELECT *, DATE_FORMAT(payment_date, '%b %d, %Y') as payment_date  FROM invoice WHERE reference_id='".$id."'";
		$stmt = $this->conn->prepare($query);
	  $stmt->execute();
		return $stmt->fetch(PDO::FETCH_ASSOC);
	}


	function searchfunction($search){
	  $and				='';
	  if(!empty($search['date_from'])&&!empty($search['date_to'])){
		  $and=" and (payment_date between '".$search['date_from']."' AND '".$search['date_to']."')";
	  }
	  $where="WHERE affiliate_id='".$this->session."' and is_paid=1 $and";
	  $query ="SELECT *,sum(aff_earnings) as total  FROM orders $where
		GROUP BY reference_id
		ORDER BY date_order desc";
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

			$inv = $this->detailsinvoice($row['reference_id']);

      $array[] = [
         'id'    									=> $row['id'],
				 'comments'   	   				=> $inv['comments1'],
				 'paid_sum'   	   				=> defaultcurr().number_format($row['total'],2),
				 'payment_date'   	   		=> $inv['payment_date'],
				 'invoice_number'   	   	=> $inv['invoice_number'],
				 'month_invoice'   	   	  => $inv['month_invoice'],

     ];
    }
	  return $array;
	}


}

$list = new Controller();
