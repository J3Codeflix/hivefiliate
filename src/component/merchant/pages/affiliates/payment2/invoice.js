import React, {useState, useEffect, useContext, useRef} from 'react'
import { Form, Input, TextArea, Button, Select, Label, Dropdown, Table, Menu, Segment, Message, Modal, Header, Icon, Image } from 'semantic-ui-react'
import axios from 'axios'
import {Spinning} from '../../../../include/circlespin'
import ReactToPrint from 'react-to-print'

import {windowReload,returnUrl} from '../../../../include/merchant_redirect'
import {UserContext} from '../../../layout/userContext'

import {affiliateid,id} from '../../../../include/queryurl'
import logo from '../../../../../assets/image/logoblack.jpg'

export default function InvoicePayment(props) {
	const componentRef = useRef();

	  /* User Context */
	const usersContext = useContext(UserContext);
	let stafflog	 		 = 0;
  let view_aff 			 = true;
	let view_edit 		 = true;
	let view_pay 			 = true;
	let view_delete 	 = true;
	if(usersContext){
		  stafflog	 				= usersContext.stafflog;
			if(stafflog!=0){
				view_aff  		  = usersContext.staff_permission.affiliate.view=='true'?true:false;
				view_edit  		  = usersContext.staff_permission.affiliate.edit=='true'?true:false;
				view_pay  		  = usersContext.staff_permission.affiliate.pay=='true'?true:false;
				view_delete  		= usersContext.staff_permission.affiliate.delete=='true'?true:false;
			}
	}


  const [spinner, setspinner] = useState(false);
  const [list, setlist] = useState([]);
  const [info, setinfo] = useState({});
  function InvoiceDetails(){
    if(affiliateid()==null||id()==null){returnUrl('mrcaffiliates/payhistory/?affiliate='+affiliateid());}
    setspinner(true);
    let formData = new FormData();
    formData.append('type','merchant_invoice');
    formData.append('aff',affiliateid());
		formData.append('id',id());
    axios.post('/merchant/affiliate/request.php',formData)
    .then(function (response) {
        let obj = response.data;
				setspinner(false);
				setinfo(obj.info);
				if(obj.list.length==0){return false;}
        setlist(obj.list);
    })
    .catch(function (error) {
        console.log(error);
    });
  }


  useEffect(()=>{
    InvoiceDetails();
  },[]);

	return (
		<React.Fragment>
	        <div className="affiliates-wrapper pagecontent">
                <div className="table-action">
                    <div className="table-buttons">
                      <Button className='green' icon as='a' href={process.env.PUBLIC_URL+'/mrcaffiliates/payhistory/?affiliate='+affiliateid()}><Icon name='arrow alternate circle left outline' /> Back to Affiliate Payment History</Button>
											<ReactToPrint
												trigger={() => <Button className='teal' icon><Icon name='print' /> Print Invoice</Button>}
												content={() => componentRef.current}
											/>
                    </div>
                </div>

                <div className="table-wrapper" style={{'margin-top':'15px'}}>
                <div className="invoice" ref={componentRef}>
                    <div className="columns is-mobile invoice-logo is-vcentered">
                      <div className="column">
                          {/*<img src={logo}/>
                          <p>201 King St London, Ontario N6A 1C9 Canada</p>
                          <p>415-941-5199</p>*/}
                      </div>
                      <div className="column invoice-text"><h2>Invoice</h2></div>
                    </div>

                    <div className="invoice-to">
	                    <div className="columns is-mobile">
	                      <div className="column">
	                          <p>Invoice to</p>
	                          <h3>{info.name}</h3>
	                          <p>{info.email}</p>
	                      </div>
	                      <div className="column">
	                        <Table basic='very' className="tableinvoice">
	                         <Table.Body>
	                           <Table.Row className="borderbottom">
	                             <Table.Cell textAlign='right' collapsing><h4>Invoice No.:</h4></Table.Cell>
	                             <Table.Cell textAlign='right'>{info.invoice_number}</Table.Cell>
	                           </Table.Row>
	                           <Table.Row>
	                             <Table.Cell textAlign='right' collapsing><h4>Invoice Date:</h4></Table.Cell>
	                             <Table.Cell textAlign='right'>{info.Invoice_date}</Table.Cell>
	                           </Table.Row>
	                         </Table.Body>
	                        </Table>
	                      </div>
											</div>
                    </div>


										{list.length==0&&<div className="noearnings">
											<Message
												warning
										    icon='info circle'
										    header='No earnings yet to pay'
										    content= 'We found that affiliate are no earnings yet to pay. Unpaid earnings are automatically shown below if they had.'
										  />
									</div>}

                    {list.length>0&&<div className="invoice-description">
                        <Table>
                          <Table.Header>
                            <Table.Row>
                              <Table.HeaderCell>Date Order</Table.HeaderCell>
                              <Table.HeaderCell>Order ID</Table.HeaderCell>
                              <Table.HeaderCell>Tracking</Table.HeaderCell>
                              <Table.HeaderCell>Order Price</Table.HeaderCell>
                              <Table.HeaderCell>Earnings</Table.HeaderCell>
                              <Table.HeaderCell>Total</Table.HeaderCell>
                            </Table.Row>
                          </Table.Header>
                          <Table.Body>
                            {list.map(function(data, key){
                              return <Table.Row key={key}>
                                  <Table.Cell>{data.date_order}</Table.Cell>
                                  <Table.Cell>{data.order_id}</Table.Cell>
                                  <Table.Cell>{data.tracking_method}</Table.Cell>
                                  <Table.Cell>{data.order_price}</Table.Cell>
                                  <Table.Cell>{data.aff_earnings}</Table.Cell>
                                  <Table.Cell>{data.aff_earnings}</Table.Cell>
                              </Table.Row>
                            })}
                          </Table.Body>
                          <Table.Footer>
                            <Table.Row>
                              <Table.HeaderCell className="totalfooter" textAlign='right' colSpan='5'>Total</Table.HeaderCell>
                              <Table.HeaderCell className="totalfooter">{info.total}</Table.HeaderCell>
                            </Table.Row>
                          </Table.Footer>
                        </Table>
                    </div>}
                  </div>
                </div>

            </div>
		</React.Fragment>
	)
}
