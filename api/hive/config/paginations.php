<?php 
class Paginations extends Database{

    public function __construct(){
        $this->conn                     = $this->getConnection();
        $this->limitnav                 = 5;
    }

    public function limitquery($page_number,$limit){
        $offset = ($page_number * $limit)-$limit;
        $limit ="limit $offset, $limit";
        return $limit;
    }


    public function pageinfo($total_page_nav,$total_records,$current_page,$limit){

        $base       = $limit-1;
        $first      = ($current_page*$limit)-$base;
        $second     = $current_page*$limit;
        $second     = ($second<$total_records?$second:$total_records);
        $last       = $total_records;
        return  number_format($first,0). ' to '. number_format($second,0). ' of '.number_format($last,0). ' records';
    }


    function StartandEnd($total_records,$current_page,$total_page_nav){
        
        $start=0;
        $end=0;
        $ellipseLeft=0;
        $ellipseRight=0;

        $total = ($total_page_nav-$current_page);

        if($total_page_nav<=$this->limitnav){
            $start              = 1;
            $end                = $total_page_nav;
        }else{
            
            $ellipseRight=1;

            if($current_page>1){
                $ellipseLeft=1;
            }

            if($total>$this->limitnav){
                $start  = $current_page;
                $end    = ($this->limitnav-1)+$start;
            }else if($total==$this->limitnav){
                $start  = $current_page;
                $end    = $total_page_nav-1;
            }else{
                $ellipseRight=0;

                if(($this->limitnav-1)==$total){
                    $start  = $current_page;
                    $end    = $total_page_nav;
                }else{
                    $start  = $current_page-(($this->limitnav-$total)-1);
                    $end    = $total_page_nav;
                }
               
            }
        }


        return array(
            "startPage"                     => $start,
            "endPage"                       => $end,
            "ellipseLeft"                   => $ellipseLeft,
            "ellipseRight"                  => $ellipseRight,
        );
    } 



    function listnav($total_records,$current_page,$total_page_nav){


        $html  = '';

        $start=0;
        $end=0;
        $ellipseLeft=0;
        $ellipseRight=0;

        $total = ($total_page_nav-$current_page);

        if($total_page_nav<=$this->limitnav){
            $start              = 1;
            $end                = $total_page_nav;
        }else{
            
            $ellipseRight=1;

            if($current_page>1){
                $ellipseLeft=1;
            }

            if($total>$this->limitnav){
                $start  = $current_page;
                $end    = ($this->limitnav-1)+$start;
            }else if($total==$this->limitnav){
                $start  = $current_page;
                $end    = $total_page_nav-1;
            }else{
                $ellipseRight=0;

                if(($this->limitnav-1)==$total){
                    $start  = $current_page;
                    $end    = $total_page_nav;
                }else{
                    $start  = $current_page-(($this->limitnav-$total)-1);
                    $end    = $total_page_nav;
                }
               
            }
        }


        return array(
            'start' => $start,
            'end' => $end,
            'ellipseLeft' => $ellipseLeft,
            'ellipseRight' => $ellipseRight, 
        );

    }




    public function paginations($table,$current_page,$limit){

        if($current_page<1){
            $current_page =1;
        }
        
        $query ="$table";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        
        $total_records                  = $stmt->rowCount();
        $total_page_nav                 = ceil($total_records/$limit);
        $pageinfo                       = $this->pageinfo($total_page_nav,$total_records,$current_page,$limit);
        $startAndend                    = $this->StartandEnd($total_records,$current_page,$total_page_nav);

        $array = array(
            "listnav"                   => $this->listnav($total_records,$current_page,$total_page_nav),
            "pageinfo"                  => $pageinfo,
            "limit_page"                => $limit,
            "total_page"                => $total_page_nav,
            "total_records"             => $total_records,
            "current_page"              => $current_page,
            "startPage"                 => $startAndend['startPage'],
            "endPage"                   => $startAndend['endPage'],
            "ellipseLeft"               => $startAndend['ellipseLeft'],
            "ellipseRight"              => $startAndend['ellipseRight']                                                                 
        );

        return array("paginations" => $array);
    }


}
