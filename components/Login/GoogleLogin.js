import { useContext, useState, useEffect } from 'react'
import { NavContext } from '../Context/NavContextProvider';
import { useRouter } from 'next/router'
import { setCookies } from '../../helper/helper';
import dynamic from 'next/dynamic';



const Loader = dynamic(() => import('../Shared/Loader'))

const Google = () => {
  // const router = useRouter();
  const { state, setState } = useContext(NavContext);
  const [loading, setLoading] = useState(true);
  const [fromgoogle, setFromGoogle] = useState(false);
  const router = useRouter();

  let access_token, client, googleAuthObject = {}
  //call the token initialize function
  // useEffect(() => {
  // 	loginDecide()
  // }, [])

  useEffect(() => {
    getToken()
  }, [])

  console.log('process.env.GOOGLE_CLIENT_ID', process.env.GOOGLE_CLIENT_ID)
  const tokenCall = () => {
    client = google.accounts.oauth2.initTokenClient({
      // client_id: getGoogleClientId(),
      client_id: process.env.GOOGLE_CLIENT_ID,
      scope: 'https://www.googleapis.com/auth/drive',
      callback: (tokenResponse) => {
        access_token = tokenResponse.access_token;
        // getProfileInfo(access_token)
        googleAuthObject.accessToken = access_token;
      },
    });
  }

  const getToken = () => {
    tokenCall();
    client.requestAccessToken();
  }

  return (<Loader />)
}

export default Google
