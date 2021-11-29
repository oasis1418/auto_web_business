import driver from "../wdio_driver.js";
import getEl from "../wdio_findElement.js";

export async function coupangUiController(businessNumber) {
  try {
    await driver.navigateTo("https://store.coupangeats.com/merchant/signup/step2");
    // await driver.switchToFrame(1);
    // await driver.switchToFrame('//*[@id="merchant-signup"]/div/div/ul/li[3]/div/div/div/iframe');
    // const searchInput = await driver.$$('//*[@class="recaptcha-checkbox-border"]');
    // await searchInput[0].click();

    const bizNoEl = await getEl('//*[@id="bizNo"]');
    await bizNoEl[0].click();
    await bizNoEl[0].setValue(businessNumber);
    const bizConfirmBtnEl = await getEl('//*[@class="focus-placeholder "]');
    await bizConfirmBtnEl[0].click();
    await driver.pause(500);
    const bizFieldErrorEl = await driver.$$('//*[@class="field-error "]');

    // const bizFieldErrorEl = await getEl('//*[@class="field-error "]');
    if (bizFieldErrorEl.length > 0) {
      const bizFieldTextEl = await bizFieldErrorEl[0].getText();
      if (bizFieldTextEl.includes("사업자등록번호")) {
        return false;
      } else {
        return true;
      }
    } else {
      return true;
    }
  } catch (e) {
    console.log("[CONTROLLER] coupangUiController Error : ", e);
  }
}
