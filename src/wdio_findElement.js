import driver from "./wdio_driver.js";

const getEl = async xpath => {
  try {
    let elements;
    await driver.waitUntil(
      async () => {
        elements = await driver.$$(xpath);
        return elements.length > 0;
      },
      {
        timeout: 5000,
        timeoutMsg: `엘리먼트 찾기 시간 초과 :  5000}ms`
      }
    );
    if (elements.length > 0) {
      return elements;
    }
  } catch (error) {
    throw new Error(`엘리먼트 찾기 실패 : ${error}`);
  }
};

export default getEl;
