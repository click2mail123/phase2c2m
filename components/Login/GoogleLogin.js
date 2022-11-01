import { useContext, useState, useEffect } from 'react'
import { NavContext } from '../Context/NavContextProvider';
import { useRouter } from 'next/router'
import { setCookies } from '../../helper/helper';
import axios from 'axios'
import dynamic from 'next/dynamic';

const Loader = dynamic(() => import('../Shared/Loader'))

const Google = () => {
	const { state, setState } = useContext(NavContext);
	const [loading, setLoading] = useState(true);
	const router = useRouter();

	let access_token, client, googleAuthObject = {}
	//call the token initialize function
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
				getProfileInfo(access_token)
				googleAuthObject.accessToken = access_token;
			},
		});
	}

	const getProfileInfo = async (token) => {
// 		let response = await axios.get(`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${token}`)
// 		if(response.status === 200){
// 			let profile = response.data
// 			if (profile?.email) {
// 				googleAuthObject.email = profile.email
// 				setCookies('googleuseremail', profile.email)
// 			}
// 		}
		// In some cases with newer google accounts, sometimes above api did not work, that's why using this one.
// 		if(response.status === 400 || response.status === 401){
			let emailresponse = await axios.get(`https://www.googleapis.com/drive/v3/about?fields=user&access_token=${token}`)
			if(emailresponse.status === 200) {
				let email = emailresponse?.data?.user?.emailAddress
				if (email) {
					googleAuthObject.email = email
					setCookies('googleuseremail', email)
				}
			}
// 	}
		setState({ ...state, googleAuthObject })
		router.query.email = googleAuthObject.email;
		router.asPath = '/';
		router.push(router, '/');
		setLoading(false)
	}

	const getToken = () => {
		tokenCall();
		client.requestAccessToken();
	}

	return (
		<Loader />
	)
}

export default Google
