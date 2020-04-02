import React, {useState, useEffect} from 'react'
import { Form, Input, TextArea, Button, Select, Label, Dropdown, Accordion, Menu, Segment, Message, Modal, Header, Icon, Image, Table } from 'semantic-ui-react'
import axios from 'axios'
import { LineChart, PieChart } from 'react-chartkick'
import 'chart.js'
import renderHTML from 'react-render-html'
import {LinkURL} from '../../../config/settings'
import Iconmoney1 from '../../../../assets/images/icon_money1.png'
import Iconmoney2 from '../../../../assets/images/icon_money2.png'
import Iconmoney3 from '../../../../assets/images/icon_money3.png'
import Iconvisit1 from '../../../../assets/images/icon_visit1.png'
import Iconvisit2 from '../../../../assets/images/icon_visit2.png'

import payment_1 from '../../../../assets/images/payment_1.png'
import icon_visit3 from '../../../../assets/images/icon_visit3.png'


export default function Dashboard(props) {

	const [spinner, setspinner] = useState(false);
	const [data, setdata] = useState(false);
	const [datamerchant, setdatamerchant] = useState([]);
	const [liststore, setliststore] = useState([]);
	const [datachart, setdatachart] = useState([]);

	function DashboardData(){
			setspinner(true);
			let formData = new FormData();
			formData.append('type','dashboard_data');
			axios.post('/dashboard/request.php',formData)
			.then(function (response) {
					let obj = response.data;
					setdata(obj);
					if(obj.list_merchant!=null){setdatamerchant(obj.list_merchant);}
					if(obj.list_store!=null){setliststore(obj.list_store);}
					setdatachart(obj.datachart);
			})
			.catch(function (error){
					console.log(error);
			});
	}

	useEffect(()=>{
		DashboardData();
	},[]);

	return (
		<React.Fragment>
      <div className="dashboard pagecontent">

          <div className="datarevenue">
						<div className="columns">
							<div className="column">
								<div className="revenucolumn">
									<div className="columns is-mobile is-vcentered">
										<div className="column is-one-quarter"><img src={Iconvisit1}/></div>
										<div className="column">
											<h3>{data.totalorder}</h3>
											<p>Total Order</p>
										</div>
									</div>
								</div>
							</div>
							<div className="column">
								<div className="revenucolumn">
									<div className="columns is-mobile is-vcentered">
										<div className="column is-one-quarter"><img src={Iconmoney2}/></div>
										<div className="column">
											<h3>{data.merchant_revenue}</h3>
											<p>Merchant Revenue</p>
										</div>
									</div>
								</div>
							</div>
							<div className="column">
								<div className="revenucolumn">
									<div className="columns is-mobile is-vcentered">
										<div className="column is-one-quarter"><img src={Iconvisit2}/></div>
										<div className="column">
											<h3>{data.active_aff}</h3>
											<p>Active Affiliates</p>
										</div>
									</div>
								</div>
							</div>
							<div className="column">
								<div className="revenucolumn">
									<div className="columns is-mobile is-vcentered">
										<div className="column is-one-quarter"><img src={Iconmoney3}/></div>
										<div className="column">
											<h3>{data.aff_earnings}</h3>
											<p>Affiliates Earnings</p>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>


					<div className="managerdashboard">
						<div className="columns">
							<div className="column">
								<div className="dashboardpanel">
									<div className="dashboardpanel-header">Manager Revenue / Payment Merchant</div>
									<div className="dashboardpanel-body revenuemanager">
										<div className="columns is-mobile is-vcentered">
											<div className="column">
												<div className="columns is-mobile is-vcentered">
													<div className="column is-one-fifth"><img src={icon_visit3}/></div>
													<div className="column">
														<h3>{data.active_merchant}</h3>
														<p>Total number of active merchant</p>
													</div>
												</div>
											</div>
											<div className="column">
												<div className="columns is-mobile is-vcentered">
													<div className="column is-one-fifth"><img src={payment_1}/></div>
													<div className="column">
														<h3>{data.total_payment}</h3>
														<p>Total payment plan made by merchant</p>
													</div>
												</div>
											</div>
										</div>
									</div>
									<div className="dashboardpanel-body">
										<div className="table-responsive">
											<Table celled unstackable>
										    <Table.Header>
										      <Table.Row>
														<Table.HeaderCell>ID</Table.HeaderCell>
														<Table.HeaderCell>Store Name</Table.HeaderCell>
										        <Table.HeaderCell>Plan</Table.HeaderCell>
										        <Table.HeaderCell>Payment</Table.HeaderCell>
														<Table.HeaderCell>Date</Table.HeaderCell>
										      </Table.Row>
										    </Table.Header>
												<Table.Body>
												{datamerchant.length==0&&<Table.Row negative><Table.Cell  colSpan='5' textAlign="center">No record found</Table.Cell></Table.Row>}
												{datamerchant.map(function(listdata, key){
													return <Table.Row key={key}>
															<Table.Cell collapsing>{listdata.id}</Table.Cell>
															<Table.Cell>{listdata.store_name}</Table.Cell>
															<Table.Cell>{listdata.type_plan}</Table.Cell>
															<Table.Cell>{listdata.payment}</Table.Cell>
															<Table.Cell>{listdata.date}</Table.Cell>
													</Table.Row>
												})}
												</Table.Body>
											</Table>
										</div>
										<div className="loadmore"><Button as="a" href={LinkURL('/merchant/list')} className="blue" icon labelPosition='right'>Go to Merchant<Icon name='right arrow' /></Button></div>
									</div>
								</div>
							</div>
							<div className="column">
								<div className="dashboardpanel">
									<div className="dashboardpanel-header">Merchant Store</div>
									<div className="dashboardpanel-body">
										<div className="table-responsive">
											<Table celled unstackable>
												<Table.Header>
													<Table.Row>
														<Table.HeaderCell>ID</Table.HeaderCell>
														<Table.HeaderCell>Store Name</Table.HeaderCell>
														<Table.HeaderCell>Plan</Table.HeaderCell>
														<Table.HeaderCell>Registered</Table.HeaderCell>
														<Table.HeaderCell>Expiration</Table.HeaderCell>
														<Table.HeaderCell>Status</Table.HeaderCell>
													</Table.Row>
												</Table.Header>
												<Table.Body>
												{liststore.length==0&&<Table.Row negative><Table.Cell  colSpan='6' textAlign="center">No record found</Table.Cell></Table.Row>}
												{liststore.map(function(store, key){
													return <Table.Row key={key} className={store.xpired==0?'':'negative'}>
															<Table.Cell collapsing>{store.id}</Table.Cell>
															<Table.Cell>{store.store_name}</Table.Cell>
															<Table.Cell>{store.type_plan}</Table.Cell>
															<Table.Cell>{store.dateadded}</Table.Cell>
															<Table.Cell>{store.date_expiration}</Table.Cell>
															<Table.Cell>{renderHTML(store.status)}</Table.Cell>
													</Table.Row>
												})}
												</Table.Body>
											</Table>
										</div>
										<div className="loadmore"><Button as="a" href={LinkURL('/merchant/list')} className="blue" icon labelPosition='right'>Go to list merchant<Icon name='right arrow' /></Button></div>
									</div>
								</div>
							</div>
						</div>
					</div>


					<div className="dashboardchart">
						<div className="dashboardpanel">
							<div className="dashboardpanel-header">Merchant and Affiliate Revenue</div>
							<div className="dashboardpanel-body">
								<LineChart data={datachart} discrete={true}  download="Merchant and Affiliate Revenue" ytitle="Value in $USD"/>
							</div>
						</div>
					</div>


      </div>
		</React.Fragment>
	)
}
