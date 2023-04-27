'use client';

import React, { useEffect, useRef, useState } from "react";
import DataTable from 'react-data-table-component';

export default function DataTableComponent(coordinates:any, tableData:any){
  const [data, setData] = useState(tableData);
  const [selectedRiskFactor, setSelectedRiskFactor ] = useState(null);

  /**
   * To set or update table data when selects/deselects the marker on map
   */
  useEffect(() => {
    if(coordinates !== null) {
      const selectedMarker = tableData.filter(obj => {
        return obj.latitude == coordinates.latitude && obj.longitude == coordinates.longitude
      })

      setData(selectedMarker);
    } else{
      setData(tableData)
    }
  }, [coordinates, tableData])
  
  const riskFactors = ["Earthquake", "Tornado", "Drought", "Flooding", "Extreme cold", "Sea level rise", "Wildfire", "Extreme heat", "Volcano" ]

  /**
   * Table columns
   */
  const columns = [
    {
        name: 'Asset Name',
        selector: row => row.assetName,
        sortable: true,
    },
    {
        name: 'Latitude',
        selector: row => row.latitude,
        sortable: true,
    },
    {
      name: 'Longitude',
      selector: row => row.longitude,
      sortable: true,
    },
    {
      name: 'Business Category',
      selector: row => row.businessCat,
      sortable: true,
    },
    {
      name: 'Risk Rating',
      selector: row => row.riskRating,
      sortable: true,
    },
    {
      name: 'Risk Factor',
      width: '75rem',
      selector: row => row.riskFactor,
      sortable: true,
    },
  ];

  /**
   * To handle risk factor onChange
   */
  const handleRiskFactorSelect = (e) => {
    const riskFactor = e.target.value;
    setSelectedRiskFactor(riskFactor);
    const filteredData = tableData.filter(obj => {
      return obj.riskFactor.includes(riskFactor);
    })
    setData(filteredData);
  }

  return (
    <>
      <div className="text-center">
        <p style={{fontSize: '20px'}}>Table View of Climate Data</p>
      </div>
      <div style={{marginRight: '10px', marginBottom: '5px'}}>
        <label>Filter By Risk Factor:</label> &nbsp;
        <select
            name="Assets"
            onChange={e => handleRiskFactorSelect(e)}
            value={selectedRiskFactor}
          >
            {riskFactors.map(riskFactor => (
              <option key={riskFactor} value={riskFactor}>
                {riskFactor}
              </option>
            ))}
        </select>
      </div>
        <DataTable
          columns={columns}
          data={data}
          pagination
          highlightOnHover
        />
    </>
  );
}
