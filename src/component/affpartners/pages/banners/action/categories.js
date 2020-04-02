import _ from 'lodash'
import React, {useState,useRef,useEffect, useContext} from 'react'
import { Formik, Field } from 'formik'
import { Form, Input, TextArea, Button, Select, Label, Dropdown, Checkbox, Loader, Table, Icon, Message, Modal } from 'semantic-ui-react'
import {getvalidationcat} from './validate'
import axios from 'axios'

import renderHTML from 'react-render-html'

import AlertSuccess from '../../../../include/alertsuccess'
import AlertError from '../../../../include/alerterror'

export default function Categories(props) {


	/* Spinner and Alert */
	const [spinner, setspinner] = useState(false);
	const [successmsg, setsuccess] = useState(false);
	const [errormsg, seterror] = useState(false);
	const [textCustom, settextCustom] = useState('Category successfully added');
	function CloseAlert(data){
		setsuccess(data);
		seterror(data);
	}

   /* Button Element Click */
   const buttonEl = useRef(null);
   const [buttonclick, setbuttonClick] = useState(0);
   function buttonSubmit(arg){
        setbuttonClick(arg);
        buttonEl.current.click();
    }


   /* Modal close */
  function closeModal(data){
		props.closeTrigger(data);
	}
	function reloadList(){
		props.reloadTrigger(true);
	}
	function showAlert(data){
		props.showAlertMessage(data);
		props.textalertMessage('Category successfully added');
	}


   /* Form state and Submit  */
    const [isoff, setisoff] = useState('off');
		const [state, setstate] = useState({
			affiliate_id:[],
			category_name:'',
		});

   function handleSubmitForm(values, { props = this.props, setSubmitting, resetForm, setErrors }){

		setspinner(true);
		CloseAlert(false);
		let formData = new FormData();
		formData.append('type','merchant_banncategories');
		formData.append('info',JSON.stringify(values));
		axios.post('/merchant/banners/request.php',formData)
		.then(function (response) {
			let obj = response.data;
			if(obj==1){
				resetForm();
				if(buttonclick==1){reloadList();showAlert(true);closeModal(false);}
				if(buttonclick==2){getlistbannercategories();reloadList();setsuccess(true);}
				setspinner(false);
				return false;
			}
			setspinner(false);
			if(obj==0){resetForm();seterror(true);return false;}
			Object.keys(obj).forEach(function(key) {setErrors(obj)});
		})
		.catch(function (error) {resetForm();seterror(true);return false;});
   }

   const [arraff, setarraff] = useState([]);
   const [optaffiliate, setoptionaffiliate] = useState([]);
   const [list, setlisttable] = useState([]);

   function getAffiliate(){
        let formData = new FormData();
        formData.append('type','merchant_listofaffiliates');
        axios.post('/merchant/banners/request.php',formData)
        .then(function (response) {
			  let obj = response.data;
            setoptionaffiliate(obj);
        })
        .catch(function (error) {return false;});
   }

   function getlistbannercategories(){
			let formData = new FormData();
			formData.append('type','merchant_listcategories');
			axios.post('/merchant/banners/request.php',formData)
			.then(function (response) {
				let obj = response.data;
				setlisttable(obj);
			})
			.catch(function (error) {return false;});
	}

  const renderLabel = (label) => ({
		color: 'green',
		content: `${label.text}`,
	});

	function deleteCategories($id){
		let formData = new FormData();
		formData.append('type','merchant_categoriesremove');
		formData.append('id',$id);
		axios.post('/merchant/banners/request.php',formData)
		.then(function (response) {
			let obj = response.data;
			if(obj==1){settextCustom('Successfully removed');setsuccess(true);}
			getlistbannercategories();
		})
		.catch(function (error) {return false;});
	}


  useEffect(()=>{
		getAffiliate();
		getlistbannercategories();
  },[]);

	return (
		<div className="modalwrapper">
		     <Formik
	            initialValues={state}
	            validationSchema={getvalidationcat}
	            onSubmit={handleSubmitForm}
	            render={formProps => {
	            const { values, isSubmitting, errors, handleChange, handleBlur, handleSubmit, isValid, touched, setFieldValue } = formProps
		          return(
								<Modal open={true} size='small'>
					        <Modal.Header>Banners Categories<span className="floatright" onClick={()=>closeModal(false)}><i className="ti-close"></i></span></Modal.Header>
						    <Modal.Content className="modalcontent">

							{successmsg&&<AlertSuccess CloseTheAlert={CloseAlert} sizeWidth='full' TextAlert={textCustom}/>}
							{errormsg&&<AlertError CloseTheAlert={CloseAlert} sizeWidth='full' TextAlert='Category not successfully added'/>}

							<Form>
								<Form.Group widths='equal'>
									<Field name="category_name">
									{({ field, form }) => (
										<Form.Field className={(() => {return form.touched[field.name] && form.errors[field.name] ? 'error' : "";})()}>
										<label>Category Name</label>
										<Input fluid {...field} onChange={handleChange}/>
										{ form.touched[field.name] && form.errors[field.name] && <Label className="ui prompt label errorlabel"><Icon name='warning'/>{form.errors[field.name]}</Label> }
										</Form.Field>
									)}
									</Field>
								</Form.Group>
								<Form.Group widths='equal'>
									<Field name="affiliate_id">
									{({ field, form }) => (
										<Form.Field className={(() => {return form.touched[field.name] && form.errors[field.name] ? 'error' : "";})()}>
										<label>Visible for affiliates</label>
										<Dropdown
											closeOnChange
											selectOnBlur={false}
											placeholder='Select Affiliate'
											fluid
											multiple
											selection
											options={optaffiliate}
											renderLabel={renderLabel}
											{...field}
											onChange={(e, { value }) => setFieldValue(field.name, value)}
										/>
										{ form.touched[field.name] && form.errors[field.name] && <Label className="ui prompt label errorlabel"><Icon name='warning'/>{form.errors[field.name]}</Label> }
										</Form.Field>
									)}
									</Field>
								</Form.Group>
							</Form>

							<Message warning>Here you can create your banner categories and set affiliates permissions. If you wish the category to be visible only by specific affiliates, select affiliate in the field "Visible for affiliates". If you wish the category to visible by all, leave "Visible for affiliates" empty.</Message>

							<div className="banners-categories">
								<div className="table-wrapper">
									<h2 className="subtitle">Banner Categories List</h2>
									<div className="table-responsive">
										<Table celled selectable compact>
											<Table.Header>
												<Table.Row>
													<Table.HeaderCell>Category Name</Table.HeaderCell>
													<Table.HeaderCell>Affiliate</Table.HeaderCell>
													<Table.HeaderCell>Action</Table.HeaderCell>
												</Table.Row>
											</Table.Header>
											<Table.Body>
											{list.length==0&&<Table.Row negative><Table.Cell  colSpan='3' textAlign="center">No record found</Table.Cell></Table.Row>}
											{list.map(function(data, key){
												return <Table.Row key={key} className={data.statcolor}>
													<Table.Cell>{data.category_name}</Table.Cell>
													<Table.Cell>{renderHTML(data.affiliate_id)}</Table.Cell>
													<Table.Cell collapsing><Button size='tiny' className="red" icon onClick={()=>deleteCategories(data.id)}><Icon name='trash alternate outline' /> Remove</Button></Table.Cell>
												</Table.Row>
												})}
											</Table.Body>
										</Table>
									</div>
								</div>
							</div>

					 </Modal.Content>
				    <Modal.Actions>
				        <div className="positionright">
									<Button
									  			loading={spinner}
						              color='black'
						              icon='check circle'
						              labelPosition='right'
						              content="Save and exit"
						              onClick={() => buttonSubmit(1)}
						            />
		              <Button
									  		loading={spinner}
						              color='blue'
						              icon='check circle'
						              labelPosition='right'
						              content="Save and stay"
						              onClick={() => buttonSubmit(2)}
						            />
									<button type="button" className="display-none" type="button" ref={buttonEl} onClick={handleSubmit}></button>
								</div>
				    </Modal.Actions>
			     </Modal>
				 )}}/>
		</div>
	)
}
