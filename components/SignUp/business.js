import { useState } from 'react';
import qs from 'qs'
import dynamic from 'next/dynamic';
import APIService from '../../helper/APIService';
import axios from 'axios';
import Select from "react-select";
import { Country, State } from "country-state-city";
import { _formatCountryName } from '../../helper/helper';


const BusinessForm = ({ updateStatus }) => {
  const [loading, setLoading] = useState(false);
  const [addStatus, setAddStatus] = useState(null);
  const [message, setMessage] = useState();
  const defaultError = {
    fullnameerror: '', emailerror: '', unameerror: '', pswderror: '', conpswderror: '', orgnameerror: '', countryerror: '', address1error: '', cityerror: '', ziperror: '', stateerror: ''
  }
  let SignInData;
  const [inputData, setInputData] = useState({
    fullname: SignInData?.name?.fullname?.text || '',
    email: SignInData?.name?.email?.text || '',
    uname: SignInData?.name?.uname?.text || '',
    pswd: SignInData?.name?.pswd?.text || '',
    conpswd: SignInData?.name?.conpswd?.text || '',
    country: SignInData?.country ? { ...SignInData.country, name: _formatCountryName(SignInData.country.text) } : '',
    address1: SignInData?.address1?.text || '',
    city: SignInData?.city?.text || '',
    zip: SignInData?.zip?.text || '',
    state: SignInData?.state?.text || '',
    orgname: SignInData?.name?.orgname?.text || '',
  })
  const [error, setError] = useState(defaultError);

  const handleInputChange = (e) => {
    setInputData({ ...inputData, [e.target.name]: e.target.value });
  };


  //handle validation
  const checkValidation = async () => {
    let errorObj = {};
    if (inputData?.fullname === '') {
      errorObj.fullnameerror = 'Please enter fullname!';
    }
    if (inputData?.email === '') {
      errorObj.emailerror = 'Please enter email!';
    }
    if (inputData?.uname === '') {
      errorObj.unameerror = 'Please enter username!';
    }
    if (inputData?.pswd === '') {
      errorObj.pswderror = 'Please enter password!';
    }
    if (inputData?.conpswd === '') {
      errorObj.conpswderror = 'Please enter confirm Password!';
    }
    if (inputData?.pswd !== inputData?.conpswd) {
      errorObj.conpswderror = 'The passwords do not match';
    }
    if (inputData?.country === '') {
      errorObj.countryerror = 'Please select country!';
    }
    if (inputData?.address1 === '') {
      errorObj.address1error = 'Please enter address1!';
    }
    if (inputData?.city === '') {
      errorObj.cityerror = 'Please enter city!';
    }
    if (inputData?.zip === '' || inputData?.zip?.length < 4) {
      errorObj.ziperror = 'Please enter minimum 5 digits zipcode!';
    }
    if (inputData?.state === '') {
      errorObj.stateerror = 'Please select state!';
    }
    if (inputData?.orgname === '') {
      errorObj.orgnameerror = 'Please enter organization name!';
    }
    return errorObj;
  }

  const countries = Country?.getAllCountries();
  const updatedCountries = countries.map((country) => ({
    label: country.name,
    value: country.id,
    ...country
  }));

  const updatedStates = (isoCode) => {
    let country = updatedCountries.filter(ct => ct.name === inputData.country.name)[0];
    const states = State.getStatesOfCountry(country?.isoCode || isoCode)
      .map((state) => ({ label: state.name, value: state.isoCode, ...state }));
    return states;
  }


  const handleSubmit = async () => {
    let errors = await checkValidation()
    setError(errors)
    if (!Object.keys(errors).length) {
      setError(defaultError)
      const payload = {
        accountUsername: inputData?.uname,
        accountName: inputData?.fullname,
        accountEmail: inputData?.email,
        accountPassword: inputData?.pswd,
        accountAddress1: inputData?.address1,
        accountCountry: inputData?.country?.name,
        accountCity: inputData?.city,
        accountState: inputData?.state?.name,
        accountZip: inputData?.zip,
        accountCompany: inputData?.orgname
      }

      let body = {};
      body.payload = qs.stringify(payload);
      body.payloadtype = "signup";
      let response;
      response = await axios.post(`api/login`, body)
      // console.log('response.data', response)
      // console.log("responsedataresponsedataresponsedata0000000000", response);
      if (response.status === 200) {
        if (response?.data?.res2?.status == 0 && response?.data?.res2?.description == "Success") {
          setMessage(response?.data?.res2?.description)
          setAddStatus("success");
          updateStatus({ responseModal: true, status: "success", message: response?.data?.res2?.description })
        }
        else if (response?.data?.res2?.status == 2) {
          setMessage(response?.data?.res2?.description)
          setAddStatus("fail");
          updateStatus({ responseModal: true, status: "fail", message: response?.data?.res2?.description })
        }
      }
    }
  }

  const renderModalBody = () => {
    let bodyHtml;
    switch (addStatus) {
      case 'success':
        bodyHtml = (
          <div className="modal-content border-0">
            <div className="modal-header border-0 pb-0 pt-1">
            </div>
            <div className="modal-body">
              <div className="text-center">
                <a href="#" className="mb-2 successCircle" ><img src="/images/check.svg" alt="" /></a>
                <h4 className="mb-2 successText">{message}</h4>
              </div>
            </div>
          </div>)
        break;
      case 'fail':
        bodyHtml = (
          <div className="modal-content border-0">
            <div className="modal-header border-0 pb-0 pt-1">
            </div>
            <div className="modal-body">
              <div className="text-center">
                <a href="#" className="mb-2"><img src="/images/info.svg" alt="" /></a>
                <h4 className="mb-2 errorText">{message}</h4>
                <p className="mb-2">Try again</p>
              </div>
            </div>
          </div>
        )
        break;
      default:
        break;
    }
    return bodyHtml;
  }


  return (
    <>
      <div>
        <div className="tab-content p-0">
          <div className=" tab-pane  active mt-3" id="business">
            <div className="mb-3">
              <input type="text" placeholder="Fullname*" className="form-control" name="fullname" required onChange={(e) => handleInputChange(e)} />
              {error?.fullnameerror ? <p className="text-danger">{error?.fullnameerror}</p> : null}
            </div>
            <div className="mb-3">
              <input type="email" placeholder="Email*" className="form-control" name="email" required onChange={(e) => handleInputChange(e)} />
              {error?.emailerror ? <p className="text-danger">{error?.emailerror}</p> : null}
            </div>
            <div className="mb-3">
              <input type="text" placeholder="Username*" className="form-control" name="uname" required onChange={(e) => handleInputChange(e)} />
              {error?.unameerror ? <p className="text-danger">{error?.unameerror}</p> : null}
            </div>
            <div className="mb-3">
              <input type="Password" placeholder="Password*" name="pswd" className="form-control" required onChange={(e) => handleInputChange(e)} />
              {error?.pswderror ? <p className="text-danger">{error?.pswderror}</p> : null}
            </div>
            <div className="mb-3">
              <input type="Password" placeholder="Confirm Password*" name="conpswd" className="form-control" required onChange={(e) => handleInputChange(e)} />
              {error?.conpswderror ? <p className="text-danger">{error?.conpswderror}</p> : null}
            </div>
            <div className="mb-3">
              <input type="text" placeholder="Address 1" className="form-control" name="address1" value={inputData.address1} onChange={handleInputChange} />
              {error?.address1error ? <p className="text-danger">{error?.address1error}</p> : null}
            </div>
            <div className="mb-3 selectBx">
              <Select
                id="country"
                name="country"
                label="country"
                options={updatedCountries}
                value={updatedCountries.find(op => {
                  return op.name == inputData.country.name
                })}
                defaultValue={inputData.country}
                placeholder="Select country"
                // className="select-return"
                onChange={(value) => {
                  setInputData({ ...inputData, country: value });
                }}
              />
              {error?.countryerror ? <p className="text-danger">{error?.countryerror}</p> : null}
            </div>
            <div className="mb-3">
              <input type="text" placeholder="City" className="form-control" name="city" value={inputData.city} onChange={handleInputChange} />
              {error?.cityerror ? <p className="text-danger">{error?.cityerror}</p> : null}
            </div>
            <div className="mb-3 selectBx">
              <Select
                id="state"
                name="state"
                // className="select-return"
                options={updatedStates()}
                value={updatedStates().find(op => op.isoCode === inputData.state)}
                placeholder="Select state"
                onChange={(value) => {
                  setInputData({ ...inputData, state: value });
                }}
              />{error?.stateerror ? <p className="text-danger">{error?.stateerror}</p> : null}
            </div>
            <div className="mb-3">
              <input type="text" placeholder="ZIP Code" className="form-control" name="zip" value={inputData.zip} onChange={handleInputChange} />
              {error?.ziperror ? <p className="text-danger">{error?.ziperror}</p> : null}
            </div>
            <div className="mb-3">
              <input type="text" placeholder="Company/Organizitation*" name="orgname" className="form-control" required onChange={(e) => handleInputChange(e)} />
              {error?.orgnameerror ? <p className="text-danger">{error?.orgnameerror}</p> : null}
            </div>
            <button className="btn btnTheme mb-3 w-100 justify-content-center" onClick={handleSubmit}>Sign Up</button>
          </div>
        </div>
      </div>
    </>
  )
}
export default BusinessForm;