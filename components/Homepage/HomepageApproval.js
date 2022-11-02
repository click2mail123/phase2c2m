import { useContext } from 'react'
import { NavContext } from '../Context/NavContextProvider';
import { useRouter } from 'next/router';
const HomepageApproval = () => {
  const router = useRouter();
  const { state } = useContext(NavContext);
  const { proofStatus, documentName } = state;

  const handleApproval = () => {
    router.push('/approve', undefined, {scroll: false})
  }
  return (
    <div className="d-flex flex-column">

      {proofStatus ?
        (<>
          {/* PDF Approved Section-*/}
          <div className="d-flex align-items-center mb-2">
            <img src="/images/gChek.svg" alt="check" className="me-2"/>
            <span className="themeGreen fw-12 fw-roboto">PDF Approved</span>
          </div>
          <div className="d-flex">
            <h4 className="fw-16 fw-bold themeBlack me-3 mb-0">{documentName}</h4>
            {/* <Image src="/images/view.svg" alt="check" className="me-2" width={15} height={15}/> */}
            {/* <Link to="/approve"><a><img src="/images/view.svg" alt="" /></a></Link> */}
          </div>
        </>)
        :
        (<div className="d-flex flex-column">
          <h4 className="fw-16 fw-bold themeRed me-3 mb-2">
            <img src="/images/infoRed.svg" alt="check" className="me-2" /> You need to approve the Proof</h4>
          <button className="btn btn-outline-primary col-12 col-md-6" onClick={handleApproval}> Review Proof for Approval</button>
        </div>)
      }
    </div>
  )
}

export default HomepageApproval
