<?php
function StaffLink($email,$link){
    	$mail = new PHPMailer;
    	$mail->CharSet = 'UTF-8';
      $mail->Host           = 'hivefiliate.com';
      $mail->Port           = '995';
      $mail->SMTPAuth       = true;
      $mail->Username       = 'mail@hivefiliate.com';
      $mail->Password       = 'OlQYeutm{dg&';
      $mail->SMTPSecure     = 'tls';
    	$mail->From = serveremail();
    	$mail->FromName = 'Hivefiliate Marketing';
      //$mail->AddEmbeddedImage(pathlogo(), 'logo_');
    	$mail->addAddress(receivingemail($email));
    	$mail->isHTML(true);
    	$mail->Subject = "Merchant new staff login link";
  	  $mail->Body   = '
      <html>
        <head>
          <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
          <title>Hivefiliate - Password Reset</title>
        </head>
        <body leftmargin="0" marginwidth="0" topmargin="0" marginheight="0" offset="0"
        style="margin: 0pt auto; padding: 0px; background:##39517c;">
          <table id="main" width="100%" height="100%" cellpadding="0" cellspacing="0" border="0"
          bgcolor="#F4F7FA">
            <tbody>
              <tr>
                <td valign="top">
                  <table class="innermain" cellpadding="0" width="580" cellspacing="0" border="0"
                  bgcolor="#F4F7FA" align="center" style="margin:0 auto; table-layout: fixed;">
                    <tbody>

                      <!-- START of MAIL Content -->
                      <tr>
                        <td colspan="4">

                        <!-- Logo start here -->
                          <table class="logo" width="100%" cellpadding="0" cellspacing="0" border="0">
                            <tbody>
                              <tr>
                                <td colspan="2" height="30"></td>
                              </tr>
                              <tr>
                                <td valign="top" align="center">
                                  <a href="https://www.Hivefiliate.com" style="display:inline-block; cursor:pointer; text-align:center;">
                                    <img src="https://content-na.drive.amazonaws.com/cdproxy/share/gi0SLCZTt8DDXCdtvYBINqt9SzyfkhsOdvXmzpK32jP/nodes/qANyaHciTgGRVxDIJUkZpA?nonce=4Gqkb8psLDbHU2oY8gqFJASfOCLiOjx1jMEs7E_ACtBo7krRrmPsaKRerreerkv5&viewBox=1664%2C342&ownerId=A1RFXJZB43BVFB"
                                    height="" width="200" border="0" alt="Hivefiliate">
                                  </a>
                                </td>
                              </tr>
                              <tr>
                                <td colspan="2" height="30"></td>
                              </tr>
                            </tbody>
                          </table>
                          <!-- Logo end here -->

                          <!-- Main CONTENT -->
                          <table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#ffffff"
                          style="border-radius: 4px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
                            <tbody>
                              <tr>
                                <td height="40"></td>
                              </tr>
                              <tr style="font-family: -apple-system,BlinkMacSystemFont,&#39;Segoe UI&#39;,&#39;Roboto&#39;,&#39;Oxygen&#39;,&#39;Ubuntu&#39;,&#39;Cantarell&#39;,&#39;Fira Sans&#39;,&#39;Droid Sans&#39;,&#39;Helvetica Neue&#39;,sans-serif; color:#4E5C6E; font-size:14px; line-height:20px; margin-top:20px;">
                                <td class="content" colspan="2" valign="top" align="center" style="padding-left:90px; padding-right:90px;">
                                  <table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#ffffff">
                                    <tbody>
                                      <tr>
                                        <td align="center" valign="bottom" colspan="2" cellpadding="3">
                                          <img alt="Hivefiliate" width="80" src="https://content-na.drive.amazonaws.com/cdproxy/share/QDuYbXyHaoVo4xkkYtHrUrTSnaXYvFFQYLatZg1hrAf/nodes/k8BvgUBDRmSs4NnVgghaRw?nonce=L2Yq7Z3Rnh5RABU7hd-zHFnCBJEemJgLePxtVchS1ho-b93CJR5LxNcYlQ4Qcpgd&viewBox=960%2C960&ownerId=A1RFXJZB43BVFB"
                                           />
                                        </td>
                                      </tr>
                                      <tr>
                                        <td height="30" &nbsp;=""></td>
                                      </tr>
                                      <tr>
                                        <td align="center"> <span style="color:#39517c;font-size:22px;line-height: 24px;">Merchant store link login for staff has been changed</span></td>
                                      </tr>
                                      <tr>
                                        <td height="24" &nbsp;=""></td>
                                      </tr>
                                      <tr>
                                        <td height="1" bgcolor="#DAE1E9"></td>
                                      </tr>
                                      <tr>
                                        <td height="24" &nbsp;=""></td>
                                      </tr>
                                      <tr>
                                        <td align="center"> <span style="color:#39517c;font-size:14px;line-height:24px;">Your Hivefiliate merchant store link has been updated. Click the button below for the updated link</span></td>
                                      </tr>
                                      <tr>
                                        <td height="20" &nbsp;=""></td>
                                      </tr>
                                      <tr>
                                        <td valign="top" width="48%" align="center">
                                          <span><a href="'.$link.'" style="display:block; padding:15px 25px; background-color:#39517c; color:#ffffff; border-radius:3px; text-decoration:none;">Login to Store</a></span>
                                        </td>
                                      </tr>
                                      <tr>
                                        <td height="20" &nbsp;=""></td>
                                      </tr>
                                      <tr>
                                        <td align="center">
                                          <img src="https://s3.amazonaws.com/app-public/Hivefiliate-notification/hr.png" width="54"
                                          height="2" border="0">
                                        </td>
                                      </tr>
                                      <tr>
                                        <td height="20" &nbsp;=""></td>
                                      </tr>
                                      <tr>
                                        <td align="center">
                                          <p style="color:#a2a2a2; font-size:12px; line-height:17px; font-style:italic;">If you prefer to receive less frequent emails from us, you can set your <a href="#" style="color: #a2a2a2;">preferences here</a>. If you no longer want to receive any more messages from us, you can <a href="#" style="color: #a2a2a2;">unsubscribe here</a>.</p>
                                        </td>
                                      </tr>
                                    </tbody>
                                  </table>
                                </td>
                              </tr>
                              <tr>
                                <td height="60"></td>
                              </tr>
                            </tbody>
                          </table>
                          <!-- Main CONTENT end here -->
                          <!-- PROMO column start here -->
                          <!-- Show mobile promo 75% of the time -->
                          <table id="promo" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top:20px;">
                            <tbody>
                              <tr>
                                <td colspan="2" height="20"></td>
                              </tr>

                            </tbody>
                          </table>
                          <!-- PROMO column end here -->
                          <!-- FOOTER start here -->
                          <table width="100%" cellpadding="0" cellspacing="0" border="0">
                            <tbody>
                              <tr>
                                <td height="10">&nbsp;</td>
                              </tr>
                              <tr>
                                <td valign="top" align="center"> <span style="font-family: -apple-system,BlinkMacSystemFont,&#39;Segoe UI&#39;,&#39;Roboto&#39;,&#39;Oxygen&#39;,&#39;Ubuntu&#39;,&#39;Cantarell&#39;,&#39;Fira Sans&#39;,&#39;Droid Sans&#39;,&#39;Helvetica Neue&#39;,sans-serif; color:#9EB0C9; font-size:10px;">&copy;
                                  <a href="https://www.hivefiliate.com/" target="_blank" style="color:#9EB0C9 !important; text-decoration:none;">Hivefiliate</a> 2019
                                </span>
                                </td>
                              </tr>
                              <tr>
                                <td height="50">&nbsp;</td>
                              </tr>
                            </tbody>
                          </table>
                          <!-- FOOTER end here -->
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            </tbody>
          </table>
        </body>
      </html>';
  	if(!$mail->send()){return 0;} else{return 1;}
}
