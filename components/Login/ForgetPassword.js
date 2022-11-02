import { useState } from 'react';
import qs from 'qs';
import APIService from '../../helper/APIService';

const ForgetPassword = () => {
  const defaultError = {
    unameerror: ''
  }
  let loginData;
  const [inputData, setInputData] = useState({
    uname: loginData?.name?.uname?.text || '',
  })
  const [error, setError] = useState(defaultError);

  //handle validation
  const checkValidation = async () => {
    let errorObj = {};
    if (inputData?.uname === '') {
      errorObj.unameerror = 'Please enter username!';
    }
    return errorObj;
  }

  const handleInputChange = (e) => {
    setInputData({ ...inputData, [e.target.name]: e.target.value });
  };

  const handleForgetPassword = async () => {
    console.log("LoginCall---")
    let errors = await checkValidation()
    console.log("errors---", errors)
    setError(errors)
    if (!Object.keys(errors).length) {
      setError(defaultError)
      const url = '';
      const headers = {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
      const payload = {
        userName: inputData?.uname,
      }
      console.log("payload---", payload)
      const body = qs.stringify(payload)
      console.log("body---", body)
      const res = await APIService.post(url, body, headers);
      console.log("res---", res)
    }
  }

  return (
    <>
      <div className="container p-0">
        <div className="align-items-end d-flex justify-content-between flex-column mb-lg-4 mb-2">
          <div className="title mx-auto">
            <h2 className=" text-center py-2 fw-28">Forgot Password</h2>
          </div>
          <div className="title mx-auto">
            <h2 className=" text-center py-2 fw-16">Enter your username</h2>
          </div>
        </div>
        <div className="mb-3">
          <input type="email" placeholder="Username" className="form-control" name="uname" value={inputData.uname} onChange={(e) => handleInputChange(e)} required />
          {error?.unameerror ? <p className="text-danger">{error?.unameerror}</p> : null}
        </div>
        <button type="submit" onClick={handleForgetPassword} className="btn btnTheme mb-3 w-100 justify-content-center">Continue</button>
        <div className="text-center mb-3">
          <a href="/login" className="text-decoration-none">Back to sign in</a>
        </div>
      </div>
    </>
  );

}
export default ForgetPassword;