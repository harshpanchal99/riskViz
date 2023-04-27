'use client';

import React, { Suspense, useEffect, useRef, useState } from "react";
import MapComponent from "./components/mapComponent";
import DataTableComponent from "./components/dataTableComponent";
// React Lazy loading applied on graph as it is outside of viewpoint
const GraphComponent  = React.lazy(() => import('./components/graphComponent'));

export default function Home() {
  const [coordinates, setCoordinates] = useState(null);
  const [tableData, setTableData] = useState([]);
  
  // Passing of Data between two components 
  // When user clicks on the map marker the table data get's updated with selected marker data 
  const map = MapComponent(setCoordinates, setTableData);
  const dataTable = DataTableComponent(coordinates, tableData);

  return (
      <>
        <head>
           <title>
              Climate Risks
           </title>
        </head>  
        <main className="flex min-h-screen flex-col items-center justify-between">
          <p style={{fontSize:'50px', marginTop: '20px'}}>Climate Risks Data Stimulation</p>
          <div className="sub-component">
            {map}
          </div>
          <hr style={{margin: '10px'}}/>
          <div style={{border: '1px solid black', width: '1000px'}}>          
            {dataTable}
          </div>
          <hr style={{margin: '10px'}}/>
          <div className="sub-component" style={{width: '1000px'}}>
            {/* Demonstrating React Lazy loading for Graph */}
            <Suspense fallback={<span>Loading...</span>}>
              <GraphComponent />
            </Suspense>
          </div>
        </main>
      </>
  )
}
  