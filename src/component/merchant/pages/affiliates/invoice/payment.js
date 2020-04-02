import React, {useState, useEffect, useContext} from 'react'
import { Form, Input, TextArea, Button, Select, Label, Dropdown, Table, Menu, Segment, Message, Modal, Header, Icon, Image } from 'semantic-ui-react'
import axios from 'axios'

import {Spinning} from '../../../../include/circlespin'
import {windowReload} from '../../../../include/merchant_redirect'


import {UserContext} from '../../../layout/userContext'
export default function PaymentAffiliate(props) {

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
	const [year, setyear] = useState([]);
	const [search, setsearch] = useState(new Date().getFullYear());
	const [currentyear, setcurrentyear] = useState(new Date().getFullYear());

	function List(param){
		setspinner(true);
		let formData = new FormData();
		formData.append('type','merchant_offinvoice');
		formData.append('search',param);
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




	function getyear(){
		let formData = new FormData();
		formData.append('type','yearoptions');
		axios.post('/merchant/affiliate/request.php',formData)
		.then(function (response) {
				let obj = response.data;
				if(obj==0){
					setyear([
						{ key: '1', value: new Date().getFullYear(), text: new Date().getFullYear() },
					]);
					return false;
				}
        setyear(obj);
				setsearch(new Date().getFullYear());
		})
		.catch(function (error) {
				console.log(error);
		});
	}



  useEffect(()=>{
		  getyear();
      List(search);
  },[]);

	return (
		<React.Fragment>
	        <div className="affiliates-wrapper pagecontent">
                <div className="table-action bottommargin">
                    <div className="table-buttons">
                        <div className="columns is-mobile is-vcentered">
													<div className="column segment-title">
														<h2>Affiliate Earnings</h2>
														<p>Earnings total on specific months and year</p>
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
                            <Menu.Item active as='a' href={process.env.PUBLIC_URL+'/mrcaffiliates/affpayment'}><Icon name='calendar alternate outline'/>Monthly Payment</Menu.Item>
                            <Menu.Item as='a' href={process.env.PUBLIC_URL+'/mrcaffiliates/payhistory'}><Icon name='copy outline'/>Payment History</Menu.Item>
                        </Menu>
                    </div>
                </div>

								<Message
								  warning
							    icon='info circle'
							    header='Paid and Unpaid earnings every month'
							    content='The button "Make Payment" will automatically enable if there is unpaid earnings for affiliate'
							  />

                <div className="table-wrapper">
                    {spinner&&Spinning()}

                    <div className="table-button">
								    	<div className="columns is-mobile is-vcentered">
							              <div className="column">
															<Form>
														    <Select
																		selectOnBlur={false}
																		name="search"
																		value={search}
																		options={year}
																		onChange={(e, { value }) => {
																			setsearch(value);
																			List(value);
																		}}
																/>
																<Button className='black' icon onClick={()=>windowReload()} style={{'margin-left':'5px'}}><Icon name='refresh'/> Reset</Button>
														  </Form>
														</div>
							              {/*<div className="column">
	                              <div className="position-right">
																	<Button className='black' icon onClick={()=>windowReload()}><Icon name='refresh'/> Refresh</Button>
	                              </div>
							              </div>*/}
							            </div>
								    </div>


                    <div className="table-responsive">
                        <Table celled selectable compact>
                            <Table.Header>
                                <Table.Row>
                                    <Table.HeaderCell>Months of</Table.HeaderCell>
                                    <Table.HeaderCell>Paid Earnings</Table.HeaderCell>
                                    <Table.HeaderCell>Unpaid Earnings</Table.HeaderCell>
																		<Table.HeaderCell>Action</Table.HeaderCell>
                                </Table.Row>
                            </Table.Header>
                            <Table.Body>
						                    {list.map(function(data, key){

				  					          		return <Table.Row key={key} className={
																			data.ispaid==0&&data.isunpaid!=0?'negative':data.ispaid>0&&data.isunpaid==0?'positive':''
																		}>
							  					            <Table.Cell>{data.month} {data.year}</Table.Cell>
																			<Table.Cell>{data.paid}</Table.Cell>
																			<Table.Cell>{data.unpaid}</Table.Cell>
																			<Table.Cell collapsing>
																				<Button
																					size='tiny'
																					disabled={(data.ispaid>0&&data.isunpaid==0)||data.ispayment==0}
																					className='green'
																					as="a"
																					href={process.env.PUBLIC_URL+'/mrcaffiliates/formonth/?month='+data.id+'&year='+data.year}
																					icon><Icon name='dollar'/> Make Payment</Button>
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
