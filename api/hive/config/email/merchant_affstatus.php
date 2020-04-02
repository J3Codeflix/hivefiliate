<?php
require('class.phpmailer.php');
require('serveremail.php');

  function MerchantActionStatustoAff($store_name,$merchemail,$affemail,$first_name,$status,$message,$link){
    	$mail = new PHPMailer;
    	$mail->CharSet = 'UTF-8';
    	$mail->From = serveremail();
    	$mail->FromName = 'Hivefiliate Marketing Software';
      $mail->AddEmbeddedImage(pathlogo(), 'logo_');
    	$mail->addAddress(receivingemail($affemail));
    	$mail->isHTML(true);
    	$mail->Subject = "Your affiliate program status";

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

      $footer ='style="
    		padding:2px 20px;
    		text-align:left;
    		font-size:13px;
        text-align:center;
        border-top:1px solid #ddd;
    	"';

      $buttonlink ='style="
        padding:0 20px;
        text-align:left;
        font-size:13px;
      "';

      if($link==''){
        $displaynone ='style="display:none;"';
      }else{
        $displaynone ='style="display:block;"';
      }

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
              <tr><td colspan="2">&nbsp;</td></tr>
  				    <tr>
  							<td colspan="2" '.$tddata.'>
                  <h1 style="font-size:15px;font-weight:bold;">Hello, '.$first_name.'</h1>
                  <p style="opacity:0.9;">'.$message.'</p>
                </td>
  						</tr>
              <tr><td colspan="2">&nbsp;</td></tr>
              <tr '.$displaynone.'>
  							<td colspan="2"  '.$buttonlink.'>
  								<p><a href="'.$link.'" style="background-color:#2185d0;text-decoration:none;color:#fff;padding:10px 20px; border-radius:3px;">Affiliate login</a></p>
  							</td>
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
