import React, {useState, useEffect, useRef} from 'react'
import { Form, Input, TextArea, Button, Select, Label, Dropdown, Accordion, Menu, Segment, Message, Modal, Header, Icon, Image, Table } from 'semantic-ui-react'
import { Formik, Field } from 'formik'
import ReactToPrint from 'react-to-print'

import {LinkURL,windowLocation,windowReload} from '../../../config/settings'
import {getid} from '../../../config/queryurl'

import {Spinning} from '../../../config/spinner'
import renderHTML from 'react-render-html'
import axios from 'axios'

import Logo from '../../../../assets/images/logoblack.jpg'

export default function Invoice(props) {

	const componentRef = useRef();

	const [spinner,setspinner] = useState(false);
	const [list,setlist] = useState([]);
	const [info,setinfo] = useState({});

	function InvoiceDetails(){
    if(getid()==null||getid()==''){windowLocation('/merchant/affpayment');}
    setspinner(true);
    let formData = new FormData();
    formData.append('type','merchant_invoice_details');
		formData.append('id',getid());
    axios.post('/merchant/request.php',formData)
    .then(function (response) {
        let obj = response.data;
				setspinner(false);
				if(obj.list==0){windowLocation('/merchant/affpayment');}
				setinfo(obj.info);
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
	        <div className="pages-wrapper">

              <div className="page-title-wrapper">
									<div className="columns is-mobile is-vcentered">
											<div className="column page-title">
												<Button className='green' icon as="a" href={LinkURL('/merchant/affpayment')}><Icon name='arrow alternate circle left outline' /> Back to Affiliate Invoice Payment </Button>
													<ReactToPrint
										        trigger={() => <Button className='teal' icon><Icon name='print' /> Print Invoice</Button>}
										        content={() => componentRef.current}
										      />
											</div>
											<div className="column breadcrumps">
													<span><a href={LinkURL('dashboard')}>Dashboard</a></span><i className="ti-angle-right"></i><span>Affiliate Payment</span>
											</div>
									</div>
							</div>

							<div className="invoice-wrapper" ref={componentRef}>
								<div className="invoice-header">
									<div className="invoice-company">
										<div className="columns is-mobile">
											<div className="column">
												<img src={Logo}/>
												<p>201 King St London, Ontario N6A 1C9 Canada</p>
												<p>415-941-5199</p>
											</div>
											<div className="column invoicetext"><h2>Invoice</h2></div>
										</div>
									</div>
									<div className="invoice-to">
										<div className="columns is-mobile">
											<div className="column invoice-column1">
												<p>Invoice to</p>
												<h2>Ryan Jumaday</h2>
												<p>ryanjumaday@gmail.com</p>
											</div>
											<div className="column invoice-column2">
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
								</div>

								<div className="invoice-table">
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
								</div>

              </div>


          </div>
		</React.Fragment>
	)
}
