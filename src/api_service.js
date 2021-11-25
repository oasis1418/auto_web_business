import axios from "axios";

export const getSpreadOrginData = async () => {
  try {
    let dataList = [];
    let res = await axios.get(
      `https://docs.google.com/spreadsheets/d/1Eh8DsiHD1Jwsdg-pPvoLSvxarVGeWCE3rr-YwND8TSo/gviz/tq?`
    );
    const resData = res.data;
    const resDataFilter = resData.slice(resData.indexOf("(") + 1, resData.indexOf("})") + 1);
    const resDataJson = JSON.parse(resDataFilter);
    const resRows = resDataJson.table.rows;
    const keys = resRows[0].c.map(data => data.v);
    for (let i = 1; i < resRows.length; i++) {
      const values = resRows[i].c;
      const data = {};
      for (let j = 0; j < keys.length; j++) {
        const key = keys[j];
        const value = values[j] === null ? null : values[j].v;
        data[key] = value;
      }
      dataList.push(data);
    }
    return dataList;
  } catch (e) {
    console.log("[API] getSpreadOrginData Error : ", e);
  }
};
export const sendSpread = async paramList => {
  try {
    let res = await axios.post(
      `https://script.google.com/macros/s/AKfycbwQf6ZLAJnYWBzDsFjvhfGedLckwEWx0IP8Ty4ukyqDfISlJ4OdDxW0qkYM-NoERjLB/exec`,
      paramList
    );
  } catch (e) {
    console.log("[API] sendSpread Error : ", e);
  }
};
