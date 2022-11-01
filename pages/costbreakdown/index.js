import { useState, useContext, useEffect } from 'react'
import {useRouter} from 'next/router'
import { NavContext } from '../../components/Context/NavContextProvider';
import ErrorMessage from '../../components/Shared/ErrorMessage';



const CostBreakdown = () => {
  const router = useRouter();
  const { state } = useContext(NavContext);
  const { isMobile, costBreakdown } = state;

  const [costDetails, setCostDetails] = useState({ ...costBreakdown });
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (!costBreakdown) {
      setError(true);
      setErrorMessage({ heading: "Unable to fetch cost details" });
    }
  }, [costBreakdown])


  const renderMobileView = () => {
    return (
      <div className="table-responsive f-16 d-lg-block d-md-block d-block">
        <table className="table pad_margin">
          <thead className="border-top">
            <tr>
              <th>Description</th>
              <th>Subtotal</th>
            </tr>
          </thead>
          <tbody className="border-bottom">
            <tr>
              <td className="d-flex flex-column">
                <span className=" h5 themeBlack mb-1 fw-16  fw-bold">Postage Costs</span>
                <span className="">
                  {costDetails.standardCost ? costDetails.standardCost.postageName.text : ""}
                </span>

                <ul className="list-unstyled checkout_Item">
                  <li> <p> Price</p>:<p>
                    ${costDetails.standardCost ?
                      costDetails.standardCost.postageUnitCost.text : 0}
                  </p></li>
                  <li> <p>Quantity</p>:<p>
                    {costDetails.standardCost ? costDetails.standardCost.quantity.text : 0}
                  </p></li>
                </ul>
              </td>

              <td className="">
                ${costDetails.standardCost ? costDetails.standardCost.subtotal.text : 0}
              </td>
            </tr>
            <tr>
              <td><span className=" h5 themeBlack fw-16  fw-bold">Production Cost</span>
                <ul className="list-unstyled checkout_Item">
                  <li> <p> Price</p>:<p>
                    ${costDetails.productionCost ?
                      costDetails.productionCost.productionUnitCost.text : 0}
                  </p></li>
                  <li> <p>Quantity</p>:<p>
                    {costDetails.productionCost ?
                      costDetails.productionCost.quantity.text : 0}
                  </p></li>
                </ul>

              </td>
              <td className="">
                ${costDetails.productionCost ?
                  costDetails.productionCost.subtotal.text : 0}
              </td>
            </tr>
          </tbody>
          <tfoot className="text-nowrap">
            <tr>
              <td className="fw-bold fw_blue text-end ">Total Price :</td>
              <td className="fw-bold fw_blue ">
                ${costDetails.totalCost ? costDetails.totalCost.text : 0}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    )
  }

  return (
    <>
      {costBreakdown ?
        <>
          <div className="cost-overlay" onClick={() => router.back()}></div>
            <div className="modal-body py-8 rytarrowModal shadow-lg popover cost-pop">
              <form action="#">
                <div className="container p-0">
                  <div className="align-items-end d-flex justify-content-between mb-lg-4 mb-2">
                    <div className="title mx-auto">
                      <h2 className=" text-center p-0 fw-28">Cost Breakdown</h2>
                    </div>
                  </div>
                  {/* Desktop Start */}
                  {isMobile ? renderMobileView() :
                    <div className="table-responsive f-16 d-lg-block d-md-block d-block">
                      <table className="table pad_margin">
                        <thead className="border-top">
                          <tr>
                            <th>Description</th>
                            <th>Price</th>
                            <th className="text-center">Quantity</th>
                            <th>Subtotal</th>
                          </tr>
                        </thead>
                        <tbody className="border-bottom border-top">
                          <tr>
                            <td className="d-flex flex-column">
                              <span className=" h5 themeBlack mb-2  fw-bold">
                                Postage Costs
                              </span>
                              <span className="">
                                {costDetails.standardCost ? costDetails.standardCost.postageName.text : ""}
                              </span>
                            </td>
                            <td className="">
                              ${costDetails.standardCost ? costDetails.standardCost.postageUnitCost.text : 0}
                            </td>
                            <td className=" text-center">
                              {costDetails.standardCost ? costDetails.standardCost.quantity.text : 0}
                            </td>
                            <td className="">
                              ${costDetails.standardCost ? costDetails.standardCost.subtotal.text : 0}
                            </td>
                          </tr>
                          <tr>
                            <td><span className="h5 themeBlack fw-bold">Production Cost</span></td>
                            <td className="">
                              ${costDetails.productionCost ? costDetails.productionCost.productionUnitCost.text : 0}
                            </td>
                            <td className=" text-center">
                              {costDetails.productionCost ?
                                costDetails.productionCost.quantity.text : 0}
                            </td>
                            <td className="">
                              ${costDetails.productionCost ?
                                costDetails.productionCost.subtotal.text : 0}
                            </td>
                          </tr>
                        </tbody>
                        <tfoot className="text-nowrap border-top">
                          <tr>
                            <td></td>
                            <td></td>
                            <td className="fw-bold fw_blue text-center ">Total Price :</td>
                            <td className="fw-bold fw_blue ">
                              ${costDetails.totalCost ? costDetails.totalCost.text : 0}
                            </td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  }
                </div>
              </form>
            </div>
        </> :
        <>
          {error && <ErrorMessage message={errorMessage}
            handleErrorClose={() => {
              setError(false)
              router.push('/', undefined, {scroll: false})
            }} />}
        </>
      }
    </>
  )
}

export default CostBreakdown