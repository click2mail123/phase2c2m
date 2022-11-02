import { useState, useContext, useEffect } from 'react'
import qs from 'qs';
import { useRouter } from 'next/router';
import Modal from '../../components/Modal/Modal';
import { NavContext } from '../../components/Context/NavContextProvider';
import { convertXmltoJson } from '../../helper/helper';
import APIService from '../../helper/APIService';
import Loader from '../../components/Shared/Loader';
import ErrorMessage from '../../components/Shared/ErrorMessage';
import Image from 'next/image';

const Checkout = () => {
  const router = useRouter();
  const { state, setState } = useContext(NavContext);
  const { jobId, costBreakdown, isMobile } = state;

  const [isModalOpen, setIsModalOpen] = useState(true);
  const [jobDetails, setJobDetails] = useState()
  const [loading, setLoading] = useState(false);
  const [jobSuccess, setJobSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (jobId) {
      fetchJobDetails(jobId);
    }
  }, [])

  const handleModalClose = () => {
    setIsModalOpen(false);
    // if(jobSuccess){
    //   window.location.replace("https://click2mail.com/");
    // }else {
      router.push('/', undefined, {scroll: false});
    // }
  }

  const fetchJobDetails = async (jobId) => {
    setLoading(true);
    const res = await APIService.get(`/jobs/info/${jobId}`);
    if (res.status === 201 || res.status === 200) {
      let { job } = convertXmltoJson(res.data);
      if (job) {
        setJobDetails({ ...job });
      }
    } else {
      setError(true);
      setErrorMessage({ heading: "Unable to fetch job details" });
    }
    setLoading(false);
  }

  // Handle Checkout
  const handleCheckout = async () => {
    const headers = {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
    const payload = {
      billingType: "User Credit"
    }
    const body = qs.stringify(payload)
    setLoading(true);
    const res = await APIService.post(`/jobs/${jobId}/submit`, body, headers);
    if (res.status === 200 || res.status === 201) {
      setJobSuccess(true);
      setState({...state, jobSuccess: true});
    } else {
      let message = "Unable to submit Job"
      message = convertXmltoJson(res?.data?.data)
      message =  message?.job?.description?.text;
      setError(true);
      setErrorMessage({ heading: message })
      setJobSuccess(false);
    }
    setLoading(false);
  }

  const renderCheckoutSuccess = () => {
    return (
      <div className="successToast text-center">
        <figure className="mb-0">
          <img src="/images/check.svg" alt=""/>
          <figcaption className="fw-roboto">
            <h5>Congratulations!</h5>
            <p>Your order #{jobId} has been placed. <br />
              You can see the status inside Order History.</p>
          </figcaption>
        </figure>
      </div>
    );
  }

  const renderMobileCheckout = () => {
    return (
      <div className="table-responsive check_table d-lg-none d-md-none d-block">
        <table className="table">
          <thead className="border-top">
            <tr>
              <th className="text-nowrap">Product Name</th>
              <th className="text-nowrap">Subtotal</th>
            </tr>
          </thead>
          <tbody className="border-bottom">
            <tr>
              <td>
                <ul className="list-unstyled checkout_Item wbr">
                  <li> <p> Job Number</p>:<p> {jobDetails.id.text}</p></li>
                  <li> <p>Document Name</p>:<p> {jobDetails.document.text}</p></li>
                  <li> <p>List Name</p>:<p> {jobDetails.addressList.text}</p></li>
                  <li> <p>Paper Type</p>:<p> {jobDetails.paperType.text}</p></li>
                  <li> <p>Print Color</p>:<p> {jobDetails.color.text}</p></li>
                  <li> <p>Print Options</p>:<p> {jobDetails.printOption.text}</p></li>
                  <li> <p>Production Time</p>:<p> {jobDetails.productionTime.text}</p></li>
                  <li> <p>Date of Mailing</p>:<p> Next Day</p></li>
                  <li> <p>Unit Price</p>:<p> ${costBreakdown.productionCost.productionUnitCost.text}</p></li>
                  <li> <p>Quantity</p>:<p> {costBreakdown.productionCost.quantity.text}</p></li>
                </ul>
              </td>
              <td>${costBreakdown.productionCost.subtotal.text}</td>
            </tr>
            <tr >
              <td><p className="fw-14">{jobDetails.mailClass.text}</p>
                <ul className="list-unstyled checkout_Item">
                  <li> <p>Unit Price</p>:<p> ${costBreakdown.standardCost.postageUnitCost.text}</p></li>
                  <li> <p>Quantity</p>:<p> {costBreakdown.standardCost.quantity.text}</p></li>
                </ul>
              </td>
              <td>${costBreakdown.standardCost.subtotal.text}</td>
            </tr>
          </tbody>
          <tfoot className="text-nowrap">
            <tr>
              <td className="fw-bold fw_blue text-end">Total Price :</td>
              <td className="fw-bold fw_blue">${costBreakdown.totalCost.text}</td>
            </tr>
          </tfoot>
        </table></div>
    )
  }

  return (
    <div>
      {!error ? <Modal isOpen={isModalOpen} closeBtn={handleModalClose}
        sizeClass={!jobSuccess ? "med-modal" : "small-modal"}>
        {!loading && jobDetails && costBreakdown ?
          !jobSuccess ?
            <div className="modal-body px-0">
              <div className="title">
                <h2 className="py-1 text-center my-3">Shopping Cart</h2>
              </div>
              {!isMobile ?
                <div className="table-responsive check_table d-lg-block d-md-block d-none">
                  <table className="table">
                    <thead className="border-top border-0">
                      <tr>
                        <th className="text-nowrap">Product Name</th>
                        <th className="text-nowrap">Date of Mailing</th>
                        <th className="text-nowrap">Unit Price</th>
                        <th className="text-center text-nowrap">Quantity</th>
                        <th className="text-nowrap">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody className="border-0">
                      <tr>
                        <td>
                          <ul className="list-unstyled checkout_Item">
                            <li> <p> Job Number</p>:<p> {jobDetails.id.text}</p></li>
                            <li> <p>Document Name</p>:<p> {jobDetails.document.text}</p></li>
                            <li> <p>List Name</p>:<p> {jobDetails.addressList.text}</p></li>
                            <li> <p>Paper Type</p>:<p> {jobDetails.paperType.text}</p></li>
                            <li> <p>Print Color</p>:<p> {jobDetails.color.text}</p></li>
                            <li> <p>Print Options</p>:<p> {jobDetails.printOption.text}</p></li>
                            <li> <p>Production Time</p>:<p> {jobDetails.productionTime.text}</p></li>
                          </ul>
                        </td>
                        <td>Next Day</td>
                        <td>${costBreakdown.productionCost.productionUnitCost.text}</td>
                        <td className="text-center">{costBreakdown.productionCost.quantity.text}</td>
                        <td>${costBreakdown.productionCost.subtotal.text}</td>
                      </tr>
                      <tr >
                        <td><p className="fw-16">{jobDetails.mailClass.text}</p></td>
                        <td></td>
                        <td>${costBreakdown.standardCost.postageUnitCost.text}</td>
                        <td className="text-center">{costBreakdown.standardCost.quantity.text}</td>
                        <td>${costBreakdown.standardCost.subtotal.text}</td>
                      </tr>
                    </tbody>
                    <tfoot className="text-nowrap border-0">
                      <tr>
                        <td className="border-0"></td>
                        <td className="border-0"></td>
                        <td className="border-0"></td>
                        <td className="fw-bold fw_blue text-center border-0">Total Price :</td>
                        <td className="fw-bold fw_blue border-0">${costBreakdown.totalCost.text}</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
                : renderMobileCheckout()
              }
              <div className="footAction  row px-lg-3 px-2">
                <div className=" col-lg-12 d-flex flex-column flex-lg-row flex-md-row">
                  <button type="submit" className="ms-auto btn btn-primary" onClick={handleCheckout}>Proceed to Checkout</button>
                </div>
              </div>
            </div>
            :
            renderCheckoutSuccess()
          : <Loader />
        }
      </Modal> :
        <ErrorMessage message={errorMessage} handleErrorClose={() => {
          setError(false)
          if (!jobDetails) {
            router.back();
          }
        }} />}
    </div>
  )
}

export default Checkout
