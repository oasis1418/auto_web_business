export async function filterCompany(filterCompanyList, company) {
    try {
        console.log(JSON.stringify(filterCompanyList));
        for (let i = 0; i < filterCompanyList.length; i++) {
            const filterCompany = filterCompanyList[i].filterText;
            console.log(company, filterCompany);
            if (company.includes(filterCompany)) {
                return true;
            }
        }
        return false;
    } catch (e) {
      console.log("[DRIVER] filterCompany Error : ", e);
    }
}