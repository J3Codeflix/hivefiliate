import React, {useState, useEffect, useContext} from 'react'
import { Form, Input, TextArea, Button, Select, Label, Dropdown, Table, Menu, Segment, Message, Modal, Header, Icon, Image } from 'semantic-ui-react'
import axios from 'axios'

import {Spinning} from '../../../include/circlespin'
import {windowReload} from '../../../include/merchant_redirect'


import {UserContext} from '../../layout/userContext'
export default function InvoiceAffiliate(props) {

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

	function yeartext(){
		var d = new Date();
		var n = d.getFullYear();
		return n;
	}

	const [spinner, setspinner] = useState(false);
	const [list, setlist] = useState([]);
	const [year, setyear] = useState([]);
	const [search, setsearch] = useState({
		year: yeartext()
	});

	function List(){
		setspinner(true);
		let formData = new FormData();
		formData.append('type','merchant_offinvoice');
		formData.append('search',JSON.stringify(search));
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
        setyear(obj);
				setsearch(search.year);
		})
		.catch(function (error) {
				console.log(error);
		});
	}



  useEffect(()=>{
		  getyear();
      List();
  },[]);

	return (
		<React.Fragment>
	        <div className="affiliates-wrapper pagecontent">
                <div className="table-action">
                    <div className="table-buttons">
                        <div className="columns is-mobile is-vcentered">
                            <div className="column"><h2 className="titlewrapper">Earnings Payment</h2></div>
                            <div className="column">
                            </div>
                        </div>
                    </div>
                </div>

                <div className="table-wrapper">
                    {spinner&&Spinning()}

                    <div className="table-button">
								    	<div className="columns is-mobile is-vcentered">
							              <div className="column is-one-third">
															<Form>
														    <Form.Select selectOnBlur={false} value={search.year} options={year}/>
														  </Form>
														</div>
							              <div className="column">
	                              <div className="position-right">
																	<Button className='black' icon onClick={()=>windowReload()}><Icon name='refresh'/> Refresh</Button>
	                              </div>
							              </div>
							            </div>
								    </div>


                    <div className="table-responsive">
                        <Table celled selectable compact>
                            <Table.Header>
                                <Table.Row>
                                    <Table.HeaderCell>Months of</Table.HeaderCell>
                                    <Table.HeaderCell>Year</Table.HeaderCell>
                                    <Table.HeaderCell>Paid Earnings</Table.HeaderCell>
                                    <Table.HeaderCell>Unpaid Earnings</Table.HeaderCell>
																		<Table.HeaderCell>Action</Table.HeaderCell>
                                </Table.Row>
                            </Table.Header>
                            <Table.Body>
						                    {list.map(function(data, key){
				  					          		return <Table.Row key={key}>
							  					            <Table.Cell>{data.month}</Table.Cell>
			                                <Table.Cell>{data.year}</Table.Cell>
																			<Table.Cell positive>{data.paid}</Table.Cell>
																			<Table.Cell negative>{data.unpaid}</Table.Cell>
																			<Table.Cell collapsing>
																				<Button size='tiny' disabled={data.ispayment==0} className='green' icon><Icon name='dollar'/> Make Payment</Button>
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
