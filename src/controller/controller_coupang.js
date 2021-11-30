import driver from "../wdio_driver.js";
import getEl from "../wdio_findElement.js";

export async function coupangUiController(businessNumber) {
  try {
    let returnText;
    await driver.navigateTo("https://store.coupangeats.com/merchant/signup/step2");
    // await driver.switchToFrame(1);
    // await driver.switchToFrame('//*[@id="merchant-signup"]/div/div/ul/li[3]/div/div/div/iframe');
    // const searchInput = await driver.$$('//*[@class="recaptcha-checkbox-border"]');
    // await searchInput[0].click();

    // page check
    const pageCheckEl = await getEl('//*[@id="coupangEatsServiceAgree"]');
    if (pageCheckEl.length < 1) {
      console.log("=================Not Found Coupang Page====================")
      process.exit();
    }
    const bizNoEl = await getEl('//*[@id="bizNo"]');
    await bizNoEl[0].click();
    await driver.pause(1000);
    await bizNoEl[0].setValue(businessNumber);
    await driver.pause(1000);

    const loginIdEl = await getEl('//*[@id="loginId"]');
    await loginIdEl[0].click();
    await driver.pause(2000);

    // const bizConfirmBtnEl = await getEl('//*[@class="focus-placeholder "]');
    // await bizConfirmBtnEl[0].click();
    // await driver.pause(2000);
    const bizFieldErrorEl = await driver.$$('//*[@class="field-error "]');


    if (bizFieldErrorEl.length > 0) {
      const bizFieldTextEl = await bizFieldErrorEl[0].getText();
      return returnText = bizFieldTextEl;
    } else {
      return returnText = "미가입";
    }
  } catch (e) {
    console.log("[CONTROLLER] coupangUiController Error : ", e);
    process.exit();
  }
}
