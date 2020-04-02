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


	function searchfunction($search){

	  $and				='';

	  if(!empty($search['date_from'])&&!empty($search['date_to'])){
		  $and=" or (date_order between '".$search['date_from']."' AND '".$search['date_to']."')";
	  }

	  $where="WHERE affiliate_id='".$this->session."' and is_order='".$search['is_order']."' $and";
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


}

$list = new Controller();
