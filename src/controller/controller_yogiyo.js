import driver from "../wdio_driver.js";
import getEl from "../wdio_findElement.js";

// const _sleep = delay => new Promise(resolve => setTimeout(resolve, delay));

export async function yogiyoUiController(businessNumber) {
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
    await driver.pause(500);
    const resultEl = await getEl('//*[@name="cn-message"]');
    const resultText = await resultEl[0].getText();
    return resultText;
  } catch (e) {
    console.log("[CONTROLLER] yogiyoUiController Error : ", e);
  }
}
