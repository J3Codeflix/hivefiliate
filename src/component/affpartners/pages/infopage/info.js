import React, {useState, useEffect, useRef, useContext} from 'react'
import { Form, Input, TextArea, Button, Select, Label, Dropdown, Accordion, Checkbox, Menu, Segment, Message, Modal, Header, Icon, Image } from 'semantic-ui-react'
import {UserContext} from '../../layout/userContext'


export default function Infopage(props) {
    	/* -------- User Content -------------------------*/
        const usersContext = useContext(UserContext);
        let context_affiliatelink      = null;
        let coupon_code                = null;
        let type_discount              = null;
        let discount_description       = null;
        if(usersContext){
            context_affiliatelink      = usersContext.affiliate_link;
            type_discount                = usersContext.type_discount;
            coupon_code                = usersContext.coupon_code;
            discount_description       = usersContext.discount_description;
        }
	return (
		<React.Fragment>
	        <div className="infopage pagecontent">

                <div className="segment-wrapper">
                    <div className="columns iscolumns is-mobile">
                        <div className="column is-one-third">
                          <h2>Your referral link is</h2>
                          <h3>Use this link in your blog or othe social media sites</h3>
                        </div>
                        <div className="column iscontent text-blue">
                            <Form>
                                <Form.Group widths='equal'>
                                    <Form.Field>
                                        <Input readOnly={true} fluid defaultValue={context_affiliatelink} />
                                    </Form.Field>
                                </Form.Group>
                            </Form>
                        </div>
                    </div>
                    <div className="columns iscolumns is-mobile">
                        <div className="column is-one-third">
                          <h2>Coupon Code</h2>
                          <h3>You will get earnings also when coupon code use to purchase on the store</h3>
                        </div>
                        <div className="column iscontent columntext" style={{'padding':'30px'}}>

                        {coupon_code==''&&<Message
                          negative
                          icon='info circle'
                          header='No Coupon Available'
                          content='No coupon discount yet made for you. Coupon will automatically shown if merchant has already made.'
                        />}

                        {coupon_code!=''&&<div><div className="columns is-mobile">
                              <div className="column is-one-quarter" style={{'font-weight':'600'}}>Coupon Code:</div>
                              <div className="column"><span>{coupon_code}</span></div>
                            </div>
                            <div className="columns is-mobile">
                              <div className="column is-one-quarter" style={{'font-weight':'600'}}>Type Discount:</div>
                              <div className="column"><span>{type_discount}</span></div>
                            </div>
                            <div className="columns is-mobile">
                              <div className="column is-one-quarter" style={{'font-weight':'600'}}>Description:</div>
                              <div className="column"><span>{discount_description}</span></div>
                            </div>
                            <Message
                              positive
                              icon='info circle'
                              header='Discount Code'
                              list={[
                                'If the discount code will be used during purchased, you will get earnings and will be added automatically into your account',
                                'The details of type discount can be found here: https://help.shopify.com/en/manual/promoting-marketing/discount-codes/create-discount-codes',
                              ]}
                            /></div>}
                        </div>
                    </div>
                </div>

            </div>
		</React.Fragment>
	)
}
