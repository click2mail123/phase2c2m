import { useState, useEffect, useContext } from 'react'
import qs from 'qs';
import { useRouter } from 'next/router';
import APIService from '../../helper/APIService'
import { NavContext } from '../../components/Context/NavContextProvider'
import Modal from '../../components/Modal/Modal';
import { convertXmltoJson } from '../../helper/helper';
import Loader from '../../components/Shared/Loader';
import ErrorMessage from '../../components/Shared/ErrorMessage';

const ChangeSize = () => {
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
  const [size, setSize] = useState()
  // const { state, setState } = useContext(NavContext);
  // const { documentSize } = state;
 
  const handleSelect = (e) => {
    setSize(e.target.value)  
    setState({...state,  documentSize:e.target.value})
  }
 
  console.log('sizeeeeeeee', size)

  const handleModalClose = () => {
    setIsModalOpen(false);
    router.push('/', undefined, {scroll: false});
  }


  // const saveDocumentSize = () => {
  //   setIsModalOpen(false);
  //   router.push('/', undefined, {scroll: false});
  // }
 
 
  return (
    // <div class="modal c2m_modal" id="changeSizeModal">
    <Modal isOpen={isModalOpen} closeBtn={handleModalClose} sizeClass="small-modal">
      <div class="modal-dialog modal-dialog-centered ">
        <div class="modal-content">
          <div class="modal-header border-0 pb-0 pt-3">
          </div>
          <form action="#">
            <div class="modal-body  ">
              <div class="container p-0">
                <div class="align-items-end d-flex justify-content-between mb-lg-4 mb-2 row">
                  <div class="title mx-auto">
                    <h2 class=" text-center p-0 ">Which size is your document?</h2>
                  </div>
                </div>
                <div class="layoutSection fixedHeight">
                  <input type="radio" name="changeSize" id="small" class="d-none" value="Letter 8.5 x 11" onChange={handleSelect}/>
                  <label for="small" class="small fw-16 fw-bold themeBlack text-center">US Letter<br/>
                  8.5x11</label>
                  <div class="px-3 fw-16 fw-bold themeBlack">OR</div>
                  <input type="radio" name="changeSize" id="large" class="d-none" value="Letter 8.5 x 14" onChange={handleSelect}/>
                  <label for="large" class="large fw-16 fw-bold themeBlack text-center">US Legal<br/>
                  8.5x14</label>
                </div>
              </div>
            </div>
            <div class="modal-footer  footAction border-top-0">
              <div class=" d-flex flex-column flex-lg-row justify-content-end ms-auto p-0 pe-0 text-end ">
                {/* <a href="#" class="btn  btn-primary w-150" onClick={saveDocumentSize}>Continue</a> */}
                <button className={`btn btn-primary w-150 `} onClick={handleModalClose}>Continue</button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </Modal>
  )
}

export default ChangeSize
