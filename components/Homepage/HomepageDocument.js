import { useState, useEffect, useContext } from 'react'
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { NavContext } from '../Context/NavContextProvider';
import Image from 'next/image';
const ReturnAddress = dynamic(() => import('../Homepage/ReturnAddress'))
const AddressCarousel = dynamic(() => import('../Homepage/AddressCarousel'))
const HomepageApproval = dynamic(() => import('../Homepage/HomepageApproval'))


const HomepageDocument = (props) => {
  const router = useRouter();
  const { fileName } = props;
  const { state } = useContext(NavContext);
  const { selectedMailingList, costBreakdown, proofStatus, jobId, jobSuccess } = state;

  const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);
  const [currentCost, setCurrentCost] = useState(costBreakdown?.totalCost?.text);

  //Toggle Submit button whenever there is change in mailinglist or proof status
  useEffect(() => {
    if (selectedMailingList && selectedMailingList.length > 0 && proofStatus) {
      setIsSubmitDisabled(false);
    } else {
      setIsSubmitDisabled(true);
    }
  }, [proofStatus, selectedMailingList])

  //Show total cost when cost breakdown is fetched
  useEffect(() => {
    if (costBreakdown && costBreakdown.totalCost) {
      setCurrentCost(costBreakdown.totalCost.text);
    }
  }, [costBreakdown])

  //if the orderstatus is done then disable submit button
  useEffect(() => {
    if (jobSuccess) {
      setIsSubmitDisabled(true);
    }
  }, [jobSuccess])  

  // Handle Job Submit
  const handleJobSubmit = () => {
    router.push('/checkout', undefined, {scroll: false})
  }

  //Fetch Cost breakdown when job is created
  const handleCostBreakdown = () => {
    if (selectedMailingList && selectedMailingList.length > 0) {
      if (router.pathname === "/") {
        router.push('/costbreakdown', undefined, {scroll: false})
      } else {
        router.push('/', undefined, {scroll: false})
      }
    }
  }

  return (
    <div className="d-flex justify-content-between flex-grow-1 flex-column  align-self-baseline w-tbl-100 postRelative col-md-8">
      <div className="card bg-transparent border-0 mb-3">
        <div className="card-header bg-transparent d-flex justify-content-between arrowryt collapsed border-0 p-1" data-bs-toggle="collapse" data-bs-target="#collapseOne">
          <h4 className="fw-bold themeBlack fw-20 ">{fileName}</h4>

        </div>
        <div id="collapseOne" className="collapse show" data-bs-parent="#accordion">
          <div className="card-body docDetail">
            <div className="d-flex justify-content-between row " >

              <div className="col-lg-3 col-6 col-md-4">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <h4 className="mb-0 fw-16 fw-bold ">Return Address</h4>
                </div>
                <ReturnAddress />
              </div>
              <div className="col-lg-9 col-6 col-md-6">
                <div className="float-end position-relative point_cursor" onClick={handleCostBreakdown}>
                  <Image src="/images/Stamp.png" alt="stamp" width={104} height={144} />
                  <h4 className="fw-16 fw-bold mb-0 price_pos">
                    {selectedMailingList && selectedMailingList.length > 0 && currentCost > 0 && `$${currentCost}`}
                  </h4>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="align-self-lg-center align-self-md-center col-md-6 col-lg-4 offset-lg-4 col-8 mx-auto">
                {/* <!-- Carousel --> */}
                <AddressCarousel />
              </div>
            </div>
            <div className="row">
            {jobSuccess ?  
              <div className="align-self-lg-center align-self-md-center col-md-6 col-lg-4 offset-lg-4 col-8 mx-auto d-flex justify-content-center">
                {/* <!-- Carousel --> */}
                {/* <AddressCarousel /> */}
                <Image src="/images/done.png" alt="Done" width={100} height={100} />
              </div>
              :
              ''
              }
            </div>
            <div className="row align-items-end">
              <div className="col-lg-8 col-md-6">
                {jobId &&
                  <HomepageApproval />
                }
              </div>
              <div className="col-lg-4 col-md-6">
                <div className="d-flex justify-content-between flex-column">

                  <div className="d-flex justify-content-end align-items-center">
                    <button
                      className=
                      {`btn w-150 float-end cursor-pointer ${isSubmitDisabled ? 'disable_Btn' : 'btnTheme'}`}
                      onClick={handleJobSubmit}>
                      <img src="/images/send.svg " alt="send" className="me-1" />
                       Submit Job</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HomepageDocument
