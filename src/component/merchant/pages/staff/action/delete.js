import React, {useState} from 'react'
import { Modal,Button,Message,Grid ,Icon} from 'semantic-ui-react'
import {Spinning} from '../../../../include/circlespin'
import axios from 'axios'
export default function Delete(props) {

    const [spinner,setspinner] = useState(false);


    function closeModal(data){
		props.closeTrigger(data);
	}
	function reloadList(){
		props.reloadTrigger(true);
	}
	function showAlert(data){
		props.showAlertMessage(data);
		props.textalertMessage('Staff successfully deleted');
	}

    function deleteConfirmProcess(){
        setspinner(true);
        let formData = new FormData();
         
        formData.append('type','merchant_deletstaff');
        formData.append('id',props.idCallback);
        axios.post('/merchant/staff/request.php',formData)
        .then(function (response) {
          let obj = response.data;
          setspinner(false);
          if(obj==1){reloadList();showAlert(true);closeModal(false);}
		  //if(obj==0){reloadList();}
        })
        .catch(function (error) {
            console.log(error);
        });
    }


    return (
        <Modal open={true} size='mini' onClose={()=>closeModal()}>
          {spinner&&<Spinning/>}
          <Modal.Content className="iconaction iconwarning" >
            <i className="ti-info-alt"></i>
            {props.idCallback=='all'&&<p>Are you sure you want to delete all records? You can't revert this proccess.</p>}
            {props.idCallback>0&&<p>Are you sure you want to delete this record? You can't revert this proccess.</p>}
          </Modal.Content>
          <Modal.Actions className="positioncenter">
            <Button color='red' onClick={()=> closeModal()}>Cancel</Button>
            <Button
              color='green'
              icon='checkmark'
              labelPosition='right'
              content='Yes, Confirm'
              onClick={()=>deleteConfirmProcess()}
            />
          </Modal.Actions>
        </Modal>
    );
}

