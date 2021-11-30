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
    let coupang;
    let yogiyo;
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
          coupang = await coupangUiController(resBusinessData.businessNumber);
          if (coupang.includes("미가입")) {
            resBusinessData.coupang = "미가입";
          }
          if (coupang.includes("정확히")) {
            resBusinessData.coupang = coupang;
          }
        }
        // yogiyo
        if (selectCaseNo == 0 || selectCaseNo == 2) {
          yogiyo = await yogiyoUiController(resBusinessData.businessNumber);
          if (yogiyo.includes("가능")) {
            resBusinessData.yogiyo = "미가입";
          }
        }
        // bemin
        if (selectCaseNo == 0 || selectCaseNo == 3) {
          
        }
        // send spreadsheet
        console.log(`company : ${resBusinessData.company}  =========================================`)
        console.log(`condition coupang : ${coupang}`)
        console.log(`condition yogiyo  : ${yogiyo}`)
        console.log(`[SEND BEFORE] : ${resBusinessData.coupang}, `, resBusinessData.yogiyo);
        if (resBusinessData.coupang || resBusinessData.yogiyo) {
          console.log(`[SEND] =========================================`)
          console.log(`[SEND AFTER] : ${resBusinessData.coupang}, `, resBusinessData.yogiyo);
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
