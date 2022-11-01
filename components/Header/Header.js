import {useRouter} from 'next/router';
import Image from 'next/image';
import { getCookies } from '../../helper/helper';

const Header = () => {
  const router = useRouter();
  return (
    <header className="header">
      <div className="container-xxl">
        <div className="row align-items-center">
          <div className="col-md-6 col-lg-6 col-6 align-items-center">
            <a onClick={() => {router.push('/', undefined, {shallow: true, scroll: false})}} className='d-flex'>
              <Image src='/images/logo.svg' height={50} width={200} alt='logo' className='img-fluid'/>
              </a>
          </div>
        
        </div>
      </div>
    </header>
  )
}

export default Header