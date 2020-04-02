import React, {useState, useEffect, useContext, useRef} from 'react'
import { Form, Input, TextArea, Button, Select, Label, Dropdown, Table, Menu, Segment, Message, Modal, Header, Icon, Image } from 'semantic-ui-react'
import axios from 'axios'
import ReactToPrint from 'react-to-print'

import {Spinning} from '../../../../include/circlespin'
import {windowReload} from '../../../../include/merchant_redirect'
import {id} from '../../../../include/queryurl'

import {UserContext} from '../../../layout/userContext'

import logo from '../../../../../assets/image/logoblack.jpg'
export default function PaymentInvoice(props) {

  	const componentRef = useRef();

  const [spinner, setspinner] = useState(false);
  const [list, setlist] = useState([]);
  const [info, setinfo] = useState({});
  function List(){
		setspinner(true);
		let formData = new FormData();
		formData.append('type','monthly_invoice');
		formData.append('id',id());
		axios.post('/merchant/affiliate/request.php',formData)
		.then(function (response) {
				let obj = response.data;
        setlist(obj.list);
        setinfo(obj.info);
				setspinner(false);
		})
		.catch(function (error) {
				console.log(error);
		});
	}

  useEffect(()=>{
    List();
  },[]);

	return (
		<React.Fragment>
	        <div className="affiliates-wrapper pagecontent">

                <div className="table-action bottommargin">
                    <div className="table-buttons">
                        <div className="columns is-mobile is-vcentered">
													<div className="column segment-title">
														<h2>Invoice</h2>
														<p>For the month of {info.month_invoice}</p>
													</div>
														<div className="column">
                                <div className="position-right">
                                    <Button className='black' icon as='a' href={process.env.PUBLIC_URL+'/mrcaffiliates/active'}><Icon name='arrow alternate circle left outline' /> Back to Affiliate</Button>
                                    <ReactToPrint
              												trigger={() => <Button className='green' icon><Icon name='print' /> Print Invoice</Button>}
              												content={() => componentRef.current}
              											/>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="table-navigation">
                        <Menu icon='labeled'>
                            <Menu.Item as='a' href={process.env.PUBLIC_URL+'/mrcaffiliates/affpayment'}><Icon name='calendar alternate outline'/>Monthly Payment</Menu.Item>
                            <Menu.Item active as='a' href={process.env.PUBLIC_URL+'/mrcaffiliates/payhistory'}><Icon name='copy outline'/>Payment History</Menu.Item>
                        </Menu>
                    </div>
                </div>


              <div className="invoice" ref={componentRef}>
                <div>
                    {spinner&&Spinning()}

                    <div className="columns is-mobile invoice-logo is-vcentered">
                      <div className="column">
                          <img src={logo}/>
                          <p>201 King St London, Ontario N6A 1C9 Canada</p>
                          <p>415-941-5199</p>
                      </div>
                      <div className="column invoice-text"><h2>Invoice</h2></div>
                    </div>

                    <div className="invoice-to">
	                    <div className="columns is-mobile">
	                      <div className="column">
	                          <p>Invoice to</p>
	                          <h3>The following Affiliates</h3>
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
	                             <Table.Cell textAlign='right'>{info.payment_date}</Table.Cell>
	                           </Table.Row>
	                         </Table.Body>
	                        </Table>
	                      </div>
											</div>
                    </div>


                    <div className="table-responsive invoice-description">
                        <Table celled selectable compact>
                            <Table.Header>
                                <Table.Row>
                                    <Table.HeaderCell>Month</Table.HeaderCell>
                                    <Table.HeaderCell>Affiliate</Table.HeaderCell>
                                    <Table.HeaderCell>Total Order Price</Table.HeaderCell>
                                    <Table.HeaderCell>Affiliate Earnings</Table.HeaderCell>
                                    <Table.HeaderCell>Paid Earnings</Table.HeaderCell>
                                </Table.Row>
                            </Table.Header>
                            <Table.Body>
						                    {list.map(function(data, key){
				  					          		return <Table.Row key={key}>
                                      <Table.Cell>{info.month_invoice}</Table.Cell>
							  					            <Table.Cell><a target="_blank" href={process.env.PUBLIC_URL+'/mrcaffiliates/affinvoice/?id='+id()+'&affiliate='+data.affiliate_id}>{data.affiliate}</a></Table.Cell>
																			<Table.Cell>{data.order_price}</Table.Cell>
                                      <Table.Cell>{data.aff_earnings}</Table.Cell>
                                      <Table.Cell>{data.aff_earnings}</Table.Cell>
	  					        						</Table.Row>
                                })}
	  					    					</Table.Body>
                            <Table.Footer>
                              <Table.Row>
                                <Table.HeaderCell className="totalfooter" textAlign='right' colSpan='4'>Total Amount Paid</Table.HeaderCell>
                                <Table.HeaderCell className="totalfooter">{info.total}</Table.HeaderCell>
                              </Table.Row>
                            </Table.Footer>
                        </Table>
                    </div>
                </div>
            </div>

            </div>
		</React.Fragment>
	)
}
