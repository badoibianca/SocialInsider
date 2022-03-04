var axios = require('axios');
var bodyParser = require('body-parser');
const api_url = "https://app.socialinsider.io/api";

const express = require("express"),
  app = express(),
  port = 5000,
  cors = require("cors");

app.use(cors());
app.use(express.json())

app.get("/brands", (req, res) => {
  const data = {
    jsonrpc: '2.0',
    id: 0,
    method: 'socialinsider_api.get_brands',
    params: {
        projectname: 'API_test'
    }
  }
  return axios(api_url , {
    headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer API_KEY_TEST'
    },
    method: 'post',
    data: JSON.stringify(data)
}).then((response) => {
  console.log(response.data);
  res.send(response.data);
}).catch((err) => {
  console.log("failed to grab info");
  res.send("error");
});
});

app.post("/profiles", (req, res) => {
  const id = req.body.id
  const profile = req.body.profile_type
  const start = req.body.start
  const end = req.body.end

  const dataProfiles = {
    id: 1,
    method: 'socialinsider_api.get_profile_data',
    params: {
        id: id,
        profile_type: profile ,
        date:{
          start: start,
          end: end ,
          timezone: 'Europe/London'
        }
    }
  }
  return axios(api_url , {
    headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer API_KEY_TEST'
    },
    method: 'post',
    data: JSON.stringify(dataProfiles)
}).then((response) => {
  console.log(response.data);
  res.send(response.data);
}).catch((err) => {
  console.log("failed to grab info");
  res.send("error");
}); 
});

app.listen(port, () => console.log("Merge serverul " + port));
