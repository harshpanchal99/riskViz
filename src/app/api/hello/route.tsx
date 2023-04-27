import { NextRequest,NextResponse } from "next/server";
import * as XLSX from "xlsx";

export async function POST(req: NextRequest, res: NextResponse) {
  const body = await req.json();
  const filename = 'public/UI_UXDeveloperWorkSampleData.xlsx';
  // Getting data from the excel file
  const dt = XLSX.readFile(filename, {});
  const first_worksheet = dt.Sheets[dt.SheetNames[0]];
  const data = XLSX.utils.sheet_to_json(first_worksheet, { header: 1 });
  data.shift();
  const jsonObject = data.map((obj) => {
    const digit = Math.random(); 
    return {
      assetName: obj[0],
       // Added a little variance as communicated with Leo Li to the latitude and longitude as dataset was having same values
      latitude: obj[1] + digit,
      longitude: obj[2] - digit,
      businessCat: obj[3],
      riskRating: obj[4],
      riskFactor: obj[5],
      year: obj[6]
    }
  })
  const filterData = jsonObject.filter(obj => {
     return obj.year == body.year
  }) 
  return NextResponse.json(filterData);
}

export async function GET(req: NextRequest, res: NextResponse) {
  const filename = 'public/UI_UXDeveloperWorkSampleData.xlsx';
  // Getting data from the excel file
  const dt = XLSX.readFile(filename, {});
  const first_worksheet = dt.Sheets[dt.SheetNames[0]];
  const data = XLSX.utils.sheet_to_json(first_worksheet, { header: 1 });
  data.shift();
  const jsonObject = data.map((obj) => {
    return {
      assetName: obj[0],
      latitude: obj[1],
      longitude: obj[2],
      businessCat: obj[3],
      riskRating: obj[4],
      riskFactor: obj[5],
      year: obj[6]
    }
  })
 
  return NextResponse.json(jsonObject);
}