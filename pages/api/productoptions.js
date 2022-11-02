import axios from 'axios'

// This will give us session id by taking the username and passowrd 

export default async function productoptions(req, res) {

    let baseurl= "https://api-proxy.click2mail.com/molpro/system/productOptions/advanced";
    let username = 'click2mail123';
    let queryparamas = req.body

    // const res = await axios.get(`https://api-proxy.click2mail.com/molpro/system/productOptions/advanced?username=${username}&documentClass=${documentSize}&skipBulkPrint=true`, {headers});
      const url = "/account/authorizeSession"
      const headers = {
        "X-Auth-Token": process.env.STAGING_API_KEY,
      }
      const finalurl = `${baseurl}${url}`
      let response = await axios.get(`${finalurl}`, { headers })
      console.log('response.data', response)  
      let res2 = response.data
      res.status(200).json({ res2 })
      res.status(500).json({ res2 })
      res.write(res2);
      res.end();
}
  