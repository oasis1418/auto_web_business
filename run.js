import driver from "./src/wdio_driver.js";
import getEl from "./src/wdio_findElement.js";
import { getSpreadOrginData, sendSpread } from "./src/api_service.js";

const _sleep = delay => new Promise(resolve => setTimeout(resolve, delay));

async function coupangUiController() {
  try {
    await driver.navigateTo("https://store.coupangeats.com/merchant/signup/step2");
    await _sleep(5000);

    await driver.switchToFrame(1);

    // await driver.switchToFrame('//*[@id="merchant-signup"]/div/div/ul/li[3]/div/div/div/iframe');

    const searchInput = await driver.$$('//*[@class="recaptcha-checkbox-border"]');

    //   const searchInput = await driver.$('//*[@id="recaptcha-anchor-label"]');
    console.log(searchInput.length);
    await _sleep(5000);
    await searchInput[0];
    await searchInput[0].click();
  } catch (e) {
    console.log("[CONTROLLER] coupangUiController Error : ", e);
  }
}

async function yogiyoUiController(businessNumber) {
  try {
    const firstBizNumber = businessNumber.slice(0, 3);
    const secondBizNumber = businessNumber.slice(4, 6);
    const thirdBizNumber = businessNumber.slice(7, 12);

    await driver.navigateTo("https://owner.yogiyo.co.kr/owner/join/request/");
    const inputEl1 = await getEl('//*[@name="cn1"]');
    await inputEl1[0].click();
    await inputEl1[0].setValue(firstBizNumber);
    const inputEl2 = await getEl('//*[@name="cn2"]');
    await inputEl2[0].click();
    await inputEl2[0].setValue(secondBizNumber);
    const inputEl3 = await getEl('//*[@name="cn3"]');
    await inputEl3[0].click();
    await inputEl3[0].setValue(thirdBizNumber);

    const searchBtn = await getEl('//*[@name="check_duplicate_button"]');
    await searchBtn[0].click();
    await _sleep(500);
    const resultEl = await getEl('//*[@name="cn-message"]');
    const resultText = await resultEl[0].getText();
    return resultText;
  } catch (e) {
    console.log("[CONTROLLER] yogiyoUiController Error : ", e);
  }
}

async function run() {
  try {
    let businessResDataList = await getSpreadOrginData();
    for (let i = 0; i < businessResDataList.length; i++) {
      let businessResData = businessResDataList[i];
      const yogiyo = await yogiyoUiController(businessResData.businessNumber);
      if (yogiyo.includes("가능")) {
        const mapAddress = "https://map.naver.com/v5/search/" + businessResData.company;
        businessResData.SHEET = "business_data";
        businessResData.yogiyo = "미가입";
        businessResData.naver_map = `=HYPERLINK("${mapAddress}","지도검색(${businessResData.company})")`;
        sendSpread(businessResData);
      }
    }
    process.exit();
  } catch (e) {
    console.log("[RUN] Run Error : ", e);
  }
}

run();
