import { useState, useEffect, useContext, useCallback } from 'react'
// import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios';
// import base64str from "base-64";
import qs from 'qs';
import APIService from '../../helper/APIService';
import { NavContext } from '../Context/NavContextProvider';
// import { FileUploader } from "react-drag-drop-files";
import { convertXmltoJson } from '../../helper/helper'
import {useRouter} from 'next/router';



const FromDevice = () => {
  const router = useRouter();
  const fileTypes = ["PDF"];
  const { state, setState } = useContext(NavContext);
  const [file, setFile] = useState(null);
  const [fileData, setFileData] = useState();
  const {sessionId } = state;
  const [bar, setBar] = useState();




const selectSize = () => {
  router.push('/changesize', undefined, {scroll: false});
}

 
const handleFileSelected = async (e) => {
  const files = Array.from(e.target.files)
  console.log('filesssss', files, files[0])
  const url = '/documents';
  let documentName = files.name
  var myHeaders = new Headers();

  myHeaders.append("user-agent", "my-app/0.0.1");
  myHeaders.append("Accept", "application/xml");
  myHeaders.append("Content-Type", "multipart/form-data");
  // myHeaders.append("X-Auth-UserId", "6305cbbe4ef21732dd287b0950b184d2");
  myHeaders.append('Authorization', 'Basic Y2xpY2sybWFpbDEyMzpDbGljazJtYWlsQDEyMw==');
  

  var formdata = new FormData();
  formdata.append("documentFormat", "PDF");
  formdata.append("documentClass", "Letter 8.5 x 11");
  formdata.append("file", files[0], "proof (3) (1).pdf");
  formdata.append("documentName", "Sample Letter");

  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: formdata,
    redirect: 'follow'
  };

  const res = await APIService.post( url, formdata, myHeaders, requestOptions);
  if (res.status === 200 || res.status === 201) {
    console.log('Document uploaded successfully', res.data);
    const {document} = convertXmltoJson(res.data);
    setState({...state, documentId: document.id.text, documentName: documentName});
    selectSize()
  }
}

  return (
        <div className=" tab-pane" id="device">
        <div className="row  dashedBorder">
          <div className="col-lg-12 p-0 table-responsive fixedHeight d-flex flex-column justify-content-center align-content-center align-items-center footAction">
            <h4 className="fw-20 themeBlack fw-bold mb-0 ">Drag a file here</h4>
            <p className="fw-12 textGray py-3">Or, if you prefer...</p>
            <label className="btn btn-primary" >Select a file from your device</label>
            <input onChange = { handleFileSelected} type = "file" id="uploadBtn" className="d-none" /> 
          </div>
        </div>
      </div>     
)
}
export default FromDevice