import axios from 'axios'

// This will give us session id by taking the username and passowrd 

export default async function loginhandler(req, res) {

    let baseurl= "https://api-proxy.click2mail.com/molpro/system";

    if( req.body.payloadtype === 'normallogin') {
      const url = "/account/authorizeSession"
      const headers = {
        "X-Auth-Token": process.env.STAGING_API_KEY,
        "Authorization" : req.headers.authorization
      }
      const body = req.body.payload
      const finalurl = `${baseurl}${url}`
      let response = await axios.post(`${finalurl}`, body, { headers })
      console.log('response.data', response)  
      let res2 = response.data
      res.status(200).json({ res2 })
      res.status(500).json({ res2 })
      res.write(res2);
      res.end();
    }

    if( req.body.payloadtype === 'googlelogin') {
      const url = "/users/singleSignOn"
      const headers = {
          "X-Auth-Token": process.env.STAGING_API_KEY,
      }
      const body = req.body.payload
      const finalurl = `${baseurl}${url}`
      let response = await axios.post(`${finalurl}`, body, { headers })
      let res2 = response.data
      res.status(200).json({ res2 })
      res.status(500).json({ res2 })
      res.write(res2);
      res.end();
    }

    if( req.body.payloadtype === 'signup') {
      const url = "/account/create"
      const headers = {
          "X-Auth-Token": process.env.STAGING_API_KEY,
      }
      const body = req.body.payload
      const finalurl = `${baseurl}${url}`
      let response = await axios.post(`${finalurl}`, body, { headers })
      let res2 = response.data
      res.status(200).json({ res2 })
      res.status(500).json({ res2 })
      res.write(res2);
      res.end();

    }

    if( req.body.payloadtype === 'forgotusername') {
      const url = "/users/forgotUserName"
      const headers = {
        "X-Auth-Token": process.env.STAGING_API_KEY,
      }
      const body = req.body.payload
      const finalurl = `${baseurl}${url}`
      let response = await axios.post(`${finalurl}`, body, { headers })
      let res2 = response.data
      res.status(200).json({ res2 })
      res.status(500).json({ res2 })
      res.write(res2);
      res.end();
    }


    if( req.body.payloadtype === 'forgotpassword') {
      const url = "/users/resetPassword"
      const headers = {
        "X-Auth-Token": process.env.STAGING_API_KEY,
      }
      const body = req.body.payload
      const finalurl = `${baseurl}${url}`
      let response = await axios.post(`${finalurl}`, body, { headers })
      let res2 = response.data
      res.status(200).json({ res2 })
      res.status(500).json({ res2 })
      res.write(res2);
      res.end();
    }
}
  