<?php
require('class.phpmailer.php');
require('serveremail.php');

  function PaymentSubscriptionPlan($arg){

    	$mail = new PHPMailer;
    	$mail->CharSet = 'UTF-8';
    	$mail->From = serveremail();
    	$mail->FromName = 'Hivefiliate Marketing';
      $mail->AddEmbeddedImage(pathlogo(), 'logo_');
      $mail->addAddress(serveremail());
    	$mail->addAddress(receivingemail($arg['email']));
    	$mail->isHTML(true);
    	$mail->Subject ='Payment for subscription plan';

    	$bodybg ='style="
    		background-color:#dddddd;
    		padding:30px;
    	"';

    	$divgrid ='style="
    		width:600px;
    		margin:20px auto;
    		background-color:#fff;
    	"';

    	$table ='style="
    		width:100%;
    		border-collapse:collapse;
    		border:1px solid #ddd;
    	"';

    	$padding ='style="
    		padding:20px;
    		font-size:13px;
    	"';

    	$header ='style="
    		padding:20px;
    		font-size:13px;
        text-align:center;
    		background-color:#dddddd;
    		color:#fff;
    	"';

    	$tddata ='style="
    		padding:5px 20px;
    		text-align:left;
    		font-size:13px;
    	"';
      $tdtitle ='style="
        padding:5px 20px;
        text-align:left;
        font-weight:bold;
        font-size:13px;
      "';

      $buttonlink ='style="
        padding:5px 20px;
        text-align:left;
        font-size:13px;
        border-top:1px solid #ddd;
      "';

      $dataheader ='style="
    		padding:5px 20px;
    		text-align:left;
    		font-size:13px;
        border-bottom:1px solid #ddd;
    	"';

  	  $mail->Body   = '
      <html>
          <head>
          	<title>Hivefiliate</title>
          </head>
  	    <body '.$bodybg.'>
  	    	<div '.$divgrid.'>
  				<table '.$table.'>
  						<tr>
  							<td '.$header.'>
  							    <img src="cid:logo_" width="200"/>
  							</td>
  						</tr>
  				</table>

  				<table '.$table.'>
  						<tr><td colspan="2">&nbsp;</td></tr>
  				    <tr>
  							<td colspan="2" '.$dataheader.'>
                  <h1 style="font-size:15px;font-weight:bold;">Hello, '.$arg['store_name'].'</h1>
                  <p style="opacity:0.9;">Thankyou for paying your subscription plan! Below are the details of your payment.</p>
                </td>
  						</tr>
              <tr><td colspan="2">&nbsp;</td></tr>
              <tr>
                <td '.$tdtitle.'>Payment Date:</td>
  							<td '.$tddata.'>'.$arg['date_payment'].'</td>
  						</tr>
              <tr>
                <td '.$tdtitle.'>Transaction:</td>
  							<td '.$tddata.'>'.$arg['transaction_id'].'</td>
  						</tr>
              <tr>
                <td '.$tdtitle.'>Plan:</td>
  							<td '.$tddata.'>'.$arg['type_plan'].'</td>
  						</tr>
              <tr>
                <td '.$tdtitle.'>Subscription:</td>
                <td '.$tddata.'>'.$arg['monthly_sub'].'</td>
              </tr>
              <tr>
                <td '.$tdtitle.'>Per month price:</td>
                <td '.$tddata.'>'.$arg['monthly_price'].'</td>
              </tr>
              <tr>
                <td '.$tdtitle.'>Total:</td>
                <td '.$tddata.'>'.$arg['total'].'</td>
              </tr>
              <tr>
                <td '.$tdtitle.'>Date Expiration:</td>
                <td '.$tddata.'>'.$arg['date_expiration'].'</td>
              </tr>
              <tr>
                <td '.$tdtitle.'>Payment Via:</td>
                <td '.$tddata.'>'.$arg['payment_via'].'</td>
              </tr>
              <tr>
                <td '.$tdtitle.'>Arrange By:</td>
                <td '.$tddata.'>'.$arg['arrange_by'].'</td>
              </tr>
              <tr><td colspan="2">&nbsp;</td></tr>
  				</table>
  		</body>
  	</html>';
  	if(!$mail->send()){return 0;} else{return 1;}
}
