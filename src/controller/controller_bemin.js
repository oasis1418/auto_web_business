import driver from "../wdio_driver.js";
import getEl from "../wdio_findElement.js";


export async function beminUiController(businessNumber) {
  try {
    await driver.navigateTo("https://ceo.baemin.com/join/registration-check?returnUrl=https%3A%2F%2Fceo.baemin.com%2F");
    await driver.keys("\uE007"); 
    const bizNoEl = await getEl('//*[@name="bizNo"]');
    await bizNoEl[0].click();
    await bizNoEl[0].setValue(businessNumber);
    const bizConfirmBtnEl = await getEl('//label');
    await bizConfirmBtnEl[0].click();

    const bizFieldErrorEl = await driver.$$('//*[@class="help is-danger"]');

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
    console.log("[CONTROLLER] beminUiController Error : ", e);
  }
}



