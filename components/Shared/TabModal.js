import { useState } from 'react'
import {useRouter} from 'next/router'

const TabModal = (props) => {
  const router = useRouter();
  const {currentTab, buttons} = props
  const [activeTab, setActiveTab] = useState(currentTab);

  const toggleMode = (url) => {
    setActiveTab(prevTab => Number(!prevTab));
    router.push(url);
  }
  return (
    <div className="d-flex justify-content-center align-content-center mt-2 mb-4">
      <div className="btn-group">
        {buttons && buttons.length > 0 && buttons.map((button,i) => (
          <button key={i} type="button" className={activeTab === i ? 'btn btn-primary' : "btn btn-outline-primary"} onClick={() => toggleMode(button.url)}>{button.buttonText}</button>
        ))}
      </div>
    </div>
  )
}

export default TabModal