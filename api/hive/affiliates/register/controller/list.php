<?php 
class Controller extends Database{

	private $paginations;
  
    public function __construct(){
        $this->conn 		  = $this->getConnection();
        $this->paginations    = new Paginations;
        $this->session        = $this->SessionHandler();
        $this->entrylist 	  = $this->showEntries('options_entries');
    }

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
	  $where = "";
	  if(!empty($search)){
	  	$where = "WHERE description LIKE '%".$search."%'";
	  }
	  $query ="SELECT * FROM options_colors $where ORDER BY ID desc";
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
	         'id'    				=> $row['id'],
	         'texts'   	   			=> $row['texts'],
	         'image'   	   	   	    => $row['image'],
	     ];
	    }
	   return $array;
	}



	function listdetails($id){
		$query ="select id,texts,image from options_colors WHERE id='".$id."'";
		$stmt = $this->conn->prepare($query);
	  	$stmt->execute();
	  	return $stmt->fetch(PDO::FETCH_ASSOC);
	}
	




}

$list = new Controller();