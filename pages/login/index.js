import { useState, useEffect, useContext } from 'react';
import qs from 'qs'
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import APIService from '../../helper/APIService';
import { NavContext } from '../../components/Context/NavContextProvider';
import Loader from '../../components/Shared/Loader';
import { RouteRounded } from '@mui/icons-material';
import axios from 'axios';
import { setCookies } from '../../helper/helper';
// import Homepage from '../../components/Homepage/Homepage';
import { getDomainLocale } from 'next/dist/shared/lib/router/router';

const Modal = dynamic(() => import('../../components/Modal/Modal'))
const ErrorMessage = dynamic(() => import('../../components/Shared/ErrorMessage'));
const Google = dynamic(() => import('../../components/Login/GoogleLogin'))
const ForgetUsername = dynamic(() => import('../../components/Login/ForgetUsername'))
const ForgetPassword = dynamic(() => import('../../components/Login/ForgetPassword'))
const PersonalForm = dynamic(() => import('../../components/SignUp/personal'))
const BusinessForm = dynamic(() => import('../../components/SignUp/business'))



const Login = () => {
  const router = useRouter();
  const { state, setState } = useContext(NavContext);
  const { sessionId } = state;
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [loading, setLoading] = useState(false);
  const [login, setLogin] = useState(true);
  const [googlelogin, setGogoleLogin] = useState(false);
  const [forgotusername, setForgotUsername] = useState(false);
  const [forgotpassword, setForgotPassword] = useState(false);
  const [showResponse, setShowResponse] = useState({ responseModal: false, status: "", message: "" });
  const defaultError = {
    unameerror: '', pwderror: '',
  }
  let loginData;
  const [inputData, setInputData] = useState({
    uname: loginData?.name?.uname?.text || '',
    pswd: loginData?.name?.pswd?.text || ''
  })
  const [error, setError] = useState(defaultError);
  const [mode, setMode] = useState(null);
  const [loginError, setLoginError] = useState(false)



  const changeMode = () => {
    mode ? setMode(null) : setMode('Personal')
  }


  const handleModalClose = () => {
    setIsModalOpen(false);
    router.push('/', undefined, { scroll: false });
  }

  const handleInputChange = (e) => {
    setInputData({ ...inputData, [e.target.name]: e.target.value });
  };


  //handle validation
  const checkValidation = async () => {
    let errorObj = {};
    if (inputData?.uname === '') {
      errorObj.unameerror = 'Please enter username!';
    }
    if (inputData?.pswd === '') {
      errorObj.pwderror = 'Please enter password!';
    }
    return errorObj;
  }

  const handleLogin = async () => {
    let errors = await checkValidation()
    setError(errors)
    if (!Object.keys(errors).length) {
      setError(defaultError)
      let response;
      let base64 = btoa(`${inputData?.uname}:${inputData?.pswd}`);
      const headers = {
        "Authorization": `Basic ${base64}`
      }
      const payload = {
        // "email": context?.query?.email
      }
      let sessionId = null;
      let body = {};
      const payloadtype = "normallogin"
      body.payload = payload;
      body.payloadtype = payloadtype;
     
      try {
        response = await axios.post(`api/login`, body, { headers })
      } catch (err) {
        console.log(err,"=========================================catch")
      }

      const sId = response?.data?.res2?.sessionId;
      if (sId) {
        sessionId = sId;
        setState({ ...state, sessionId: sessionId });
        setCookies('sessionid', sessionId);
      }
      if (response?.status === 200) {
        const sId = response?.data?.sessionId;
        if (sId) {
          sessionId = sId;
        }
        handleModalClose()
        router.push('/', undefined, { scroll: false })
      }
      else {
        setLoginError(true)
      }
    }
  }

  const handleForgotUsername = () => {
    setForgotUsername(true)
  }

  const handleForgotPassword = () => {
    setForgotPassword(true)
    setForgotUsername(false)
  }

  const handleSignUp = () => {
    { login ? setLogin(false) : setLogin(true) }
  }

  const handleGoogleLogin = () => {
    setGogoleLogin(true)
    setLogin(false)
    router.push('/googlelogin', undefined, { scroll: false });
  }


  const handleForgetUsername = async () => {
    const payload = {
      email: inputData?.useremail,
      redirectURL: 'http://localhost:3000/'
    }
    let response;
    let body = {}
    body.payload = qs.stringify(payload)
    body.payloadtype = "forgotusername"
    response = await axios.post(`api/login`, body)
    if (response.status === 500) {
      const responsedata = convertXmltoJson(response);
    }
  }



  const handleGoBack = () => {
    setLogin(true)
    setForgotPassword(false)
    setForgotUsername(false)
  }

  const handleForgetPassword = async () => {
    let errors = await checkValidation()
    setError(errors)

    const payload = {
      username: inputData?.uname,
      redirectURL: 'http://localhost:3000/'
    }
    let response;
    let body = {}
    body.payload = qs.stringify(payload)
    body.payloadtype = "forgotusername"
    response = await axios.post(`api/login`, body)
    console.log('response.data', response)
    if (response.status === 500) {
      const responsedata = convertXmltoJson(response);
    }
  }


  const LoginForm = () => {
    if (forgotusername) {
      return (
        <>
          <Modal isOpen={isModalOpen} closeBtn={handleModalClose} sizeClass="small-modal c2m_modal">
            <div className="modal-dialog modal-dialog-centered ">
              <div className="modal-content border-0">
                <div className="modal-body pt-0">
                  <div className="container p-0">
                    <div className="align-items-end d-flex justify-content-between flex-column mb-lg-4 mb-2">
                      <div className="title mx-auto">
                        <h2 className=" text-center py-2 fw-28">Forgot Username</h2>
                      </div>
                      <div className="title mx-auto">
                        <h2 className=" text-center py-2 fw-16">Enter your email</h2>
                      </div>
                    </div>
                    <div className="mb-3">
                      <input type="email" placeholder="Email" className="form-control" name="useremail" onChange={(e) => handleInputChange(e)} required />
                      {/* {error?.useremailerror ? <p className="text-danger">{error?.useremailerror}</p> : null} */}
                    </div>
                    <button type="submit" onClick={handleForgetUsername} className="btn btnTheme mb-3 w-100 justify-content-center">Continue</button>
                    <div className="text-center mb-3">
                      <a onClick={handleGoBack} className="text-decoration-none">Back to sign in</a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Modal>
        </>
      )
    }
    else if (forgotpassword && !forgotusername) {
      return (
        <>
          <Modal isOpen={isModalOpen} closeBtn={handleModalClose} sizeClass="small-modal c2m_modal">
            <div className="modal-dialog modal-dialog-centered ">
              <div className="modal-content border-0">
                <div className="modal-body pt-0">
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
                      <a onClick={handleGoBack} className="text-decoration-none">Back to sign in</a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Modal>
        </>
      )
    }
    else {
      return (
        <>
          <Modal isOpen={isModalOpen} closeBtn={handleModalClose} sizeClass="small-modal c2m_modal change-size">
            <div className="modal-dialog modal-dialog-centered ">
              <div className="modal-content border-0">
                <div className="modal-body pt-0">
                  <div className="container p-0">
                    <div className="align-items-end d-flex justify-content-between flex-column mb-lg-4 mb-2">
                      <div className="title mx-auto">
                        <h2 className=" text-center py-2 fw-28">Sign In</h2>
                      </div>
                      <div className="title mx-auto">
                        <h2 className=" text-center py-2 fw-16">Welcome Back</h2>
                      </div>
                    </div>
                    {loginError === true ? <div className="bgError">Please re-enter your login information and try again. If you continue to experience
                      problems with your Click2Mail login your account may have been locked for security reasons. Please call
                      Click2Mail Customer Support at 866-665-2787 between the hours of 9am and 8PM EST M-F for assistance.
                    </div> : ""}
                    <div className="mb-3">
                      <input type="text" placeholder="Username" className="form-control" name="uname" value={inputData.uname} onChange={(e) => handleInputChange(e)} />
                      {error?.unameerror ? <p className="text-danger">{error?.unameerror}</p> : null}
                    </div>
                    <div className="mb-3">
                      <input type="password" placeholder="Password" className="form-control" name="pswd" value={inputData.pswd} onChange={(e) => handleInputChange(e)} />
                      {error?.pwderror ? <p className="text-danger">{error?.pwderror}</p> : null}
                    </div>
                    <button onClick={handleLogin} className="btn btnTheme mb-3 w-100 justify-content-center">Login</button>
                    <div className="d-flex justify-content-between mb-3">
                      <a onClick={handleForgotUsername} className="text-decoration-none">Forget Username?</a>
                      <a onClick={handleForgotPassword} className="text-decoration-none">Forget Password?</a>
                    </div>
                    <div className="align-items-center d-flex justify-content-between mb-2">
                      <hr className="w-50" />
                      <span className="px-3">Or</span>
                      <hr className="w-50" />
                    </div>

                    <div className="border text-center p-2 mb-3 d-flex align-items-center justify-content-center">Sign up or
                      sign in using <img src="/images/google.svg" onClick={handleGoogleLogin} alt="" className="ms-2" /></div>
                    <hr />
                    <div className="text-center mb-3">
                      <p>Don’t have an account?</p>
                      <a onClick={handleSignUp} className="text-decoration-none">Sign up</a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Modal>
        </>
      )
    }
  }

  const renderModalBody = () => {
    let bodyHtml;
    switch (showResponse.status) {
      case 'success':
        bodyHtml = (
          <div className="modal-content border-0">
            <div className="modal-header border-0 pb-0 pt-1">
            </div>
            <div className="modal-body">
              <div className="text-center">
                <a href="#" className="mb-2 successCircle" ><img src="/images/check.svg" alt="" /></a>
                <h4 className="mb-2 successText">{showResponse.message}</h4>
                <p className="mb-2 modalClass" onClick={handleGoBack}>Go to Login</p>
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
                <h4 className="mb-2 errorText">{showResponse.message}</h4>
                <p className="mb-2 modalClass" onClick={() => setShowResponse({ responseModal: false, status: "", message: "" })}>Try again</p>
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


  const SignUpForm = () => {
    return (
      <>
        {showResponse.responseModal
          ? <Modal isOpen={isModalOpen} closeBtn={handleModalClose} sizeClass="small-modal c2m_modal">
            <div className="modal-dialog modal-dialog-centered ">
              {renderModalBody()}
            </div>
          </Modal>
          : <Modal isOpen={isModalOpen} closeBtn={handleModalClose} sizeClass="small-modal c2m_modal change-size">
            <div className="modal-dialog modal-dialog-centered ">
              <div className="modal-content fixmodel">
                <div className="modal-body pt-0">

                  <div className="container p-0">
                    <div className="align-items-end d-flex justify-content-between flex-column mb-lg-4 mb-2">
                      <div className="title mx-auto">
                        <h2 className=" text-center py-2 fw-28">Sign Up</h2>
                      </div>
                      <div className="title mx-auto">
                        <h2 className=" text-center py-2 fw-16">Welcome, select your acocunt type</h2>
                      </div>
                    </div>
                    <div className="btn-group devicebtn nav ">
                      <button type="button" className={mode ? 'btn btn-primary' : "btn btn-outline-primary"} data-bs-toggle="pill" onClick={changeMode}>Personal</button>
                      <button type="button" className={mode ? "btn btn-outline-primary" : 'btn btn-primary'} data-bs-toggle="pill" onClick={changeMode}>Business/Organization</button>
                    </div>

                    {mode ? <PersonalForm updateStatus={setShowResponse} /> : <BusinessForm updateStatus={setShowResponse} />}

                    <div className="align-items-center d-flex justify-content-between mb-2">
                      <hr className="w-50" />
                      <span className="px-3">Or</span>
                      <hr className="w-50" />
                    </div>
                    <div className="border text-center p-2 mb-3 d-flex align-items-center justify-content-center">Sign up or sign
                      in using <img src="/images/google.svg" alt="" className="ms-2" onClick={handleGoogleLogin} /></div>
                    <hr />
                    <div className="text-center mb-3">
                      <p>Do you have an account?</p>
                      <a onClick={handleSignUp} className="text-decoration-none">Sign In</a>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </Modal>
        }
      </>
    )
  }

  return (
    <>
      {/* {sessionId ? <Homepage /> : <> {login ? LoginForm() : SignUpForm()} </>}
      {googlelogin ? <Google /> : ''} */}
      {login ? LoginForm() : SignUpForm()}
    </>
  )

}
export default Login;