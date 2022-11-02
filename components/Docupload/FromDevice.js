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



  // const onDrop = useCallback((acceptedFiles) => {
  //   acceptedFiles.forEach((file) => {
  //     Object.assign(file, {
  //       preview: URL.createObjectURL(file)
  //     })
      
  //     console.log('fileeee', file)
  //     let fileurl = file.preview;
  //     let fileurl2 = encodeURI(fileurl)
  //     console.log('fileurlfileurl', fileurl2)
  //     const reader = new FileReader()

  //     reader.onabort = () => console.log('file reading was aborted')
  //     reader.onerror = () => console.log('file reading has failed')
  //     reader.onload = () => {
  //     // Do whatever you want with the file contents
  //     // console.log('readeeeer', reader)
  //       const binaryStr = reader.result
  //       // console.log('nnnnnnnnnnn', binaryStr)
  //       // let data = Base64.atob(binaryStr);
  //       // var decodedData = base64_decode(binaryStr);
  //       // console.log('decodedDatadecodedData', decodedData)
  //       uploadDocumentData(binaryStr)

  //     }
  //     reader.readAsBinaryString(file)
  //     //call document upload 
  //     // const base64String = btoa(String.fromCharCode(...new Uint8Array(reader.result)));
  //     // console.log('base64Stringbase64String', base64String)
  //   //   console.log("Uploading document");
  //   //   // var self = this;
  //   //   // var credentials = this.username + ':' + this.passw;
  //   //   var options ={
  //   //     url :  'https://stage-rest.click2mail.com/molpro/documents/',
  //   //     //port: 443,
  //   //     method: 'POST',
  //   //      headers: {
  //   //   'Authorization': 'Basic Y2xpY2sybWFpbDEyMzpDbGljazJtYWlsQDEyMw==',
  //   //   // 'X-Auth-UserId': '7934e8c0ca659746fcbb35e65f20913e',
  //   //   'Content-Type': 'multipart/form-data'
  //   //   },
  //   //   formData: {
  //   //   //  'file':fs.createReadStream(docOptions.pdfFile),
  //   //   //  'file':reader.readAsDataURL(fileurl2),
  //   //    'file':binaryStr,
  //   //    'documentFormat':'PDF',
  //   //    'documentClass':'Letter 8.5 x 11',
  //   //    'documentName': 'shashank',
  //   //   }
  //   // }
  //   //   let response = axios.post(options)
  //   //   console.log('66666666666666', response)
  //   })
    
  // }, [])

  // const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop})
  
  // Upload the document to the click2mail server
    // Upload the downloded pdf extracted from Google drive
  // const uploadDocumentData = async(formData) => {
  //   console.log('yyyyyyyyyyyyy', formData)
  //   const url = '/documents';
  //   const headers = {
  //       'Content-Type': 'multipart/form-data',
  //       'X-Auth-UserId': '5da047eb6bd23d481e5ebbbc80a301c4'
  //   }

  //   const proxy = {
  //       host: 'localhost',
  //       port: 3000,
  //       'Content-Type': 'multipart/form-data',
  //       'X-Auth-UserId': '5da047eb6bd23d481e5ebbbc80a301c4'
  //     }

  //   const payload = {
  //       'documentFormat':'PDF',
  //       'documentClass':'Letter 8.5 x 11',
  //       'documentName': 'shashank',
  //       'file' : formData
  //       // 'file' : test,
  //   }

  //   const options = {
  //     onUploadProgress: (progressEvent) => {
  //       const {loaded, total} = progressEvent;
  //       let percent = Math.floor( (loaded * 100) / total )
  //       setBar(`${loaded}kb of ${total}kb | ${percent}%` );
  //     }
  //   }

  //   const body = qs.stringify(payload)
  //   // const body = payload
  //   const res = await APIService.post(url, body, proxy, options );
  //   if (res.status === 200) {
  //       console.log('Document uploaded successfully');
  //   } else {
  //       console.log('Document upload failed');
  //   }
  // }



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