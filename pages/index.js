import { useEffect, useContext } from "react";
import qs from 'qs';
import { useRouter } from "next/router";
import { NavContext } from "../components/Context/NavContextProvider";
import { getCookies, removeCookies, setCookies } from "../helper/helper";
import APIService from '../helper/APIService'
import axios from 'axios'

const Home = (props) => {
  const router = useRouter();
  const { state, setState } = useContext(NavContext);

  useEffect(() => {
    const prevSessionId = getCookies('sessionid');
    if (props.sessionId) {
      removeCookies('sessionid');
      setCookies('sessionid', props.sessionId);
      setState({ ...state, sessionId: props.sessionId })
    }
  }, [props.sessionId])

  return <></>
}

export async function getServerSideProps(context) {
  const headers = {
    "X-Auth-Token": process.env.STAGING_API_KEY
  }
  const payload = {
    "email": context?.query?.email
  }
  let sessionId = null;
  const body = qs.stringify(payload)
  if (context?.query?.email) {
    
    let resturl
    if(process.env.DEV && process.env.DEV.length > 0) {
      resturl = 'https://stage-rest.click2mail.com' 
    }
    else {
      resturl = 'https://rest.click2mail.com'
    }

    let response = await axios.post(`${resturl}/molpro/system/users/singleSignOn`, body, { headers })
    if (response.status === 200) {
      const sId = response.data.sessionId;
      if (sId) {
       sessionId = sId;
      }
    }
    console.log("Login Successful through google", sessionId);
  }
  return { props: { sessionId } }
}

export default Home;
