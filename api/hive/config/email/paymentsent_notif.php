<?php
  function MerchantPaymentSent($paid_sum,$payment_date,$comments,$email,$name,$merchant){

    	$mail = new PHPMailer;
    	$mail->CharSet = 'UTF-8';
    	$mail->From = serveremail();
    	$mail->FromName = $merchant.' Hivefiliate Marketing';
      $mail->AddEmbeddedImage(pathlogo(), 'logo_');
    	$mail->addAddress(receivingemail($email));
    	$mail->isHTML(true);
    	$mail->Subject = $merchant.' payment sent';

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

      $footer ='style="
        padding:2px 20px;
        text-align:left;
        font-size:13px;
        text-align:center;
        border-top:1px solid #ddd;
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
                  <h1 style="font-size:15px;font-weight:bold;">Hello, '.$name.'</h1>
                  <p style="opacity:0.9;"><strong>'.$merchant.'</strong> has sent a payment</p>
                </td>
  						</tr>
              <tr><td colspan="2">&nbsp;</td></tr>
              <tr>
                <td '.$tdtitle.'>Paid Sum:</td>
  							<td '.$tddata.'>'.$paid_sum.'</td>
  						</tr>
              <tr>
                <td '.$tdtitle.'>Date:</td>
  							<td '.$tddata.'>'.$payment_date.'</td>
  						</tr>
              <tr>
                <td '.$tdtitle.'>Comments:</td>
  							<td '.$tddata.'>'.$comments.'</td>
  						</tr>
              <tr><td colspan="2">&nbsp;</td></tr>
              <tr>
                <td colspan="2"  '.$footer.'>
                  <p>'.contactnumber().'</p>
                  <p>'.contactaddress().'</p>
                </td>
              </tr>
              <tr>
                <td colspan="2">&nbsp;</td>
              </tr>
  				</table>
  		</body>
  	</html>';
  	if(!$mail->send()){return 0;} else{return 1;}
}
