<?php
class Controller extends Database{

	private $paginations;

    public function __construct(){
        $this->conn 		  		= $this->getConnection();
        $this->paginations    = new Paginations;
        $this->session        = $this->MerchantSessionHandler();
				$this->entrylist 	    = $this->showEntries('admin_merchant');
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
  	  'entries'             => $entries,
      'listtable'           => $this->listtable($page_number,$search,$limit),
      'paginations'         => $this->paginations->paginations($this->searchfunction($search),$page_number,$limit),
    );
	}

	/* Get pricing Plan */
	function priceplan($id){
		$query="select * from pricing_plan where id='".$id."'";
		$stmt = $this->conn->prepare($query);
		$stmt->execute();
		$row = $stmt->fetch(PDO::FETCH_ASSOC);
		return $row['price_plan'];
	}
	function pricingplaninfo(){
		return array(
			'price_professional' => $this->priceplan(2),
			'price_enterprise' => $this->priceplan(3),
			'pro_price' => defaultcurr().number_format($this->priceplan(2),2),
			'enter_price' => defaultcurr().number_format($this->priceplan(3),2),
			'currency' => defaultcurr(),
		);
	}

	function searchfunction($search){
		$and='';
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
	  }

		$where="WHERE status='Active' and is_deleted='".$search['is_deleted']."' $and";
	  $query ="SELECT *,
			DATEDIFF(date_expiration,NOW()) as days_remaining,
			DATE_FORMAT(date_expiration, '%b %d, %Y') as date_expiration,
			DATE_FORMAT(dateadded, '%b %d, %Y') as dateadded
			FROM merchant $where ORDER BY id desc";
	  return $query;
	}

	function pricingplan($id){
		$query="select * from pricing_plan where id='".$id."'";
		$stmt = $this->conn->prepare($query);
		$stmt->execute();
		$row = $stmt->fetch(PDO::FETCH_ASSOC);
		return array(
			'type_plan' => $row['type_plan'],
			'price_plan' => $row['price_plan'],
		);
	}



	/* Trial Plan */
	function trialPlan($days_remaining,$date_expiration){
		$typeplan ='<div className="ui red horizontal label">Trial</div>';
		if($days_remaining>7){
			$status='<div className="icon_green"><i className="dot circle icon"></i>Active</div>';
		}else if($days_remaining>0&&$days_remaining<=7){
			$status='<div className="icon_warning"><i className="dot circle icon"></i>Active</div>';
		}else{
			$status='<div className="icon_red"><i className="dot circle icon"></i>Expired</div>';
		}
		return array(
			'type_plan'   	  		=> $typeplan,
			'price_plan'   	  		=> defaultcurr().number_format(0,2),
			'days_remaining'   		=> $days_remaining,
			'plan_expire'   	    => $date_expiration,
			'status'   	    			=> $status,
			'type_plantext'   	  => 'Trial',
			'currency'           	=> defaultcurr(),
		);
	}

	/* Paid Plan */
	function currentPlan($id){
		$query="select *,
		DATEDIFF(date_expiration,NOW()) as days_remaining,
		DATE_FORMAT(date_expiration, '%b %d, %Y') as date_expiration
		from merchant_payment where merchant_id='".$id."' order by id desc limit 1";
		$stmt = $this->conn->prepare($query);
		$stmt->execute();
		if($stmt->rowCount()==0){return 0;}
		$row = $stmt->fetch(PDO::FETCH_ASSOC);


		if($row['type_plan']=='Trial'){
			$typeplan ='<div className="ui red horizontal label">Trial</div>';
		}else if($row['type_plan']=='Professional'){
			$typeplan ='<div className="ui green horizontal label">Professional</div>';
		}else{
			$typeplan ='<div className="ui orange horizontal label">Enterprise</div>';
		}

		if($row['days_remaining']>7){
			$status='<div className="icon_green"><i className="dot circle icon"></i>Active</div>';
		}else if($row['days_remaining']>0&&$row['days_remaining']<=7){
			$status='<div className="icon_warning"><i className="dot circle icon"></i>Active</div>';
		}else{
			$status='<div className="icon_red"><i className="dot circle icon"></i>Expired</div>';
		}

		return array(
			'type_plan'   	  		=> $typeplan,
			'price_plan'   	  		=> defaultcurr().number_format($row['monthly_sub']*$row['monthly_price'],2),
			'days_remaining'   		=> $row['days_remaining'],
			'plan_expire'   	    => $row['date_expiration'],
			'status'   	    			=> $status,
			'type_plantext'   	  => $row['type_plan'],
			'currency'           	=> $row['currency'],
		);
	}


	/* Check if there is a payment existed */
	function ispayment($id){
		$query ="select * from merchant_payment WHERE merchant_id='".$id."'";
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

      if($this->currentPlan($row['id'])==0){
				$plan = $this->trialPlan($row['days_remaining'],$row['date_expiration']);
			}else{
				$plan = $this->currentPlan($row['id']);
			}

      $array[] = [
         'id'    							=> $row['id'],
				 'email'   	   				=> $row['email'],
				 'store_name'   	   	=> $row['store_name'],
				 'dateadded'   	   	  => $row['dateadded'],
				 'ispayment'   	   	  => $this->ispayment($row['id']),
				 'type_plan'   	  		=> $plan['type_plan'],
				 'price_plan'   	  	=> $plan['price_plan'],
				 'days_remaining'   	=> $plan['days_remaining'],
				 'plan_expire'   	    => $plan['plan_expire'],
				 'status'   	    		=> $plan['status'],
				 'type_plantext'   	  => $plan['type_plantext'],
				 'currency'           => $plan['currency'],
				 'description'        => $row['description'],
				 'priceplan'					=> $this->pricingplaninfo(),
				 'action_delete'  		=> $this->admindeletepermission()

     ];
    }
	  return $array;
	}
}

$list = new Controller();
