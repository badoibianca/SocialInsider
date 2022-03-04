import './App.css';
import React, { useState } from 'react';
import axios from 'axios';
import { DataGrid } from '@mui/x-data-grid';
import TextField from '@mui/material/TextField';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DatePicker from '@mui/lab/DatePicker';

async function getBrands(){
  let brands = await axios('http://localhost:5000/brands',{
    method: 'get'
  })
  return brands.data.result
}

async function getProfileData(id, type, value1, value2){
  const data = await axios('http://localhost:5000/profiles',{
    method: 'post',
    data: {
      id: id,
      profile_type: type,
      start: value1.getTime(),
      end: value2.getTime()
    }
  })
  return data.data.resp[id]
}

function App() {

  const columns = [
    { field: 'brandName', headerName: 'Brand Name', width: 170 },
    { field: 'totalProfiles', headerName: 'Total Profiles', width: 130 },
    { field: 'totalFans', headerName: 'Total Fans', width: 130 },
    { field: 'totalEngagement', headerName: 'Total Engagement', width: 170 },
  ];
  const [brands, setBrands] = useState([]);
  const [value1, setValue1] = useState(new Date());
  const [value2, setValue2] = useState(new Date());

  const fetchData = async () => {
    setBrands([])
    const brandsData = await getBrands()
    let temp = []
    let i = 0
    for(const brand of brandsData)
    { 
      let fans = 0
      let engagement = 0
      
      for(const profile of brand.profiles)
      {
        const id = profile.id
        const type = profile.profile_type
        const datesData = await getProfileData(id, type, value1, value2)
        const keys = Object.keys(datesData)
     
        for (const key of keys) 
        { 
          if(!datesData[key].engagement)
           {   
             engagement += 0
           }
          else
           {   
             engagement += datesData[key].engagement 
           }  
          }

          let counter = 1
          while((datesData[keys[keys.length - counter]].fans) == null)
            counter++
          fans += datesData[keys[keys.length - counter]].fans
          //console.log(fans)
      }
      
      const newBrand = {
          id: i++,
          brandName: brand.brandname,
          totalProfiles: brand.profiles.length,
          totalFans: fans,
          totalEngagement: engagement
      }
      temp.push(newBrand)
    }
    setBrands(temp)
  }

return (
	<div className="App" >
    <div className="picker1">
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DatePicker
            label="Data 1"
            value={value1}
            onChange={(newValue) => {
              setValue1(newValue);
            }}
            renderInput={(params) => <TextField {...params} />}
          />
        </LocalizationProvider>
    </div>

    <div className="picker2">
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <DatePicker
        label="Data 2"
        value={value2}
        onChange={(newValue) => {
          setValue2(newValue);
        }}
        renderInput={(params) => <TextField {...params} />}
        />
      </LocalizationProvider>
    </div>

    <div className="button">
      <button onClick={fetchData}>Fetch data</button>
    </div>

    <div className="table">
      <DataGrid
        rows={brands}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5]}
        checkboxSelection    
      />
    </div>
	</div>
);
}

export default App;
