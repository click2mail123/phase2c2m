import { useState, useEffect, useContext } from 'react'
import qs from 'qs';
import { useRouter } from 'next/router';
import APIService from '../../helper/APIService'
import { NavContext } from '../../components/Context/NavContextProvider'
import Modal from '../../components/Modal/Modal';
import { convertXmltoJson } from '../../helper/helper';
import Loader from '../../components/Shared/Loader';
import ErrorMessage from '../../components/Shared/ErrorMessage';

const DocumentApproval = () => {
  const router = useRouter();
  const { state, setState } = useContext(NavContext);
  const { jobId, proofId, proofStatus, globalproofUrl } = state;
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  /*******  Create Proof *********/
  const createProof = async (jobId) => {
    const headers = {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
    const payload = {
      id: jobId
    }
    const body = qs.stringify(payload)

    setLoading(true);
    const res = await APIService.post(`/jobs/${jobId}/proof`, body, headers);
    if (res.status === 200 || res.status === 201) {
      const { job } = convertXmltoJson(res.data)
      if (job && job.id) {
        setProofUrl(job.statusUrl.text);
        setState({ ...state, proofId: job.id.text });
      }
    } else {
      setError(true);
      setErrorMessage({ heading: "Please wait 5 minutes and try again. One of our APIs has not responded in time." })
    }
    setLoading(false);
  }

  const handleModalClose = () => {
    setIsModalOpen(false);
    router.push('/', undefined, {scroll: false});
  }


  // const selectSize = () => {
  //   router.push('/changesize', undefined, {scroll: false});
  // }

 
  return (
    <div>
       {!error ?
        <Modal isOpen={isModalOpen} closeBtn={handleModalClose} sizeClass="big-modal">
        {loading ? <Loader /> :
            <div className="modal-content border-0 pt-4">
            <div className="modal-body pb-0">
                <div className="container">
                <div className="d-flex justify-content-between align-items-center row ">
                    <div className="col-lg-12 p-0">
                    <div>
                        <object
                        data={'https://mozilla.github.io/pdf.js/web/viewer.html?file=' + encodeURIComponent(globalproofUrl)}
                        type="application/pdf"
                        width="100%"
                        height="300"
                        >
                        <iframe
                            src={'https://mozilla.github.io/pdf.js/web/viewer.html?file=' + encodeURIComponent(globalproofUrl)}
                            width="100%"
                            height="300"
                        >
                            <p>This browser does not support PDF!</p>
                        </iframe>
                        </object>
                    </div>
                    </div>
                </div>
                </div>
            </div>
            {/* <button className="btn btn-primary approve-btn" onClick={selectSize}>Change Size</button> */}
            <div className="modal-footer justify-content-start align-items-start border-0 d-flex flex-column">
                <div className="d-flex flex-lg-row flex-lg-row flex-column">
                </div>
            </div>
            </div>
        }
        </Modal>
        : <ErrorMessage message={errorMessage} handleErrorClose={() => {
        setError(false)
        }} />
        }
    </div>
  )
}

export default DocumentApproval
