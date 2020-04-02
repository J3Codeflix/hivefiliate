import React, {useState, useEffect, useContext} from 'react'
import { Form, Input, TextArea, Button, Select, Label, Dropdown, Accordion, Menu, Checkbox, Message, Modal, Header, Icon, Image } from 'semantic-ui-react'

import {UserContext} from '../../layout/userContext'
import {ProgramAffLink} from '../../../include/merchant_redirect'
import AccountInfo from './updateinfo'
import DeleteAccount from './delete'
import renderHTML from 'react-render-html'
export default function Account(props) {

	const usersContext = useContext(UserContext);
	let store_id 					= null;
	let store_email 			= null;
	let storename   			= null;
	let username 					= null;
	let merchant_id 			= null;
	let date_expiration 	= null;
	let stafflog 				  = 0;
	let current_plan      = '';
	let current_expire    = '';
	let store_hash 				= null;
	let type_platform     = '';
	let secret_key     		= '';
	let public_key        = '';


	if(usersContext){
			storename 					= usersContext.store_name;
			username 						= usersContext.username;
			merchant_id 				= usersContext.merchant_id;
			store_id 						= usersContext.id;
			store_email 				= usersContext.email;
			date_expiration 		= usersContext.date_expiration;
			stafflog	 				  = usersContext.stafflog;
			current_plan	 		  = usersContext.current_plan;
			current_expire	 	  = usersContext.current_expire;
			store_hash	 	  	  = usersContext.store_id;

			type_platform	 		  = usersContext.type_platform;
			secret_key	 	  		= usersContext.secret_key;
			public_key	 	  	  = usersContext.public_key;

	}


   const [isupdate, setisupdate] = useState(false);
   const [idaccount, setidaccount] = useState(null);
   const [idstorename, setidstorename] = useState(null);
   const [idemail, setidemail] = useState(null);

   function CloseModal(){
	 		setisupdate(false);
			setisdelete(false);
   }
   function updateAccount(){
			setidaccount(store_id);
			setidstorename(storename);
			setidemail(store_email);
			setisupdate(true);
   }

	 const [isdelete, setisdelete] = useState(false);
	 function deleteAccount(){
		 setisdelete(true);
	 }

	return (
		<React.Fragment>
			<div className="account pagecontent">
					<h1 className="titlewrapper">Account</h1>
			      <div className="segment-wrapper">
							<div className="columns iscolumns is-mobile">
								<div className="column is-one-third"><h2>Your affiliate program login page</h2></div>
								<div className="column iscontent">
									<p className="text-blue"><a target="_blank" href={ProgramAffLink('login/?merchant='+merchant_id)}>{ProgramAffLink('login/?merchant='+store_hash)}</a></p>
									<p>The URL shown above is the private login for your affiliates. This private login link will automatically sent to affiliate email when you added or when they registered.</p>
								</div>
							</div>
							<div className="columns iscolumns is-mobile">
								<div className="column is-one-third"><h2>Your affiliate program registration page</h2></div>
								<div className="column iscontent">
									<p className="text-blue"><a target="_blank" href={ProgramAffLink('register/?merchant='+merchant_id)}>{ProgramAffLink('register/?merchant='+store_hash)}</a></p>
									<p>The URL shown above is the link to your private signup page and can be accessed only if you send the link to your potential affiliates.</p>
								</div>
							</div>
							<div className="columns iscolumns is-mobile">
								<div className="column is-one-third"><h2>Your name</h2></div>
								<div className="column iscontent">{storename}</div>
							</div>
							<div className="columns iscolumns is-mobile">
								<div className="column is-one-third"><h2>Your email</h2></div>
								<div className="column iscontent">{store_email}</div>
							</div>
							<div className="columns iscolumns is-mobile">
								<div className="column is-one-third"><h2>Your Hivefiliate ID</h2></div>
								<div className="column iscontent">{store_id}</div>
							</div>
							<div className="columns iscolumns is-mobile">
								<div className="column is-one-third"><h2>Your Hivefiliate Code</h2></div>
								<div className="column iscontent">{store_id}</div>
							</div>


							{type_platform=='woocommerce'&&<div className="columns iscolumns is-mobile">
								<div className="column is-one-third"><h2>Your API Public Key</h2></div>
								<div className="column iscontent text-blur">{public_key}</div>
							</div>}


							{type_platform=='woocommerce'&&<div className="columns iscolumns is-mobile">
								<div className="column is-one-third"><h2>Your API Secret Key</h2></div>
								<div className="column iscontent text-blur">{secret_key}</div>
							</div>}

							{/*<div className="columns iscolumns is-mobile">
								<div className="column is-one-third">
									<h2>Security hash</h2>
									<h3>(used to secure the api requests)</h3>
								</div>
								<div className="column iscontent">{merchant_id}</div>
							</div>*/}

							<div className="columns iscolumns is-mobile">
								<div className="column is-one-third"><h2>Current Plan</h2></div>
								<div className="column iscontent">
									<div>{renderHTML(current_plan)}</div>
									<div>{renderHTML(current_expire)}</div>
								</div>
							</div>

							<div className="columns iscolumns is-mobile">
								<div className="column is-one-third"><h2>Paid Until</h2></div>
								<div className="column iscontent paiduntil">
									<Message visible positive><Icon name='calendar alternate outline'/>{date_expiration}</Message>
									<Message
										warning
								    icon='info circle'
								    header='Important notes on your current plan'
								    list={[
											'If the current plan is expired then your account will be freeze temporarily until you make a payment',
											'All activities, visit and tracking purchase will stop working temporarily',
											'Settle your plan to avoid inconvenience. If you need help and assistance, then do not hesitate to contact us. We are here to serve you.'
										]}
								  />
								</div>
							</div>
							<div className="columns iscolumns is-mobile">
								<div className="column is-one-third"></div>
								<div className="column iscontent">
									<div className="columns is-clearfix">
										<div className="column">
											{type_platform!='shopify'&&<Button
												color='green'
												icon='check circle'
												labelPosition='right'
												content="Make Payment"
												as='a'
												href={process.env.PUBLIC_URL+'/payment'}
											/>}
											{type_platform=='shopify'&&<Button
												color='green'
												icon='check circle'
												labelPosition='right'
												content="Make Payment"
												as='a'
												onClick
											/>}
											<Button
												color='blue'
												icon='check circle'
												labelPosition='right'
												content="Update Account"
												onClick={()=>updateAccount()}
											/>
										</div>
										<div className="column position-right">
											<Button
													color='red'
													icon='trash alternate'
													labelPosition='right'
													content="Delete account & data"
													onClick={()=>deleteAccount()}
												/>
										</div>
									</div>
								</div>
							</div>
						</div>
						{isupdate&&<AccountInfo
							closeTrigger={CloseModal}
							idCallback={idaccount}
							idStorename={idstorename}
							idEmail={idemail}
						/>}
						 {isdelete&&<DeleteAccount closeTrigger={CloseModal}/>}
	        </div>

		</React.Fragment>
	)
}
