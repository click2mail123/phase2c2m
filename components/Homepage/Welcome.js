import { useState, useEffect, useContext } from 'react'
import axios from 'axios';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
const CurrentFund = dynamic(() => import('../Fund/CurrentFund'))


const Welcome = () => {
  const router = useRouter();

  const handleJobClick = () => {
    router.push('/addnewdoc', undefined, { scroll: false });
  }


  return (
    <>
      <main className="bannerBg homepage " >
        <div className="container-xxl d-flex flex-column h-100 justify-content-between position-relative backgroundColor">
          <div className="row  mb-lg-0 mb-md-0 mb-4">
            <div className="col-lg-12 ">
              <CurrentFund showAddFund />
            </div>
          </div>

          <div className="row align-items-md-center  mt-100 h-100">
            <div className="col-lg-5 col-md-12 col-12 order-md-1 order-lg-0 order-1 my-4">
              <div className="d-flex flex-column col-lg-8 mx-auto align-items-center">
                <h2 className="fw-bold text-center fw-26 mb-4">Welcome! <br />
                  Ready to start mailing?</h2>
                <button className="btn btn-primary me-2 mb-4 w-220" onClick={handleJobClick} ><img src="/images/wadd.svg" alt="" className="me-2" /> Start a New Job </button>
                <Link href="/orderhistory"><a className="btn btn-outline-primary me-2 mb-4 w-220">Review Previous Jobs </a></Link>
                <div className="d-flex align-items-center me-3">
                  <img src="./images/ques.png" alt="" className="me-1" />
                  <p className="textGray fw-16 fw-bold mb-0">See Quick Tutorial</p>
                </div>
              </div>

            </div>
            <div className="col-lg-7 col-md-12 col-12 order-md-0 order-0  order-lg-1 text-md-center mb-md-4 align-self-md-end align-self-lg-center">
              <img src="./images/banner.svg" alt="" className="img-fluid" />
            </div>
          </div>
          <footer className="container-xxl d-flex justify-content-start align-items-center">
            <p className="textGray fw-12">2019 &copy; Click2Mail.</p>
          </footer>
        </div>
      </main>
    </>
  )
}


export default Welcome;
