import { useContext } from 'react'
import { NavContext } from '../Context/NavContextProvider';
import { useRouter } from 'next/router';
import Link from 'next/link';

const HomepageApproval = () => {
  const router = useRouter();
  const { state } = useContext(NavContext);
  const { proofStatus } = state;

  const handleApproval = () => {
    router.push('/approve')
  }
  return (
    <div className="d-flex flex-column">

      {proofStatus ?
        (<>
          {/* PDF Approved Section-*/}
          <div className="d-flex align-items-center mb-2"><img src="/images/gChek.svg" alt="" className="me-2" />
            <span className="themeGreen fw-12 fw-roboto">PDF Approved</span>
          </div>
          <div className="d-flex">
            <h4 className="fw-16 fw-bold themeBlack me-3 mb-0">MyDocument.pdf</h4>
            <Link href="/approvedpdf"><a><img src="/images/view.svg" alt="" /></a></Link>
          </div>
        </>)
        :
        (<div className="d-flex flex-column">
          <h4 className="fw-16 fw-bold themeRed me-3 mb-2"><img src="/images/infoRed.svg" alt="" /> You need to approve the PDF</h4>
          <button className="btn btn-outline-primary col-12 col-md-6" onClick={handleApproval}> Review Document for Approval</button>
        </div>)
      }
    </div>
  )
}

export default HomepageApproval