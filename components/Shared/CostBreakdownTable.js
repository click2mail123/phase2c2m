import React from 'react'

const CostBreakdownTable = ({costBreakdown}) => {
  return (
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
                  {costBreakdown.standardCost ? costBreakdown.standardCost.postageName.text : ""}
                </span>
              </td>
              <td className="">
                ${costBreakdown.standardCost ? costBreakdown.standardCost.postageUnitCost.text : 0}
              </td>
              <td className=" text-center">
                {costBreakdown.standardCost ? costBreakdown.standardCost.quantity.text : 0}
              </td>
              <td className="">
                ${costBreakdown.standardCost ? costBreakdown.standardCost.subtotal.text : 0}
              </td>
            </tr>
            <tr>
              <td><span className="h5 themeBlack fw-bold">Production Cost</span></td>
              <td className="">
                ${costBreakdown.productionCost ? costBreakdown.productionCost.productionUnitCost.text : 0}
              </td>
              <td className=" text-center">
                {costBreakdown.productionCost ?
                  costBreakdown.productionCost.quantity.text : 0}
              </td>
              <td className="">
                ${costBreakdown.productionCost ?
                  costBreakdown.productionCost.subtotal.text : 0}
              </td>
            </tr>
          </tbody>
          <tfoot className="text-nowrap border-top">
            <tr>
              <td></td>
              <td></td>
              <td className="fw-bold fw_blue text-center ">Total Price :</td>
              <td className="fw-bold fw_blue ">
                ${costBreakdown.totalCost ? costBreakdown.totalCost.text : 0}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
  )
}

export default CostBreakdownTable