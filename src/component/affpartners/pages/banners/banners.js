import React, {useState, useEffect} from 'react'
import { Form, Input, TextArea, Button, Select, Label, Dropdown, Accordion, Menu, Segment, Message, Modal, Header, Icon, Image, Table } from 'semantic-ui-react'
import {Spinning} from '../../../include/circlespin'
import {windowReload,Public_URL} from '../../../include/merchant_redirect'
import renderHTML from 'react-render-html'
import AlertSuccess from '../../../include/alertsuccess'
import AlertError from '../../../include/alerterror'

import GenerateHTML from './action/generatehtml'

import axios from 'axios'
export default function Banners(props) {

    const [spinner, setspinner]           = useState(false);
    const [listofbann, setlistofbann]     = useState([]);
    const [banset, setbanset]             = useState(0);
    const [openmodal, setopenmodal]       = useState(false);
    const [data, setdata] = useState({});

    function closemodal(data){
       setopenmodal(data);
    }
    function openGenerator(image,id,url_banner,banner_width,banner_height){
       setdata({
         ...data,
         image:image,
         id:id,
         url_banner:url_banner,
         banner_width:banner_width,
         banner_height:banner_height
       })
       setopenmodal(true);
    }

    function Listbanner(){
        setspinner(true);
        let formData = new FormData();
        formData.append('type','affiliates_banner');
        axios.post('/affiliates/banners/request.php',formData)
        .then(function (response) {
            let obj = response.data;
            setlistofbann(obj.list);
            setbanset(obj.settings);
        })
        .catch(function (error) {
            console.log(error);
        });
    }


    useEffect(()=>{
        Listbanner();
    },[]);


	return (
		<React.Fragment>
	        <div className="banners pagecontent">

                <div className="bannerslist-wrapper">
                    {banset!=0&&<Message
                      positive
                      icon='info circle'
                      header='Banners Note'
                      content={renderHTML(banset)}
                    />}
                    {listofbann.length==0&&<div className="nobanners">
                        <h1>No banner has been added</h1>
                    </div>}
                    {listofbann.map(function(data, key){
                        return<div className="banners-list">
                            <div className="columns">
                                <div className="column is-one-third">
                                    <div className="banner-image"><img src={data.image}/></div>
                                    <div className="bannersbuttonaff">
                                        <Button className="green" icon labelPosition='left' onClick={()=>{
                                              openGenerator(data.image,data.id,data.url_banner,data.banner_width,data.banner_height);
                                        }}>Get HTML Code<Icon name='code' /></Button>
                                      <Button as="a" href={data.image} download className="blue" icon labelPosition='left'>Download<Icon name='cloud download' /></Button>
                                    </div>
                                </div>
                                <div className="column">
                                    <div className="banner-description">
                                        <div className="columns is-mobile">
                                            <div className="column is-one-fifth"><h2>Name</h2></div>
                                            <div className="column">{data.name}</div>
                                        </div>
                                        <div className="columns is-mobile">
                                            <div className="column is-one-fifth"><h2>Dimension</h2></div>
                                            <div className="column">{data.dimension}</div>
                                        </div>
                                        <div className="columns is-mobile">
                                            <div className="column is-one-fifth"><h2>Category</h2></div>
                                            <div className="column">{data.bann_catname}</div>
                                        </div>
                                        <div className="columns is-mobile">
                                            <div className="column is-one-fifth"><h2>Set URL</h2></div>
                                            <div className="column">{data.url_banner}</div>
                                        </div>
                                        <div className="columns is-mobile">
                                            <div className="column is-one-fifth"><h2>Notes</h2></div>
                                            <div className="column">{data.note_banner}</div>
                                        </div>
                                        <div className="columns is-mobile">
                                            <div className="column is-one-fifth"><h2>Uploaded on</h2></div>
                                            <div className="column">{data.dateadded}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    })}
                </div>

                {openmodal&&<GenerateHTML close={closemodal} data={data}/>}

        </div>
		</React.Fragment>
	)
}
