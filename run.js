import driver from "./src/wdio_driver.js";

import { filterCompany } from "./src/common_util.js"
import { getSpreadOrginData, sendSpread } from "./src/api/api_service.js";
import { yogiyoUiController} from "./src/controller/controller_yogiyo.js";
import { coupangUiController} from "./src/controller/controller_coupang.js";
const filterUrl = `https://docs.google.com/spreadsheets/d/1Eh8DsiHD1Jwsdg-pPvoLSvxarVGeWCE3rr-YwND8TSo/gviz/tq?gid=956052489`;
/**
 * arg (0:all, 1:coupang, 2:yogiyo, 3:bemin)
 */
async function run() {
  try {
    // [get] arguments
    console.log('arguments: ' + process.argv.slice(2));
    const selectCaseNo = process.argv.slice(2);
    if (selectCaseNo == 0 || selectCaseNo == 1) {
      await driver.navigateTo("https://store.coupangeats.com/merchant/signup/step2");
      await driver.pause(30000);
    }
    // [get] spread sheet data
    console.log("filter url : ", filterUrl);
    let resFilterCompanyList = await getSpreadOrginData(filterUrl);
    console.log(resFilterCompanyList);
    let resBusinessDataList = await getSpreadOrginData(`https://docs.google.com/spreadsheets/d/1Eh8DsiHD1Jwsdg-pPvoLSvxarVGeWCE3rr-YwND8TSo/gviz/tq?gid=1851256648`);
    for (let i = 0; i < resBusinessDataList.length; i++) {
      let resBusinessData = resBusinessDataList[i];
      if (await filterCompany(resFilterCompanyList, resBusinessData.company)) {
        
      } else {
        // coupang
        if (selectCaseNo == 0 || selectCaseNo == 1) {
          const coupang = await coupangUiController(resBusinessData.businessNumber);
          console.log(`coupang value YN : ${coupang}`)
          if (coupang) {
            resBusinessData.coupang = "미가입";
          }
        }
        // yogiyo
        if (selectCaseNo == 0 || selectCaseNo == 2) {
          const yogiyo = await yogiyoUiController(resBusinessData.businessNumber);
          console.log(`yogiyo value YN : ${yogiyo}`)
          if (yogiyo.includes("가능")) {
            resBusinessData.yogiyo = "미가입";
          }
        }
        // bemin
        if (selectCaseNo == 0 || selectCaseNo == 3) {
          
        }
        // send spreadsheet
        console.log(`get ui data : ${resBusinessData.coupang}, `, resBusinessData.yogiyo);
        if (resBusinessData.coupang || resBusinessData.yogiyo) {
          console.log(`if get ui data : ${resBusinessData.coupang}, `, resBusinessData.yogiyo);
          const mapAddress = "https://map.naver.com/v5/search/" + resBusinessData.company;
          resBusinessData.SHEET = "business_data";
          resBusinessData.naver_map = `=HYPERLINK("${mapAddress}","지도검색(${resBusinessData.company})")`;
          await sendSpread(resBusinessData);
        }      
      }
    }
    process.exit();
  } catch (e) {
    console.log("[RUN] Run Error : ", e);
  }
}

run();
