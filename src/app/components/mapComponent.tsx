'use client';

import React, { useEffect, useRef, useState } from "react";
import mapboxgl from 'mapbox-gl';
import { Popup } from 'mapbox-gl';

mapboxgl.accessToken = 'pk.eyJ1IjoiYzA4MjgwMDgiLCJhIjoiY2xnd2ZmbDE4MGN0azN1cHNvOGlmOGFvZiJ9.y4NQm4T8PaRmv-JtEyM3cQ';

export default function MapComponent(setCoordinates: any, setTableData: any){
  const mapContainer = useRef();
  const [riskData, setRiskData] = useState([]);
  const [years, setYears] = useState([]);

  const [isApiCalled, setIsApiCalled] = useState(true);
  const [selectedYear, setSelectedYear] = useState("");
  
  var currentMarkers: any = [];

  const map:any = useRef(null);
  
  /**
   * To get climate risk data by year 
   */
  const riskDataApi = async (year: number) => {
    const response = await fetch("/api/hello", {
      method: "POST",
      headers: new Headers({
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      }),
      body: JSON.stringify({
        year: year
      })
    });
    return response.json();
  };

  /**
   * To create map and fetch data on component load with initial year
   */
  useEffect(() => {
    if(isApiCalled) {
        riskDataApi(2050).then((data) => {
          setRiskData(data);
        });  
    } 
    if (map.current) return; // initialize map only once
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [-119.275759, 50.26967 ],
      zoom: 12,
    });
    map.current.addControl(new mapboxgl.NavigationControl());
  });

  map.current?.on('click', () => {
    setCoordinates(null);
  })

  /**
   * To draw ddiff. color marker on map with respect to the risk factor
   */
  useEffect(() => {
    setIsApiCalled(false);
    setTableData(riskData);
    riskData.map((object: any) => {
      const popUp = new Popup({ closeButton: false, anchor: 'left', })
        .setHTML(`<div class="popup"><p>${object.assetName} : ${object.businessCat}</p></div>`)

      const colorMarker = () => {
        if(object.riskRating < 0.2) {
          return '#7efc3f';
        } else if (object.riskRating < 0.4) {
          return '#fce33f';
        } else if (object.riskRating < 0.6) {
          return '#fc973f';
        } else if (object.riskRating < 0.8) {
          return '#b5470d';
        } else if(object.riskRating > 0.8) {
          return '#b50d0d';
        }
      }

      const marker = new mapboxgl.Marker({
        color: colorMarker()
      }).setLngLat([object.longitude, object.latitude]).setPopup(popUp).addTo(map.current);

      marker.getElement().addEventListener('click', (e) => {
        const coordinates = marker.getLngLat();
        setTimeout(()=> {
          setCoordinates({longitude: coordinates.lng, latitude: coordinates.lat})
        }, 500)
      })

      currentMarkers.push(marker);
    })
  }, [riskData])

  /**
   * To change data on map with respect to change in year
   */
  useEffect(() => {
    getAll().then((data) => {
      const jsonObject = data.map((obj: any) => {
        return obj.year;
      })
    
      const uniqueYears = jsonObject.filter((value: any, index: any, array: any) => array.indexOf(value) === index);
      setYears(uniqueYears)
    });  
  }, [years.length])

  /**
   * To get all climate data 
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
   * To handle year onchange
   */
  const handleYearSelect = (e: any) => {
    const year = e.target.value;
    setSelectedYear(year);

    if (currentMarkers!==null) {
      for (var i = currentMarkers.length - 1; i >= 0; i--) {
        currentMarkers[i].remove();
      }
    }

    riskDataApi(year).then((data) => {
      setRiskData(data);
    });
  }

  return (
    <div>
      <link href="https://api.mapbox.com/mapbox-gl-js/v2.14.1/mapbox-gl.css" rel="stylesheet"/>    
      <script src="https://api.mapbox.com/mapbox-gl-js/v2.14.1/mapbox-gl.js" async></script>
      <div className="text-center">
        <p style={{fontSize: '20px'}}>Map Stimulation of Climate Data</p>
      </div>
      <div style={{marginRight: '10px', marginBottom: '5px'}}>
        <label>Select the Year</label> &nbsp;
        <select
            name="Years"
            onChange={e => handleYearSelect(e)}
            value={selectedYear}
          >
            {years.map(year => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
        </select>
      </div>
      <div>
        <label style={{float:"left", marginRight: '5px'}}>Risk Rating: </label> &nbsp;
        <div style={{height:'20px',width:'50px',backgroundColor:'#7efc3f', float: "left"}}>
        <span>&#60;</span> 0.2
        </div> 
        <div style={{height:'20px',width:'50px',backgroundColor:'#fce33f', float: "left"}}>
        <span>&#60;</span> 0.4
        </div> 
        <div style={{height:'20px',width:'50px',backgroundColor:'#fc973f', float: "left"}}>
        <span>&#60;</span> 0.6
        </div> 
        <div style={{height:'20px',width:'50px',backgroundColor:'#b5470d', float: "left"}}>
        <span>&#60;</span> 0.8
        </div> 
        <div style={{height:'20px',width:'50px',backgroundColor:'#b50d0d', float: "left"}}>
        <span>&#62;</span> 0.8
        </div>       
      </div>
      <div ref={mapContainer} className="map-container" />
    </div>
  );
}