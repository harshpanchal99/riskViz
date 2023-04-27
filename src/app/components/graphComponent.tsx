'use client';

import React, { useEffect, useRef, useState } from "react";
import { HighchartsReact } from "highcharts-react-official";
import Highcharts from 'highcharts';

export default function GraphComponent() {

  const [assets, setAssets] = useState([]);
  const [businessCat, setBusinessCategory] = useState([]);
  const [locations, setLocations] = useState([]); 

  const [selectedAsset, setSelectedAsset] = useState(null); 
  const [selectedBusiness, setSelectedBusiness] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null); 

  const [chartOptions, setChartOptions] = useState({}); 
  const [tableData, setTableData] = useState([]);
 
  /**
   * Get api to fetch all excel data
   */
  const getAll = async () => {
    const response = await fetch("/api/hello", {
      method: "GET",
      headers: new Headers({
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      }),
    });
    return response.json();
  };

  /**
   * To set data on component load
   */
  useEffect(() => {
    getAll().then((data) => {
      setTableData(data)
    })
  },[tableData.length])

  /**
   * To populate the asset, business category, locations filter dropdown values dynamically depending on the data provided
   */ 
  useEffect(() => {
    const assetsArray = tableData.map((obj) => {
      return obj.assetName;
    })
    const businessCatArray = tableData.map((obj) => {
      return obj.businessCat;
    })
    const locations = tableData.reduce((acc, obj)=>{
      var exist = acc.find(({latitude, longitude}) => obj.latitude == latitude && obj.longitude == longitude );
      if(!exist){
       acc.push(obj);
      }
      return acc;
    },[]);

    const latLong = locations.map(obj => {
      return obj.latitude + ',' + obj.longitude;
    })

    const uniqueAssets = assetsArray.filter((value, index, array) => array.indexOf(value) === index);
    const uniqueBusinessCategory = businessCatArray.filter((value, index, array) => array.indexOf(value) === index);

    setAssets(uniqueAssets);
    setBusinessCategory(uniqueBusinessCategory);
    setLocations(latLong);
    
    setSelectedAsset(uniqueAssets[0]);
    setSelectedBusiness(uniqueBusinessCategory[0]);
    setSelectedLocation(latLong[0])
  }, [tableData])

  /**
   * Method to handle asset onChange event
   */     
  const handleAssetSelect = (e: any) => {
    setSelectedAsset(e.target.value);
  }

  /**
   * Method to handle business category onChange event
   */
  const handleBusinessSelect = (e: any) => {
    setSelectedBusiness(e.target.value);
  }

  /**
   * Method to handle location onChange event
   */
  const handleLocationSelect = (e: any) => {
    setSelectedLocation(e.target.value);
  }

  /**
   * Updating graph data when user changes the filter criteria 
   */
  useEffect(() => {
    const latitude = selectedLocation?.split(',')[0];
    const longitude = selectedLocation?.split(',')[1];
    const filterData = tableData.filter(obj => {
      return obj.assetName == selectedAsset && obj.businessCat == selectedBusiness &&
              obj.latitude == latitude && obj.longitude == longitude
    })

    setChartOptions({
      title: {
        text: 'Risk rating over time'
      },
      yAxis: {
        title: {
          text: 'Risk Rating',
        },
      },
      xAxis: {
        title: {
          text: 'Year',
        },
        categories: filterData.map(obj => obj.year),
      },
      tooltip: {
        formatter: function() {
          return 'Asset name <b>' + selectedAsset + '</b></br> Risk Rating <b>' + this.y + '</b> ';
        }
      },
      series: [
        { data: filterData.map(obj => obj.riskRating) }
      ],
    })

  },[selectedAsset, selectedBusiness, selectedLocation])
  
  return (
    <>
      <div className="text-center">
        <p style={{fontSize: '20px'}}>Graph Stimulation of Data</p>
      </div>
      <div>
        <div style={{marginRight: '10px', marginBottom: '5px'}}>
          <label>Select the Asset</label> &nbsp;
          <select
              name="Assets"
              onChange={e => handleAssetSelect(e)}
              value={selectedAsset}
            >
              {assets.map(asset => (
                <option key={asset} value={asset}>
                  {asset}
                </option>
              ))}
          </select>
        </div>
        <div style={{marginRight: '10px', marginBottom: '5px'}}>
          <label>Select the Business Category</label> &nbsp;
          <select
              name="Years"
              onChange={e => handleBusinessSelect(e)}
              value={selectedBusiness}
            >
              {businessCat.map(business => (
                <option key={business} value={business}>
                  {business}
                </option>
              ))}
          </select>
        </div>
        <div style={{marginRight: '10px', marginBottom: '5px'}}>
          <label>Select the Location</label> &nbsp;
          <select
              name="Locations"
              onChange={e => handleLocationSelect(e)}
              value={selectedLocation}
            >
              {locations.map(location => (
                <option key={location} value={location}>
                  {location}
                </option>
              ))}
          </select>
        </div>
      </div>
      <div>
        <HighchartsReact
          highcharts={Highcharts}
          options={chartOptions}
        />
      </div>
    </>
  )

}
