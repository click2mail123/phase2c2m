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
  const [isDisabled, setIsDisabled] = useState(true);
  const [isChecked, setIsChecked] = useState(false);
  const [initials, setIntials] = useState("");
  const [proofUrl, setProofUrl] = useState("");
  const [error, setError] = useState(false);
  const [selectsize, setselectsize] = useState(false);
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

//   useEffect(() => {
//     createProof(jobId)
//   }, [jobId])

//   useEffect(() => {
//     if (proofId && proofId !== "" && isChecked && initials && initials !== "") {
//       setIsDisabled(false);
//     } else {
//       setIsDisabled(true);
//     }
//   }, [proofId, isChecked, initials])

  const handleModalClose = () => {
    setIsModalOpen(false);
    router.push('/', undefined, {scroll: false});
  }


 
  const selectSize = () => {
    // setIsModalOpen(false);
    router.push('/changesize', undefined, {scroll: false});
  }

 
  return (
    <div>
       {!error ?
        <Modal isOpen={isModalOpen} closeBtn={handleModalClose} sizeClass="big-modal">
        {loading ? <Loader /> :
            <div className="modal-content border-0">
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
            {/* <a href={proofUrl} className={`btn btn-outline-primary mb-2 me-3 h-100 col-2`}> */}
            {/* <span>Change Size</span> */}
            <button className={`btn btn-primary `} onClick={selectSize}>Change Size</button>
            {/* </a> */}
            <div className="modal-footer justify-content-start align-items-start border-0 d-flex flex-column">
                <div className="d-flex flex-lg-row flex-lg-row flex-column">
                {/* <a href={proofUrl} className={`btn btn-outline-primary mb-2 me-3 h-100  col-lg-3 col-12`}> */}
                    {/* <img src="/images/download.svg" alt="Download" className="me-3"/> */}
                    {/* <span>Download Proof</span></a> */}
                {/* <div>
                    {!proofStatus &&
                    <>
                        <p className="mb-2 fw-bold">If  your document is correct, please approve by entering your initials below</p>
                        <div className="d-flex flex-lg-row flex-lg-row flex-column align-items-lg-center align-items-start justify-content-between">
                        <div className="d-flex flex-column me-3 col-lg-3 col-6 mb-2">
                            <input type="text" value={initials} className="form-control me-2"
                            onChange={(e) => { setIntials(e.target.value) }} />
                            <div><small className="small textGray fw-roboto">Required. Max 3 letters</small></div>
                        </div>
                        <div className="align-self-baseline">
                            <div className="form-group d-flex align-items-center">
                            <input id="c1" type="checkbox"
                                checked={isChecked}
                                onChange={(e) => setIsChecked(e.target.checked)} />
                            <label htmlFor="c1"></label>
                            <small className="textGray ms-2">Yes, I have reviewed the proofs above and approve them.</small>
                            </div>
                        </div>
                        </div>
                    </>
                    }
                </div> */}

                </div>
                {/* <div className="ms-auto ">
                {!proofStatus &&
                    <>
                    <a button className="btn btn-link text-decoration-none" onClick={handleModalClose}>Cancel</a>
                    <button className={`btn btn-primary ${isDisabled && "disable_Btn"}`} onClick={handleApprove}>Approve</button>
                    </>
                }
                </div> */}

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
