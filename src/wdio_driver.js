import wdio from "webdriverio";

const chromeCapability = {
  // runner: process.env.SELENIUM_HUB_IP, // currently only "local" is supported
  // port: parseInt(process.env.SELENIUM_CHROME_PORT as string),
  // path: '/wd/hub',
  capabilities: {
    browserName: "chrome",
    acceptInsecureCerts: true,
    "goog:chromeOptions": {
      args: [
        "--disable-dev-shm-usage",
        "--no-sandbox",
        "--enable-automation",
        "--disable-gpu",
        // "--headless", // Do Not Show Web Window
        "--window-size=1920,1040" // Window Size
      ]
    }
  }
};

async function driverCapability() {
  try {
    const dc = chromeCapability;
    const driver = await wdio.remote(dc);
    return driver;
  } catch (e) {
    console.log("[DRIVER] driverCapability Error : ", e);
  }
}

const driver = await driverCapability();
export default driver;
