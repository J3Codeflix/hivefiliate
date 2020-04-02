import React, {useState, useEffect, useContext} from 'react'
import { Form, Input, TextArea, Button, Select, Label, Dropdown, Table, Menu, Segment, Message, Modal, Header, Icon, Image } from 'semantic-ui-react'
import axios from 'axios'

import {Spinning} from '../../../../include/circlespin'
import {windowReload} from '../../../../include/merchant_redirect'
import {month,year} from '../../../../include/queryurl'


import {UserContext} from '../../../layout/userContext'
export default function PaymentHistory(props) {

  const [spinner, setspinner] = useState(false);
  const [list, setlist] = useState([]);
  function List(){
		setspinner(true);
		let formData = new FormData();
		formData.append('type','paymentaffiliate_history');
		axios.post('/merchant/affiliate/request.php',formData)
		.then(function (response) {
				let obj = response.data;
        setlist(obj);
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
														<h2>Payment History</h2>
														<p>List below are details on past payment transactions</p>
													</div>
														<div className="column">
                                <div className="position-right">
                                    <Button className='black' icon as='a' href={process.env.PUBLIC_URL+'/mrcaffiliates/active'}><Icon name='arrow alternate circle left outline' /> Back to Affiliate</Button>
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

                <div className="table-wrapper">
                    {spinner&&Spinning()}
                    <div className="table-responsive">
                        <Table celled selectable compact>
                            <Table.Header>
                                <Table.Row>
                                    <Table.HeaderCell>Payment Date</Table.HeaderCell>
                                    <Table.HeaderCell>Invoice Month</Table.HeaderCell>
                                    <Table.HeaderCell>Invoice Number</Table.HeaderCell>
                                    <Table.HeaderCell>Paid Earnings</Table.HeaderCell>
                                    <Table.HeaderCell>Total</Table.HeaderCell>
																		<Table.HeaderCell></Table.HeaderCell>
                                </Table.Row>
                            </Table.Header>
                            <Table.Body>
                                {list.length==0&&<Table.Row negative><Table.Cell  colSpan='6' textAlign="center">No record found</Table.Cell></Table.Row>}
						                    {list.map(function(data, key){
				  					          		return <Table.Row key={key}>
							  					            <Table.Cell>{data.payment_date}</Table.Cell>
			                                <Table.Cell>{data.month_invoice}</Table.Cell>
																			<Table.Cell>{data.invoice_number}</Table.Cell>
																			<Table.Cell>{data.amount}</Table.Cell>
                                      <Table.Cell>{data.amount}</Table.Cell>
                                      <Table.Cell collapsing>
                                        <Button className='green' size='tiny' icon as="a" href={process.env.PUBLIC_URL+'/mrcaffiliates/invoice/?id='+data.reference_id}><Icon name='calendar alternate outline'/> Details Invoice</Button>
                                      </Table.Cell>
	  					        						</Table.Row>
                                })}
	  					    					</Table.Body>
                        </Table>
                    </div>
                </div>

            </div>
		</React.Fragment>
	)
}
