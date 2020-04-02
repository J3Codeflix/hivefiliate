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
		props.textalertMessage('Banner successfully deleted');
	}

    function deleteConfirmProcess(){
        setspinner(true);
        let formData = new FormData();
         
        formData.append('type','merchant_deletebanner');
        formData.append('id',props.idCallback.id);
        formData.append('filename',props.idCallback.file_name);
        axios.post('/merchant/banners/request.php',formData)
        .then(function (response) {
          let obj = response.data;
          setspinner(false);
          if(obj==1){
            reloadList();
            showAlert(true);
            closeModal(false);}
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
            <p>Are you sure you want to delete this record? You can't revert this proccess.</p>
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

