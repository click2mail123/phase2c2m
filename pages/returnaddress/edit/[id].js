import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic'
import qs from 'qs';
import Select from "react-select";
import Modal from '../../../components/Modal/Modal';
// import { Country, State } from "country-state-city";
import APIService from '../../../helper/APIService';
import Loader from '../../../components/Shared/Loader';
import { _formatCountryName, generateTimeStamp } from '../../../helper/helper';
const SuccessMessage = dynamic(() => import('../../../components/Shared/SuccessMessage'))
// const Country = dynamic(() => import('country-state-city'))
// const State = dynamic(() => import('country-state-city'))

const EditReturnAddress = () => {
  const router = useRouter();
  const { state } = router.query;
  const addressData = state;
  const defaultError = {
    fnameerror: '', lnameerror: '', countryerror: '', address1error: '', cityerror: '', ziperror: '', stateerror: ''
  }
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [inputData, setInputData] = useState({
    fname: addressData?.name?.firstName?.text || '',
    lname: addressData?.name?.lastName?.text || '',
    organization: addressData?.organization?.text || '',
    country: addressData?.country ? { ...addressData.country, name: _formatCountryName(addressData.country.text) } : '',
    address1: addressData?.address1?.text || '',
    address2: addressData?.address2?.text || '',
    address3: addressData?.address3?.text || '',
    city: addressData?.city?.text || '',
    zip: addressData?.zip?.text || '',
    state: addressData?.state?.text || '',
    addId: addressData?.addressId?.text || '',
  })
  const [addStatus, setAddStatus] = useState(null);
  const [error, setError] = useState(defaultError);
  const [success, setSuccess] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")


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
  //handle validation
  const checkValidation = async () => {
    let errorObj = {};
    if (inputData?.fname === '') {
      errorObj.fnameerror = 'Please enter firstname!';
    }
    if (inputData?.lname === '') {
      errorObj.lnameerror = 'Please enter lastname!';
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
    return errorObj;
  }

  //handle update address
  const  handleUpdateAddress = async () => {
    let errors = await checkValidation()
    setError(errors)
    if (!Object.keys(errors).length) {
      setError(defaultError)
      const url = `/account/addresses/${inputData.addId}`;
      const headers = {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
      const payload = {
        firstName: inputData?.fname,
        lastName: inputData?.lname,
        organization: inputData?.organization,
        country: (inputData?.country['name'] === undefined ? inputData?.country : inputData?.country['name']),
        address1: inputData?.address1,
        city: inputData?.city,
        zip: inputData?.zip,
        state: (inputData?.state['isoCode'] === undefined ? inputData?.state : inputData?.state['isoCode']),
        type: 'Return address',
        description: addressData?.description?.text
      }
      const body = qs.stringify(payload)
      setLoading(true);
      const res = await APIService.post(url, body, headers);
      if (res.status === 200) {
        setAddStatus("success");
        setSuccess(true)
        setSuccessMessage({ heading: "Return Address Updated", body: "" })
      } else {
        setAddStatus("fail");
      }
      setLoading(false);
    }
  }

  //handle add address
  const handleAddAddress = async () => {
    let errors = await checkValidation()
    setError(errors)
    if (!Object.keys(errors).length) {
      setError(defaultError)
      const url = '/account/addresses';
      const headers = {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
      const payload = {
        firstName: inputData?.fname,
        lastName: inputData?.lname,
        organization: inputData?.organization,
        country: inputData?.country['name'],
        address1: inputData?.address1,
        city: inputData?.city,
        zip: inputData?.zip,
        state: inputData?.state['isoCode'],
        type: 'Return address',
        description: generateTimeStamp(),
      }

      const body = qs.stringify(payload)
      setLoading(true);
      const res = await APIService.post(url, body, headers);
      if (res.status === 200) {
        setAddStatus("success");
        setSuccess(true)
        setSuccessMessage({ heading: "Return Address Added Successfully", body: "" })
      } else {
        setAddStatus("fail");
      }
      setLoading(false);
    }
  }

  const handleModalClose = () => {
    setIsModalOpen(false);
    router.push('/', undefined, { scroll: false });
  }

  const handleInputChange = (e) => {
    let key = e.target.name;
    let value = e.target.value;
    let newInputData = { ...inputData };
    newInputData[key] = value;
    setInputData(newInputData);
  }

  const renderAddressForm = () => {
    return (
      <div className="container">
        <div className="align-items-end d-flex justify-content-between mb-4">
          <div className="title">
            <h2 className="text-center p-0 fw-28">Return Address</h2>
          </div>
        </div>
        <div className="row mb-lg-3 mb-md-3 mb-0">
          <div className="col-lg-6 mb-lg-0 mb-md-0 mb-3">
            <input type="text" placeholder="First Name" className="form-control" name="fname" value={inputData.fname} onChange={handleInputChange} />
            {error?.fnameerror ? <p className="text-danger">{error?.fnameerror}</p> : null}
          </div>
          <div className="col-lg-6 mb-lg-0 mb-md-0 mb-3">
            <input type="text" placeholder="Last Name" className="form-control" name="lname" value={inputData.lname} onChange={handleInputChange} />{error?.lnameerror ? <p className="text-danger">{error?.lnameerror}</p> : null}
          </div>
        </div>
        <div className="row mb-lg-3 mb-md-3 mb-0">
          <div className="col-lg-6 mb-lg-0 mb-md-0 mb-3">
            <input type="text" placeholder="Organization" className="form-control" name="organization" value={inputData.organization} onChange={handleInputChange} />
          </div>
          <div className="col-lg-6 mb-lg-0 mb-md-0 mb-3 selectBx">
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
        </div>
        <div className="row mb-lg-3 mb-md-3 mb-0">
          <div className="col-lg-6 mb-lg-0 mb-md-0 mb-3">
            <input type="text" placeholder="Address 1" className="form-control" name="address1" value={inputData.address1} onChange={handleInputChange} />
            {error?.address1error ? <p className="text-danger">{error?.address1error}</p> : null}
          </div>
          <div className="col-lg-6 mb-lg-0 mb-md-0 mb-3">
            <input type="text" placeholder="Address 2" className="form-control" name="address2" value={inputData.address2} onChange={handleInputChange} />
          </div>
        </div>
        <div className="row mb-lg-3 mb-md-3 mb-0">
          <div className="col-lg-6 mb-lg-0 mb-md-0 mb-3">
            <input type="text" placeholder="Address 3" className="form-control" name="address3" value={inputData.address3} onChange={handleInputChange} />
          </div>
          <div className="col-lg-6 mb-lg-0 mb-md-0 mb-3">
            <input type="text" placeholder="City" className="form-control" name="city" value={inputData.city} onChange={handleInputChange} />
            {error?.cityerror ? <p className="text-danger">{error?.cityerror}</p> : null}
          </div>
        </div>
        <div className="row mb-lg-3 mb-md-3 mb-0">
          <div className="col-lg-6 mb-lg-0 mb-md-0 mb-3">
            <input type="text" placeholder="ZIP Code" className="form-control" name="zip" value={inputData.zip} onChange={handleInputChange} />
            {error?.ziperror ? <p className="text-danger">{error?.ziperror}</p> : null}
          </div>
          <div className="col-lg-6 mb-lg-0 mb-md-0 mb-3 selectBx">
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
        </div>

        <div className="footAction d-flex">
          <div className="ms-auto flex-lg-row flex-md-row flex-column-reverse d-flex response_btn">
            <div className="btn btn-link text-decoration-none" onClick={handleModalClose}>Cancel</div>
            <button type="submit" className="btn btn-primary" onClick={addressData && addressData.name ? handleUpdateAddress : handleAddAddress}>{addressData && addressData.name ? 'Update' : 'Save'}</button>
          </div>
        </div>
      </div>
    )
  }


  return (
    <div>
      <Modal isOpen={isModalOpen} closeBtn={handleModalClose}>
        {success ?
          <SuccessMessage message={successMessage} handleSuccessClose={() =>{ 
            setSuccess(false);
            handleModalClose();
          } 
          } />
          :
          loading ? <Loader /> :
            renderAddressForm()
        }
      </Modal>
    </div>
  )
}

export default EditReturnAddress