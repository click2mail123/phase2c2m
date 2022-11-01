import { useState, useContext, useEffect } from 'react'
import qs from 'qs';
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router';
import APIService from '../../helper/APIService';
import { NavContext } from '../../components/Context/NavContextProvider';
import { validateCreditCardNumber, convertXmltoJson } from '../../helper/helper';
import Image from 'next/image';
const CurrentFund = dynamic(() => import('../../components/Fund/CurrentFund'))
const Modal = dynamic(() => import('../../components/Modal/Modal'))
const Loader = dynamic(() => import('../../components/Shared/Loader'))
const ErrorMessage = dynamic(() => import('../../components/Shared/ErrorMessage'))


const AddFund = () => {
  const router = useRouter();
  const { state, setState } = useContext(NavContext);
  const { sessionId } = state;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [inputData, setInputData] = useState({
    amount: "",
    creditCard: undefined,
    cardName: "",
    cardNum: "",
    address: "",
    expMonth: undefined,
    expYear: undefined,
    cvv: ""
  })
  const [addStatus, setAddStatus] = useState(null);
  const [isValidCard, setIsVaildCard] = useState(true);
  const [billingAdd, setBillingAdd] = useState();
  const [formErrors, setFormErrors] = useState([]);


  const fetchBillingAddress = async () => {
    setLoading(true);
    const res = await APIService.get(`/account/addresses?addressType=Billing address`);
    if (res.status === 201 || res.status === 200) {
      let xmlRes = convertXmltoJson(res.data);
      let { account: { addresses: { address } } } = xmlRes;
      if(address && address.length > 0){
        let defaultAdd;
        address && address.map(add => {
          if(add.default.text == 'true') {
            defaultAdd = add
            console.log('defaultAdddess inside the condition ', defaultAdd)
            address = defaultAdd;
          }
        })
      } 
      setBillingAdd(address);
    } else {
      setError(true);
      setErrorMessage({ heading: "Billing Address not found", body: "Please add billing address in your click2mail account" })
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchBillingAddress();
  }, [sessionId])


  //populate address input feild with billing address
  useEffect(() => {
    if (billingAdd) {
      let inputAdd = billingAdd.address1.text + " , " + billingAdd.city.text + " , " + billingAdd.state.text;

      setInputData({ ...inputData, address: inputAdd });
    }
  }, [billingAdd])

  const handleModalClose = () => {
    setIsModalOpen(false);
    router.push('/', undefined, {scroll: false});
  }

  //Handle Input change
  const handleInputChange = (e) => {
    let key = e.target.name;
    let value = e.target.value;
    if (key === 'cardNum' && value.length > 3) {
      const isValid = validateCreditCardNumber(value);
      setIsVaildCard(isValid);
    }

    let newInputData = { ...inputData };
    newInputData[key] = value;
    setInputData(newInputData);
  }


  //Validate all fields
  const validateInputFields = () => {
    let errors = [];
    for (let key of Object.keys(inputData)) {
      let value = inputData[key];
      if (!value || (value && value.trim() === "")) {
        errors.push(key);
      }
    }
    return errors;
  }


  //Buy Credit
  const handleBuyCredit = async () => {
    //Check for errors
    const inputErrors = validateInputFields();
    if (inputErrors && inputErrors.length > 0) {
      setFormErrors([...inputErrors]);
      return;
    }

    //Else continue with API call
    const url = '/credit/purchase';
    const headers = {
      'Content-Type': 'application/x-www-form-urlencoded'
    }

    const payload = {
      billingName: inputData.cardName,
      billingAddress1: billingAdd.address1.text,
      billingCity: billingAdd.city.text,
      billingState: billingAdd.state.text,
      billingZip: billingAdd.zip.text,
      billingAmount: inputData.amount,
      billingNumber: inputData.cardNum,
      billingMonth: inputData.expMonth,
      billingYear: inputData.expYear,
      billingCvv: inputData.cvv,
      billingCcType: inputData.creditCard
    }

    const body = qs.stringify(payload)

    setLoading(true);
    const res = await APIService.post(url, body, headers);
    let data = convertXmltoJson(res.data)
    let success = data?.credit?.description?.text
    if (res.status === 200 && success == "Success") {
       setAddStatus("success");
       setState({...state, fundAddSuccess: "success"});
    } else {
      setAddStatus("fail");
    }
    setLoading(false);
  }

  //Render Select range options
  //This function accepts a start and end integer and return <option>s within that range
  const renderOptions = (start, end) => {
    let options = Array.from({ length: end - start + 1 }, (x, i) => {
      let val = start + i;
      if (val < 10) {
        val = '0' + String(val);
      }
      val = String(val);
      return <option value={val} key={val}>{val}</option>;
    })
    return options;
  }


  // * Render Add Fund form
  const renderAddFundForm = () => {
    return (
      <div>
        <div className="row mb-4">
          <div className="col-lg-6">
            <input type="text" name="amount" placeholder="Amount" className="form-control" value={inputData.amount} onChange={handleInputChange} />
            <div className={formErrors.includes("amount") ? "d-block" : "d-none"}><small className="text-danger">Please enter valid amount</small> </div>
          </div>
          <div className="col-lg-6">
            <select name="creditCard" className="form-control" value={inputData.creditCard} onChange={handleInputChange}>
              <option value="null">Credit Card Type</option>
              <option value="VI">Visa</option>
              <option value="MC">Mastercard</option>
              <option value="DI">Discover</option>
              <option value="AE">American Express</option>
            </select>
            <div className={formErrors.includes("creditCard") ? "d-block" : "d-none"}><small className="text-danger">Please select credit card type</small> </div>
          </div>
        </div>
        <div className="row mb-4">
          <div className="col-lg-6">
            <input type="text" placeholder="Name on Card" className="form-control" name="cardName" value={inputData.cardName} onChange={handleInputChange} />
            <div className={formErrors.includes("cardName") ? "d-block" : "d-none"}><small className="text-danger">Please enter name on the card</small> </div>
          </div>
          <div className="col-lg-6">
            <input type="text" placeholder="Card Number" className="form-control" name="cardNum" value={inputData.cardNum} onChange={handleInputChange} />
            <div className={!isValidCard || formErrors.includes("cardNum") ? "d-block" : "d-none"}><small className="text-danger">Enter a valid card number</small> </div>
          </div>
        </div>
        <div className="row mb-4">
          <div className="col-lg-6">
            <input type="text" placeholder="Address" className="form-control" name="address" value={inputData.address} onChange={handleInputChange} disabled={true} />
            <div className={formErrors.includes("address") ? "d-block" : "d-none"}><small className="text-danger">Enter a valid address</small> </div>
          </div>
          <div className="col-lg-6">
            <div className="d-flex">
              <select name="expMonth" className="form-control me-2" value={inputData.expMonth} onChange={handleInputChange}>
                <option value="null">MM</option>
                {renderOptions(1, 12)}
              </select>
              <select name="expYear" className="form-control me-2" value={inputData.expYear} onChange={handleInputChange}>
                <option value="null">YYYY</option>
                {renderOptions((new Date()).getFullYear(), (new Date()).getFullYear() + 20)}
              </select>
              <input name="cvv" type="password" placeholder="CVV" className="form-control" value={inputData.cvv} onChange={handleInputChange} />
            </div>
            <div className="row">
              <div className={formErrors.includes("expMonth") ? "d-block col-4" : "d-none col-4"}><small className="text-danger">Required</small> </div>
              <div className={formErrors.includes("expYear") ? "d-block col-4" : "d-none col-4"}><small className="text-danger">Required</small> </div>
              <div className={formErrors.includes("cvv") ? "d-block col-4" : "d-none col-4"}><small className="text-danger">Required</small> </div>
            </div>
          </div>
        </div>
      </div>
    )
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
                <a href="#" className="mb-2 successCircle" >
                  <img src="/images/check.svg" alt=""/>
                </a>
                <h4 className="mb-2 successText">Funds added</h4>
                <p className="mb-2">You will see this funds in your balance</p>
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
                <a href="#" className="mb-2"><Image src="/images/info.svg" alt="" width={30} height={30} /></a>
                <h4 className="mb-2 errorText">Error in adding funds</h4>
                <p className="mb-2">We are sorry, we cannot verify your card</p>
                <div className="footAction">
                  <button className="btn btn-primary px-4" onClick={() => setAddStatus(null)}>Try with other card</button>
                </div>
              </div>
            </div>
          </div>
        )
        break;
      default:
        bodyHtml = (
          <div className="container">
            <div className="align-items-end d-flex justify-content-between mb-4">
              <div className="title ">
                <h2 className="text-start p-0 fw-28">Add Funds</h2>
              </div>
              {!loading &&
                <div className="me-4">
                  <CurrentFund />
                </div>
              }
            </div>
            {renderAddFundForm()}
            <div className="footAction d-flex">
              <div className="ms-auto">
                <div className="btn btn-link text-decoration-none" onClick={handleModalClose}>Cancel</div>
                <button type="submit" className="btn btn-primary w-150" onClick={handleBuyCredit}>Buy Credit</button>
              </div>
            </div>
          </div>
        );
        break;
    }
    return bodyHtml;
  }

  return (
    <div>
      <Modal isOpen={isModalOpen} closeBtn={handleModalClose}>
      {error ?
       <ErrorMessage message={errorMessage} handleErrorClose={() => setError(false)}/>  
       :
        loading ? <Loader /> :
          renderModalBody() 
      }
      </Modal>
    </div>
  )
}

export default AddFund
