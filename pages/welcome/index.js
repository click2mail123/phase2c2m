import { useState, useEffect, useContext } from 'react'
import axios from 'axios';
import dynamic from 'next/dynamic';
import {useRouter} from 'next/router';


const Welcome = () => {
  return (
    <main class="bannerBg homepage">
    <div class="container-xxl d-flex flex-column h-100 justify-content-between position-relative">
      <div class="row  mb-lg-0 mb-md-0 mb-4">
        <div class="col-lg-12 ">
          <div class="priceTag_box w-230 float-end mt-3 homePriceBox">
            <div class="d-flex align-items-center justify-content-lg-center justify-content-around h-100">
              <a href="" class="dollarCircle"><img src="assets/img/money-sign.svg" alt="" /></a>
              <h4 class="mb-0 d-flex flex-column me-3 fw-16 fw-bold">18,998.34<small class="small textGray fw-normal">Balance</small></h4>
              <a href="#" class="text-decoration-none fw-bold fw-12 cw_blue">Add Funds</a>
            </div>
          </div>
        </div>
      </div>
      
      <div class="row align-items-md-center  mt-100 h-100">
        <div class="col-lg-5 col-md-12 col-12 order-md-1 order-lg-0 order-1 my-4">
          <div class="d-flex flex-column col-lg-8 mx-auto align-items-center">
            <h2 class="fw-bold text-center fw-26 mb-4">Welcome! <br/>
            Ready to start mailing?</h2>
            <a href="#addnewJob" class="btn btn-primary me-2 mb-4 w-220" data-bs-toggle="modal" >
              <img src="assets/img/wadd.svg" alt="" class="me-2" /> Start a New Job </a>
            <a href="#" class="btn btn-outline-primary me-2 mb-4 w-220">Review Previous Jobs </a>
            <div class="d-flex align-items-center me-3">
              <img src="assets/img/ques.png" alt="" class="me-1"/>
              <p class="textGray fw-16 fw-bold mb-0">See Quick Tutorial</p>
            </div>
          </div>
          
        </div>
        <div class="col-lg-7 col-md-12 col-12 order-md-0 order-0  order-lg-1 text-md-center mb-md-4 align-self-md-end align-self-lg-center">
          <img src="assets/img/banner.svg" alt="" class="img-fluid" />
        </div>
      </div>
      <footer class="container-xxl d-flex justify-content-start align-items-center">
        <p class="textGray fw-12">2019 &copy; Click2Mail.</p>
      </footer>
    </div>
  </main>
  )
}


export default Welcome;
