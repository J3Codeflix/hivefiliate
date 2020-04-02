<?php
class PurchaseTrackingController extends Database{
    public function __construct(){
      $this->conn = $this->getConnection();
	}

  function domainstore($url){
    $domain = parse_url($url, PHP_URL_HOST);
    $domain = preg_replace('/^www\./', '', $domain);
    return $domain;
  }

  /* Get IP Address */
  function getUserIpAddr(){
      if(!empty($_SERVER['HTTP_CLIENT_IP'])){
          $ip = $_SERVER['HTTP_CLIENT_IP'];
      }elseif(!empty($_SERVER['HTTP_X_FORWARDED_FOR'])){
          $ip = $_SERVER['HTTP_X_FORWARDED_FOR'];
      }else{
          $ip = $_SERVER['REMOTE_ADDR'];
      }
      return $ip;
  }

  /* Get user agent */
  function userAgent() {
      return $_SERVER["HTTP_USER_AGENT"];
  }

  /* Commission Fee */
  function CommissionFee($id,$price){
      $query ="select * from affiliates WHERE id=:id";
      $stmt = $this->conn->prepare($query);
      $stmt->bindValue(':id',$id);
      $stmt->execute();
      if($stmt->rowCount()==0){return 0;}
      $row = $stmt->fetch(PDO::FETCH_ASSOC);
      if($row['type_com']=='1'){
         $percent = $row['com_percent']/100;
         $price 	= $price;
         return ($percent*$price);
      }else{
         return $row['flat_rate'];
      }
  }


  function getmerchant_id($id){
    $query ="select * from affiliates WHERE id=:id";
    $stmt = $this->conn->prepare($query);
    $stmt->bindValue(':id',$id);
    $stmt->execute();
    $row = $stmt->fetch(PDO::FETCH_ASSOC);
    return $row['id_merchant'];
  }

  function getcreditoaffiliate($ip,$shop){
    $date = date('Y-m-d');
    $query ="select * from shop_trackcustomer WHERE ip_address=:ip_address and shop=:shop and date_expire>='".$date."'";
    $stmt = $this->conn->prepare($query);
    $stmt->bindValue(':ip_address',$ip);
    $stmt->bindValue(':shop',$shop);
    $stmt->execute();

    if($stmt->rowCount()==0){
      return 0;
    }

    $row = $stmt->fetch(PDO::FETCH_ASSOC);
    return $row['id_affiliate'];
  }



  function creditomerchant($shopurl){

      $query ="select * from merchant WHERE website_url=:website_url";
      $stmt = $this->conn->prepare($query);
      $stmt->bindValue(':website_url',$shopurl);
      $stmt->execute();
      $row = $stmt->fetch(PDO::FETCH_ASSOC);
      return $row['id'];

  }

  /*check if order is existed */

  function isplaceorder($shop,$affiliate_id,$merchant_id,$browser_ip,$order_id){
    $query ="select * from orders WHERE location_type=:location_type and merchant_id=:merchant_id and affiliate_id=:affiliate_id and ip_address=:ip_address and order_id=:order_id";
    $stmt = $this->conn->prepare($query);
    $stmt->bindValue(':location_type',$shop);
    $stmt->bindValue(':merchant_id',$merchant_id);
    $stmt->bindValue(':affiliate_id',$affiliate_id);
    $stmt->bindValue(':ip_address',$browser_ip);
    $stmt->bindValue(':order_id',$order_id);
    $stmt->execute();
    return $stmt->rowCount();
  }


  function WebhookOrdersCreate($order_id,$total_price,$coupon,$referring_site){

       $browser_ip     = $this->getUserIpAddr();

       $shop           = $referring_site;

       $aff            = $this->getcreditoaffiliate($browser_ip,$shop);



       if($aff>0){
         $affiliate_id = $aff;
         $merchant_id  = $this->getmerchant_id($affiliate_id);
         $commfee      = $this->CommissionFee($affiliate_id,$total_price);

         if($this->isplaceorder($shop,$affiliate_id,$merchant_id,$browser_ip,$order_id)>0){
           return 0;
         }


       }else{
         $affiliate_id = 0;
         $merchant_id  = $this->creditomerchant($shop);
         $commfee      = 0;
       }


        $is_order       = 'is_approved';
        $type_tracking  = 'Tracking by link';
        $date_order     = date('Y-m-d');
        $order_status   = 'Paid';

        $affiliate_earnings = $commfee;
        $ip_address         = $this->getUserIpAddr();
        $device_type        = $this->userAgent();

        $this->conn->query("SET SESSION sql_mode=''");

        $query ="INSERT INTO orders
                SET
                is_order=:is_order,
                merchant_id=:merchant_id,
                affiliate_id=:affiliate_id,
                order_id=:order_id,
                tracking_method=:tracking_method,
                order_price=:order_price,
                aff_earnings=:aff_earnings,
                date_order=:date_order,
                order_status=:order_status,
                location_type=:location_type,
                ip_address=:ip_address,
                device_type=:device_type,
                order_type=:order_type,
                dateadded=:dateadded";
        $stmt = $this->conn->prepare($query);
        $stmt->bindValue(':is_order',$is_order);
        $stmt->bindValue(':merchant_id',$merchant_id);
        $stmt->bindValue(':affiliate_id',$affiliate_id);
        $stmt->bindValue(':order_id',$order_id);
        $stmt->bindValue(':tracking_method',$type_tracking);
        $stmt->bindValue(':order_price',$total_price);
        $stmt->bindValue(':aff_earnings',$affiliate_earnings);
        $stmt->bindValue(':date_order',$date_order);
        $stmt->bindValue(':order_status',$order_status);
        $stmt->bindValue(':location_type',$referring_site);
        $stmt->bindValue(':ip_address',$ip_address);
        $stmt->bindValue(':device_type',$device_type);
        $stmt->bindValue(':order_type',$referring_site);
        $stmt->bindValue(':dateadded',date('Y-m-d'));
        $stmt->execute();
  }


}
$purchase_tracking = new PurchaseTrackingController();
