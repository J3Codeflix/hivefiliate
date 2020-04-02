import _ from 'lodash'
import React, {useState,useRef,useEffect, useContext} from 'react'
import { Form, Input, TextArea, Button, Select, Label, Dropdown, Dimmer, Loader, Icon, Message, Modal, Checkbox, Table } from 'semantic-ui-react'
import renderHTML from 'react-render-html'
import {Spinning, Success, Error} from '../../../../../config/spinner'

export default function AccountComponent(props) {

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

	return (
		<div className="modalwrapper">
		      <Modal open={true} size='large' onClose={()=>closeModal(false)}>
	        <Modal.Header>Account: {props.data.store_name}<span className="floatright" onClick={()=>closeModal(false)}><i className="ti-close"></i></span></Modal.Header>
		      <Modal.Content className="modalcontent colormodal">

          <div className="package-currentplan boxplan">
               <Table celled striped>
                  <Table.Body>
                    <Table.Row>
                      <Table.Cell collapsing><Icon name='bullseye' /> ID</Table.Cell>
                      <Table.Cell>{props.data.id}</Table.Cell>
                    </Table.Row>
                    <Table.Row>
                      <Table.Cell collapsing><Icon name='bullseye' /> Email</Table.Cell>
                      <Table.Cell>{props.data.email}</Table.Cell>
                    </Table.Row>
                    <Table.Row>
                      <Table.Cell collapsing><Icon name='bullseye' /> Store Name</Table.Cell>
                      <Table.Cell>{props.data.store_name}</Table.Cell>
                    </Table.Row>
                    <Table.Row>
                      <Table.Cell collapsing><Icon name='bullseye' /> Date Registered</Table.Cell>
                      <Table.Cell>{props.data.dateadded}</Table.Cell>
                    </Table.Row>
                    <Table.Row>
                      <Table.Cell collapsing><Icon name='bullseye' /> Type Plan</Table.Cell>
                      <Table.Cell>{renderHTML(props.data.type_plan)}</Table.Cell>
                    </Table.Row>
                    <Table.Row>
                      <Table.Cell collapsing><Icon name='bullseye' /> Price Plan</Table.Cell>
                      <Table.Cell>{props.data.price_plan}</Table.Cell>
                    </Table.Row>
                    <Table.Row>
                      <Table.Cell collapsing><Icon name='bullseye' /> Status</Table.Cell>
                      <Table.Cell>{renderHTML(props.data.status)}</Table.Cell>
                    </Table.Row>
                    <Table.Row>
                      <Table.Cell collapsing><Icon name='bullseye' /> Date Expiration</Table.Cell>
                      <Table.Cell>{props.data.plan_expire}</Table.Cell>
                    </Table.Row>
                    <Table.Row>
                      <Table.Cell collapsing><Icon name='bullseye' /> Rem. Days</Table.Cell>
                      <Table.Cell>{props.data.days_remaining}</Table.Cell>
                    </Table.Row>
                  </Table.Body>
               </Table>
            </div>

		    </Modal.Content>
	     </Modal>

		</div>
	)
}
