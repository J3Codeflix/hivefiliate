<?php
class Controller extends Database{

	private $paginations;

    public function __construct(){
        $this->conn 		  		= $this->getConnection();
        $this->paginations    = new Paginations;
        $this->session        = $this->MerchantSessionHandler();
				$this->entrylist 	    = $this->showEntries('admin_merchant');
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

	function searchfunction($search){

		$and='';
		/*
	  if(!empty($search['search_keywords'])){
			if($search['search_field']==1){
				$and =" and store_name LIKE '%".$search['search_keywords']."%'";
			}
			if($search['search_field']==2){
				$and =" and email='".$search['search_keywords']."'";
			}
			if($search['search_field']==3){
				$and =" and type_plan='".$search['search_keywords']."'";
			}
			if($search['search_field']==4){
				$and =" and dateadded='".$search['search_keywords']."'";
			}
			if($search['search_field']==5){
				$and =" and date_expiration='".$search['search_keywords']."'";
			}
	  }*/

		$where="WHERE merchant_id='".$search['id']."' $and";
	  $query ="SELECT *,
			DATEDIFF(date_expiration,NOW()) as days_remaining,
			DATE_FORMAT(date_expiration, '%b %d, %Y') as date_expiration,
			DATE_FORMAT(date_payment, '%b %d, %Y') as date_payment
			FROM merchant_payment $where ORDER BY id desc";
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

			if($row['type_plan']=='Trial'){
				$typeplan ='<div className="ui red horizontal label">Trial</div>';
			}else if($row['type_plan']=='Professional'){
				$typeplan ='<div className="ui green horizontal label">Professional</div>';
			}else{
				$typeplan ='<div className="ui orange horizontal label">Enterprise</div>';
			}


      $array[] = [
         'id'    									=> $row['id'],
				 'pay_number'   	   			=> $row['pay_number'],
				 'type_plan'   	   				=> $typeplan,
				 'total'   	   						=> defaultcurr().number_format(($row['monthly_sub']*$row['monthly_price']),2),
				 'currency'   	   	  		=> $row['currency'],
				 'monthly_sub'   	   			=> $row['monthly_sub'].' months',
				 'monthly_price'   	   		=> defaultcurr().number_format($row['monthly_price'],2),
				 'date_expiration'   	   	=> $row['date_expiration'],
				 'date_payment'   	   		=> $row['date_payment'].' '.$row['time_payment'],
				 'days_remaining'   	    => $row['days_remaining'],
				 'time_payment'   	   		=> $row['time_payment'],
				 'payment_via'   	   	  	=> $row['payment_via'],
				 'transaction_id'   	   	=> $row['transaction_id'],
				 'arrange_by'   	   			=> $row['arrange_by'],
				 'description'   	   	  	=> $row['description']
     ];
    }
	  return $array;
	}
}

$pay = new Controller();
