import _ from 'lodash'
import React, {useState,useRef,useEffect, useContext} from 'react'
import { Formik, Field } from 'formik'
import { Form, Input, TextArea, Button, Select, Label, Dropdown, Dimmer, Loader, Icon, Message, Modal,Checkbox } from 'semantic-ui-react'
import axios from 'axios'
import DatePicker from "react-datepicker"
import moment from 'moment'
import Cleave from 'cleave.js/react'
import {getvalidations} from './validate'
import {Spinning, Success, Error} from '../../../../config/spinner'

export default function DetailsComponent(props) {

  /* For Modal */
  function closeModal(data){
      props.close(data);
  }
  function callalert(open,data){
      props.alert(open,data);
  }
  function reloadlist(){
      props.reload();
  }

  /* Form Submit */
  const [affpercent, setaffpercent] = useState(0);
  const [date_dummy, setdate_dummy] = useState(new Date(moment(new Date(props.data.date_order)).format('MM/DD/YYYY')));
  const [seen, setseen] = useState(false);
  const buttonEl = useRef(null);
  const [buttonclick, setbuttonClick] = useState(0);
  function buttonSubmit(arg){
      setbuttonClick(arg);
      buttonEl.current.click();
	}

  const [isucess,setisucess] = useState(false);
  const [iserror,setiserror] = useState(false);
  const [spinner, setspinner] = useState(false);
  const [state, setstate] = useState({
      id:props.data.id,
      merchant_id:props.data.merchant_id,
      affiliate_id:props.data.affiliate_id,
			order_id:props.data.order_id,
			tracking_method:props.data.tracking_method,
	    order_price:props.data.order_price,
	    aff_earnings:props.data.aff_earnings,
			date_order:new Date(moment(new Date(props.data.date_order)).format('MM/DD/YYYY')),
			order_status:props.data.order_status,
			landing_page:props.data.landing_page,
			referal_page:props.data.referal_page,
			notes:props.data.notes,
  });

  function handleSubmitForm(values, { props = this.props, setSubmitting, resetForm, setErrors }){
		setspinner(true);
    const datavlues = {
        id:values.id,
        merchant_id:values.merchant_id,
        affiliate_id:values.affiliate_id,
        order_id:values.order_id,
        tracking_method:values.tracking_method,
        order_price:values.order_price,
        aff_earnings:values.aff_earnings,
        date_order: moment(new Date(values.date_order)).format('YYYY-MM-DD'),
        order_status:values.order_status,
        landing_page:values.landing_page,
        referal_page:values.referal_page,
        notes:values.notes,
    }
		let formData = new FormData();
		formData.append('type','admin_updateorder');
		formData.append('info',JSON.stringify(datavlues));
		axios.post('/orders/request.php',formData)
		.then(function (response) {
			let obj = response.data;
      setspinner(false);
			if(obj==1){
				resetForm();
				if(buttonclick==1){callalert(true,{text:'Order successfully updated',type:'success',size:'full',open:true});reloadlist();closeModal(false);}
				if(buttonclick==2){setisucess(true);reloadlist();setTimeout(function() {setisucess(false);},2000);}
				return false;
			}
			if(obj==0){resetForm();setiserror(true);setTimeout(function() {setiserror(false);},2000);return false;}
			Object.keys(obj).forEach(function(key) {setErrors(obj)});
		})
		.catch(function (error) {resetForm();setiserror(true);setspinner(false);return false;});
   }

   function getaffiliateinfo(id){
		 let formData = new FormData();
		 formData.append('type','affliate_info');
		 formData.append('id',id);
		 axios.post('/orders/request.php',formData)
		 .then(function (response) {
				 let obj = response.data;
				 setaffpercent(obj.com_percent);
         console.log(obj.com_percent);
		 })
		 .catch(function (error) {return false;});
	}

	return (
		<div className="modalwrapper">
		     <Formik
	            initialValues={state}
	            validationSchema={getvalidations}
	            onSubmit={handleSubmitForm}
	            render={formProps => {
	            const { values, isSubmitting, errors, handleChange, handleBlur, handleSubmit, isValid, touched, setFieldValue } = formProps
		          return(
						      <Modal open={true} size='tiny' onClose={()=>closeModal(false)}>
					        <Modal.Header>Order Details<span className="floatright" onClick={()=>closeModal(false)}><i className="ti-close"></i></span></Modal.Header>
						      <Modal.Content className="modalcontent modalorder">
                  {isucess&&Success()}
                  {iserror&&Error()}


                  <Form>
                        <div className="columns is-mobile">
                          <div className="column is-one-quarter"><label className="inlinelabel">Merchant Store</label></div>
                          <div className="column">
                              <Form.Group widths='equal'>
                                  <Field name="merchant_id">
                                      {({ field, form }) => (
                                      <Form.Field className={(() => {return form.touched[field.name] && form.errors[field.name] ? 'error' : "";})()}>
                                          <Select fluid
                                              selectOnBlur={false}
                                              search
                                              selection
                                              options={props.data.list}
                                              {...field}
                                              onChange={(e, { value }) => {
                                                setFieldValue(field.name, value);
                                              }}
                                              placeholder="Choose Merchant Store"/>
                                          { form.touched[field.name] && form.errors[field.name] && <Label className="ui above prompt label errorlabel"><i class="fa fa-exclamation-triangle"></i>{form.errors[field.name]}</Label> }
                                      </Form.Field>
                                      )}
                                  </Field>
                              </Form.Group>
                          </div>
                      </div>
                      <div className="columns is-mobile">
                        <div className="column is-one-quarter"><label className="inlinelabel">Affiliate</label></div>
                        <div className="column">
                            <Form.Group widths='equal'>
                                <Field name="affiliate_id">
                                    {({ field, form }) => (
                                    <Form.Field className={(() => {return form.touched[field.name] && form.errors[field.name] ? 'error' : "";})()}>
                                        <Select fluid
                                            selectOnBlur={false}
                                            search
                                            selection
                                            options={props.data.afflist}
                                            {...field}
                                            onChange={(e, { value }) => {
                                              setFieldValue(field.name, value);
                                              getaffiliateinfo(value);
                                            }}
                                            placeholder="Choose affiliate"/>
                                        { form.touched[field.name] && form.errors[field.name] && <Label className="ui above prompt label errorlabel"><i class="fa fa-exclamation-triangle"></i>{form.errors[field.name]}</Label> }
                                    </Form.Field>
                                    )}
                                </Field>
                            </Form.Group>
                        </div>
                    </div>

                      <div className="columns is-mobile">
                          <div className="column is-one-quarter"><label className="inlinelabel">Order ID</label></div>
                          <div className="column">
                              <Form.Group widths='equal'>
                                  <Field name="order_id">
                                      {({ field, form }) => (
                                        <Form.Field className={(() => {return form.touched[field.name] && form.errors[field.name] ? 'error' : "";})()}>
                                          <Input fluid {...field} onChange={handleChange}/>
                                          { form.touched[field.name] && form.errors[field.name] && <Label className="ui above prompt label errorlabel"><i class="fa fa-exclamation-triangle"></i>{form.errors[field.name]}</Label> }
                                        </Form.Field>
                                      )}
                                  </Field>
                              </Form.Group>
                          </div>
                      </div>

                      <div className="columns is-mobile">
                          <div className="column is-one-quarter"><label className="inlinelabel">Tracking Method</label></div>
                          <div className="column">
                              <Form.Group widths='equal'>
                              <Field name="tracking_method">
                                  {({ field, form }) => (
                                  <Form.Field className={(() => {return form.touched[field.name] && form.errors[field.name] ? 'error' : "";})()}>
                                      <Select fluid
                                          options={[
                                              { key: '0', text: 'Tracking by link', value: 'Tracking by link' },
                                              { key: '1', text: 'Tracking by code', value: 'Tracking by code' },
                                              { key: '2', text: 'Tracking by qr', value: 'Tracking by qr' },
                                              { key: '3', text: 'Tracking by sku', value: 'Tracking by sku' },
                                              { key: '4', text: 'Tracking by email', value: 'Tracking by email' },
                                          ]}
                                          {...field}
                                          onChange={(e, { value }) => setFieldValue(field.name, value)}/>
                                      { form.touched[field.name] && form.errors[field.name] && <Label className="ui pointing above prompt label">{form.errors[field.name]}</Label> }
                                  </Form.Field>
                                  )}
                              </Field>
                              </Form.Group>
                          </div>
                      </div>

                      <div className="columns is-mobile">
                          <div className="column is-one-quarter"><label className="inlinelabel">Order Price</label></div>
                          <div className="column">
                              <Form.Group widths='equal'>
                              <Field name="order_price">
                                  {({ field, form }) => (
                                  <Form.Field className={(() => {return form.touched[field.name] && form.errors[field.name] ? 'error' : "";})()}>
                                      <Input iconPosition='left'>
                                          <Icon name='dollar' />
                                          <Cleave {...field} options={{numeral: true,numeralThousandsGroupStyle: 'thousand'}}
                                            onChange={(e)=>{
                                              setFieldValue(field.name, e.target.value);
                                              var percent = affpercent/100;
                                              var price   = parseFloat(e.target.value.replace(/,/g, ''));
                                              if(price==''||price==null||price==undefined||affpercent==0){return false;}
                                              var earnings = percent*price;
                                              setFieldValue('aff_earnings', earnings);
                                            }}
                                            />
                                      </Input>
                                      { form.touched[field.name] && form.errors[field.name] && <Label className="ui above prompt label errorlabel"><i class="fa fa-exclamation-triangle"></i>{form.errors[field.name]}</Label> }
                                  </Form.Field>
                                  )}
                              </Field>
                              </Form.Group>
                          </div>
                      </div>

                      <div className="columns is-mobile">
                          <div className="column is-one-quarter"><label className="inlinelabel">Affiliate Earnings</label></div>
                          <div className="column">
                              <Form.Group widths='equal'>
                              <Field name="aff_earnings">
                                  {({ field, form }) => (
                                  <Form.Field className={(() => {return form.touched[field.name] && form.errors[field.name] ? 'error' : "";})()}>
                                      <Input iconPosition='left'>
                                          <Icon name='dollar' />
                                          <Cleave {...field} options={{numeral: true,numeralThousandsGroupStyle: 'thousand'}} onChange={handleChange}/>
                                          <Button
                                              color='green'
                                              icon='calculator'
                                              labelPosition='left'
                                              content="Calculate"
                                              onClick={()=>{
                                                var percent = affpercent/100;
                                                var price   = parseFloat(values.order_price.replace(/,/g, ''));;
                                                if(price==''||price==null||price==undefined){return false;}
                                                var earnings = percent*price;
                                                setFieldValue(field.name, earnings);
                                              }}
                                              style={{margin:'0 0 0 5px'}}
                                          />
                                      </Input>
                                      { form.touched[field.name] && form.errors[field.name] && <Label className="ui above prompt label errorlabel"><i class="fa fa-exclamation-triangle"></i>{form.errors[field.name]}</Label> }
                                  </Form.Field>
                                  )}
                              </Field>
                              </Form.Group>
                          </div>
                      </div>

                      <div className="columns is-mobile">
                          <div className="column is-one-quarter"><label className="inlinelabel">Date</label></div>
                          <div className="column">
                              <Form.Group widths='equal'>
                              <Field name="date_order">
                                  {({ field, form }) => (
                                  <Form.Field className={(() => {return form.touched[field.name] && form.errors[field.name] ? 'error' : "";})()}>
                                      <div className="date-wrapper">
                                          <DatePicker
                                              selected={date_dummy}
                                              onChange={date => {
                                                  if(date==null||date==''){
                                                      setdate_dummy('');
                                                      setFieldValue('date_order','');
                                                      return false;
                                                  }
                                                  var fromdate     = moment(new Date(date)).format('MM/DD/YYYY');
                                                  fromdate         = new Date(fromdate);
                                                  setdate_dummy(fromdate);
                                                  setFieldValue('date_order',fromdate);
                                              }}
                                          />
                                      </div>
                                      { form.touched[field.name] && form.errors[field.name] && <Label className="ui above prompt label errorlabel"><i class="fa fa-exclamation-triangle"></i>{form.errors[field.name]}</Label> }
                                  </Form.Field>
                                  )}
                              </Field>
                              </Form.Group>
                          </div>
                      </div>

                      <div className="columns is-mobile">
                          <div className="column is-one-quarter"><label className="inlinelabel">Order Status</label></div>
                          <div className="column">
                              <Form.Group widths='equal'>
                                  <Field name="order_status">
                                      {({ field, form }) => (
                                      <Form.Field className={(() => {return form.touched[field.name] && form.errors[field.name] ? 'error' : "";})()}>
                                          <Select fluid
                                              options={[
                                                  { key: '0', text: 'Paid', value: 'Paid' },
                                                  { key: '1', text: 'Not paid', value: 'Not paid' },
                                                  { key: '2', text: 'Incomplete', value: 'Incomplete' },
                                                  { key: '3', text: 'Cancelled', value: 'Cancelled' },
                                                  { key: '4', text: 'Refunded', value: 'Refunded' },
                                                  { key: '5', text: 'Hidden', value: 'Hidden' },
                                              ]}
                                              {...field}
                                              onChange={(e, { value }) => setFieldValue(field.name, value)}/>
                                          { form.touched[field.name] && form.errors[field.name] && <Label className="ui pointing above prompt label">{form.errors[field.name]}</Label> }
                                      </Form.Field>
                                      )}
                                  </Field>
                              </Form.Group>
                          </div>
                      </div>

                      <div className="columns is-mobile">
                          <div className="column is-one-quarter"><label className="inlinelabel">Landing Page</label></div>
                          <div className="column">
                              <Form.Group widths='equal'>
                              <Field name="landing_page">
                                  {({ field, form }) => (
                                  <Form.Field className={(() => {return form.touched[field.name] && form.errors[field.name] ? 'error' : "";})()}>
                                      <Input fluid {...field} onChange={handleChange} placeholder="The first page client open, optional"/>
                                      { form.touched[field.name] && form.errors[field.name] && <Label className="ui above prompt label errorlabel"><i class="fa fa-exclamation-triangle"></i>{form.errors[field.name]}</Label> }
                                  </Form.Field>
                                  )}
                              </Field>
                              </Form.Group>
                          </div>
                      </div>

                      <div className="columns is-mobile">
                          <div className="column is-one-quarter"><label className="inlinelabel">Referal Page</label></div>
                          <div className="column">
                              <Form.Group widths='equal'>
                              <Field name="referal_page">
                                  {({ field, form }) => (
                                  <Form.Field className={(() => {return form.touched[field.name] && form.errors[field.name] ? 'error' : "";})()}>
                                      <Input fluid {...field} onChange={handleChange} placeholder="From where the client came, optional"/>
                                      { form.touched[field.name] && form.errors[field.name] && <Label className="ui above prompt label errorlabel"><i class="fa fa-exclamation-triangle"></i>{form.errors[field.name]}</Label> }
                                  </Form.Field>
                                  )}
                              </Field>
                              </Form.Group>
                          </div>
                      </div>


                      <div className="columns is-mobile">
                          <div className="column is-one-quarter"><label className="inlinelabel">Notes</label></div>
                          <div className="column">
                              <Form.Group widths='equal'>
                              <Field name="notes">
                                  {({ field, form }) => (
                                  <Form.Field className={(() => {return form.touched[field.name] && form.errors[field.name] ? 'error' : "";})()}>
                                      <TextArea fluid {...field} onChange={handleChange} placeholder="Order notes if neccessary, visible only to you"/>
                                      { form.touched[field.name] && form.errors[field.name] && <Label className="ui above prompt label errorlabel"><i class="fa fa-exclamation-triangle"></i>{form.errors[field.name]}</Label> }
                                  </Form.Field>
                                  )}
                              </Field>
                              </Form.Group>
                          </div>
                      </div>
                </Form>

						    </Modal.Content>
  						    <Modal.Actions>
  						        <div className="positionright">
  	                       <Button
  									        loading={spinner}
  						              color='blue'
  						              icon='check circle'
  						              labelPosition='right'
  						              content="Update and exit"
  						              onClick={() => buttonSubmit(1)}
  						            />
  									   <button type="button" className="display-none" type="button" ref={buttonEl} onClick={handleSubmit}></button>
  								    </div>
  						    </Modal.Actions>
					     </Modal>
				 )}}/>
		</div>
	)
}
