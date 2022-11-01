import { createContext, useState, useEffect } from 'react';

const NavContext = createContext();

const NavContextProvider = (props) => {

  //Global State
  const [state, setState] = useState({
    sessionId: null,
    isMobile: false,
    selectedMailingList: [],
    costBreakdown: null,
    jobId: null,
    proofId: '',
    proofStatus: false,
    documentId: '',
    tokenId:'',
    accessToken: null,
    googleId:'',
    profileObj: [],
    googleAuthObject: {},
    documentName: '',
    jobSuccess: false,
    fundAddSuccess: ''
  })

  const checkIsMobile = () => {
    let isMobileView = navigator.userAgent.match(
      /BlackBerry|iPhone|Opera Mini|IEMobile|WPDesktop|(android(.*mobile))/i
    );
    setState(prevState => ({ ...prevState, isMobile: isMobileView }));
  }

  useEffect(() => {console.log('STATE-----', state)}, [state])

  useEffect(() => {
    checkIsMobile();
  }, [])

  return (
    <NavContext.Provider value={{ state, setState }}>
      {props.children}
    </NavContext.Provider>
  )
}


export { NavContextProvider, NavContext }
