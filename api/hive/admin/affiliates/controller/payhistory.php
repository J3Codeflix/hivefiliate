<?php
class Controller extends Database{

	private $paginations;

    public function __construct(){
        $this->conn 		  		= $this->getConnection();
        $this->paginations    = new Paginations;
        $this->session        = $this->MerchantSessionHandler();
				$this->entrylist 	    = $this->showEntries('admin_affiliates');
	}

  function initList($page_number,$search){

		$entries = $this->entrylist;
		$limit   = $entries['val'];

    return array(
    	'entries'               => $entries,
        'listtable'           => $this->listtable($page_number,$search,$limit),
        'paginations'         => $this->paginations->paginations($this->searchfunction($search),$page_number,$limit),
    );
	}

	function merchantinfo($id){
		$query ="select store_name,email from merchant where id=:id";
		$stmt = $this->conn->prepare($query);
		$stmt->bindValue(':id',$id);
	  $stmt->execute();
		$row = $stmt->fetch(PDO::FETCH_ASSOC);
		return $row;
	}

	function searchfunction($search){
		$and='';
		$where="WHERE id_affiliate='".$search['id']."' $and";
	  $query ="SELECT *,
			DATE_FORMAT(payment_date, '%b %d, %Y') as payment_date
			FROM affiliates_payhistory $where ORDER BY id desc";
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
         'id'    									=> $row['id'],
				 'payment_date'   	   	  => $row['payment_date'],
				 'paid_sum'   	   				=> defaultcurr().number_format($row['paid_sum'],2),
				 'comments'   	   				=> $row['comments'],
				 'admin_comments'   	   	=> $row['admin_comments'],
				 'merchant'    						=> $this->merchantinfo($row['id_merchant']),

     ];
    }
	  return $array;
	}
}

$pay = new Controller();
