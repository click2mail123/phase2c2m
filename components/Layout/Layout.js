import { useContext } from 'react'
import { NavContext } from '../Context/NavContextProvider';
// import Google from '../Login/GoogleLogin'
import { useRouter } from 'next/router';


const Layout = (props) => {
  const router = useRouter();
  const { state, setState } = useContext(NavContext);
  const { googleAuthObject } = state;
  let accessToken = googleAuthObject && googleAuthObject.accessToken;

  console.log('the layout componetn')
  console.log('the layout componetn props', props)
  let params = router.query.state;
  console.log('params in the layout', params)
 

  return (
    <div>
      {props.children }
    </div>
  )
}


export default Layout