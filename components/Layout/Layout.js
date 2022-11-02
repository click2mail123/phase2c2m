import { useContext } from 'react'
import { NavContext } from '../Context/NavContextProvider';
import Google from '../Login/GoogleLogin'

const Layout = (props) => {
  const { state } = useContext(NavContext);
  const { googleAuthObject} = state;
  let accessToken = googleAuthObject && googleAuthObject.accessToken;
  

  return (
    <div>
      {accessToken ? props.children : <Google />}
    </div>
  )
}


export default Layout