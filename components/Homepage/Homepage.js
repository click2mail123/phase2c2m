import { useState, useEffect, useContext } from 'react'
import axios from 'axios';
import dynamic from 'next/dynamic';
import {useRouter} from 'next/router';

import { NavContext } from '../Context/NavContextProvider';
import { convertXmltoJson } from '../../helper/helper'
import APIService from '../../helper/APIService'
const CurrentFund = dynamic(() => import('../Fund/CurrentFund'))
const Loader = dynamic(() => import('../Shared/Loader'))
const ErrorMessage = dynamic(() => import('../Shared/ErrorMessage'))
const HomepageDocument = dynamic(() => import('./HomepageDocument'))


const Homepage = (props) => {
  const router = useRouter();
  const { state, setState } = useContext(NavContext);
  const { sessionId,googleAuthObject, isMobile, documentId } = state;
  const [loading, setLoading] = useState(false);
  const [fileName, setFileName] = useState('');
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [loadingMessage, setLoadingMessage] = useState('');


  useEffect(() => {
    if(sessionId && (!documentId || !documentId === "")){
      extractDocParams()
    }
  }, [sessionId])


  //Extract all the parameters passed by google in the URl params
  const extractDocParams = async () => {
    setLoading(true);
    setLoadingMessage("Uploading document");
    // let Url = window.location;
    // let Url = new URL('https://script.google.com/macros/s/AKfycbzwVdcwLoQ-oHeWSgXP-7gqVjA62FZF9RbhKGsbjLHegskSf9FU/exec?state=%7B%22ids%22:%5B%2213Zfj_n9lSupvgXolIPMD_AYPwAnMTrcj%22%5D,%22action%22:%22open%22,%22userId%22:%22100867906112081097060%22,%22resourceKeys%22:%7B%7D%7D');
    // let decoded = decodeURIComponent(Url);
    // let params = decoded.substring(decoded.indexOf('?') + 7);

    let params = router.query.state;
    if(params){
      let stateParams = JSON.parse(params)
      let ids = stateParams.ids;
      let token = googleAuthObject.accessToken;

      const headers = {
        'Authorization': `Bearer ${token}`
      };

      let fileId = ids[0];
      let documentData = await axios.get(`https://www.googleapis.com/drive/v3/files/${fileId}`, { headers })
      let { name: fileName } = documentData.data;
      setFileName(fileName);
      let response = await axios.get(`https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`, { headers, 'responseType' : 'blob' })
      // call the document upload api
      if (response.status === 200) {
        let fileData = response.data;
        await uploadDocumentData(fileData, fileName);
      }
       else {
        setError(true);
        setErrorMessage({ heading: "Error in getting file from drive" })
        console.log('Something went wrong to get the file from google drive');
      }
    } else {
      setError(true);
      setErrorMessage({ heading: "Please use this application from google drive" })
      console.log('This will work only if we import file from drive');
    }
    setLoading(false);
  }

  const b64toBlob = (binary) => {
//     let l = binary.length
//       let array = new Uint8Array(l);
//       for (var i = 0; i<l; i++){
//         array[i] = binary.charCodeAt(i);
//       }
      let blob = new Blob([binary], {type: 'application/octet-stream'});
      return blob
  }

  // Upload the downloded pdf extracted from Google drive
  const uploadDocumentData = async (fileData, fileName) => {
    setLoading(true);
    setLoadingMessage("Uploading document");
    const documentName = fileName.split(".")[0];
    const url = '/documents';
    var formdata = new FormData();
    
    var myHeaders = new Headers();
    myHeaders.append("Accept", "application/json");

    
    formdata.append("documentFormat", "PDF");
    formdata.append("documentClass", "Letter 8.5 x 11");
    formdata.append("file",  b64toBlob(fileData), fileName);
    formdata.append("documentName", documentName);
    
    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: formdata,
      redirect: 'follow'
    };

    const res = await APIService.post( url, formdata, myHeaders, requestOptions);
    if (res.status === 200 || res.status === 201) {
      console.log('Document uploaded successfully');
      const {document} = convertXmltoJson(res.data);
      setState({...state, documentId: document.id.text, documentName: documentName});
    }
     else if(res.data.status === 400){ 
      setError(true);
      setErrorMessage({ heading: "File size is too big, Max number of supported pages are 47" })
      console.log('Document upload File size is too big, Max number of supported pages are 47');
    }
    else {
      setError(true);
      setErrorMessage({ heading: "Please wait 5 minutes and try again. One of our APIs has not responded in time." })
      console.log('Document upload failed');
    }
    setLoading(false);
  }

  return (
    <div>
      <main className="bannerBg homepage">
        {error ? <ErrorMessage message={errorMessage} handleErrorClose={() => setError(false)} className="homepage-error"/>  :
          loading ?
          <div className={!isMobile && "centered-loader"}>
            <Loader />
            <div className="text-center fw-20 mt-1">{loadingMessage}</div>
          </div> :
            <div className="container-xxl  d-flex flex-column h-100 justify-content-between position-relative">
              <CurrentFund showAddFund />
              <div className="d-flex justify-content-between flex-column flex-lg-row row">
                <div className="d-flex mt-3 flex-lg-column align-self-baseline w-tbl-G100 col-md-4" >
                  {/* Banner Start */}
                  <div className="card r-10  mb-lg-3 mb-3 mb-md-0  me-sm-1 h-350" >
                    <div className="card-body d-flex flex-column h-100 justify-content-center" >
                      <div className="text-center"><img src="/images/shortBanner.svg" alt="" className="shortbanner" /></div>
                      <div className="d-flex flex-column  align-items-center">
                        <h2 className="fw-bold text-center fw-26 my-4">Welcome!</h2>
                      </div>
                    </div>
                  </div>
                  {/* Banner End */}
                </div>
                <HomepageDocument fileName={fileName} />
              </div>
            </div>}
      </main>
    </div>
  )
}


export default Homepage;
