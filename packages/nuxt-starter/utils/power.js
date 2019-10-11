const powerList = ['9999', '1001', '1002', '1003', '1004', '2001', '2002', '2003', '2004', '3001', '3002', '4001', '4002']
const headquarters = ['1001', '1002', '1003', '1004'] // 总公司
const branchOffice = ['2001', '2002', '2003', '2004'] // 分公司
const middleBranchCompany = ['3001', '3002'] // 中支公司
const branchCompany = ['4001', '4002'] // 支公司

export function isHeadquarters (code) {
  return headquarters.includes(code)
}
export { powerList, branchOffice, middleBranchCompany, branchCompany }
