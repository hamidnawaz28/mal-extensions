import '../../base.css'

import Browser from 'webextension-polyfill'
import { MESSAGING } from '../common/constants'
import { asyncSleep } from '../common/utils'

const enterText = (ref: any, text: string) => {
  ref.focus()
  document.execCommand('insertText', false, text)
}

const fillRefField = (selector: string, value: string) => {
  const element = document?.querySelector(selector)
  enterText(element, value)
}

export const findElementWithText = (selector: string, text: string) =>
  Array.from(document.querySelectorAll(selector)).find(
    (el: any) => el.innerText == text,
  ) as HTMLElement

const genderOptions = ["Chưa có thông tin", "Nam", "Nữ", "Khác"]
const identifyTypes = ['CMND', 'Hộ chiếu', 'Thẻ CCCD', 'Giấy tờ khác']

const renderBidButton = async () => {
  Browser.runtime.onMessage.addListener(async (request: any) => {
    const { message, data } = request
    try {
      if (message == MESSAGING.ENTER_DATA) {
        for (const item of data) {
          console.log(item, '---SD-item---');
          const fullName = item["Họ tên"]
          fillRefField("#fullName", fullName)
          await asyncSleep(0.6)

          // const gender = item["Giới tính"]
          // const genderRef = document.querySelector("#gender") as HTMLElement
          // enterText(genderRef, gender)
          // await asyncSleep(1)
          // const genderMatchRef = document.querySelector("#gender_list")?.parentElement?.querySelector(".rc-virtual-list .rc-virtual-list-holder-inner>div:nth-child(1)") as HTMLElement
          // genderMatchRef?.click()
          // await asyncSleep(0.6)
          const gender = item["Giới tính"].trim()
          const genderMatchRef = document.querySelector(`#gender_list`)?.parentElement?.querySelector(`div[title='${gender}']`) as HTMLElement
          genderMatchRef?.click()
          await asyncSleep(1)


          const birthDate = item["Ngày sinh"]
          fillRefField("#birthDate", birthDate)
          await asyncSleep(1)
          let selectedDateRef = document.querySelector(".react-datepicker__day--selected") as HTMLElement
          selectedDateRef?.click()
          await asyncSleep(0.6)

          const identifyType = item["\nLoại giấy tờ"]
          const identifyTypeRef = document.querySelector("#identifyType") as HTMLElement
          enterText(identifyTypeRef, identifyType)
          await asyncSleep(1)
          const identifyTypeMatchRef = document.querySelector("#identifyType_list")?.parentElement?.querySelector(".rc-virtual-list .rc-virtual-list-holder-inner>div:nth-child(1)") as HTMLElement
          identifyTypeMatchRef?.click()
          await asyncSleep(0.6)

          const identifyNo = item["Số giấy tờ"]
          fillRefField("#identifyNo", identifyNo)
          await asyncSleep(0.6)

          const nationalId = item["Quốc tịch"]
          const nationalIdRef = document.querySelector("#nationalId") as HTMLElement
          enterText(nationalIdRef, nationalId)
          await asyncSleep(1)
          const nationalIdMatchRef = document.querySelector("#nationalId_list")?.parentElement?.querySelector(".rc-virtual-list .rc-virtual-list-holder-inner>div:nth-child(1)") as HTMLElement
          nationalIdMatchRef?.click()
          await asyncSleep(1)

          const countryId = item["Quốc gia"]
          const countryIdRef = document.querySelector("#countryId") as HTMLElement
          enterText(countryIdRef, countryId)
          await asyncSleep(2)
          const countrySelector = `div[title='${countryId}']`
          const countryRef = document.querySelector("#countryId_list")?.parentElement?.querySelector(countrySelector) as HTMLElement
          countryRef?.click()
          await asyncSleep(2)
          // const countryIdRef = document.querySelector("#countryId") as HTMLElement
          // enterText(countryIdRef, countryId)
          // await asyncSleep(1)
          // const countryIdMatchRef = document.querySelector("#countryId_list")?.parentElement?.querySelector(".rc-virtual-list .rc-virtual-list-holder-inner>div:nth-child(1)") as HTMLElement
          // countryIdMatchRef?.click()
          // await asyncSleep(0.6)

          const registrationAddress = item["\nĐịa chỉ"]
          fillRefField("#registrationAddress", registrationAddress)
          await asyncSleep(0.6)

          // const checkIn = item["Lưu trú từ ngày"]
          // fillRefField("#checkIn", checkIn)
          // await asyncSleep(0.6)

          const checkOut = item["Lưu trú đến ngày"]
          fillRefField("#checkOut", checkOut)
          await asyncSleep(1)
          selectedDateRef = document.querySelector(".react-datepicker__day--keyboard-selected") as HTMLElement
          selectedDateRef?.click()
          await asyncSleep(0.5)

          const roomId = item["Phòng"]
          const roomIdRef = document.querySelector("#roomId") as HTMLElement
          enterText(roomIdRef, roomId)
          await asyncSleep(1)
          const roomIdMatchRef = document.querySelector("#roomId_list")?.parentElement?.querySelector(".rc-virtual-list .rc-virtual-list-holder-inner>div:nth-child(1)") as HTMLElement
          roomIdMatchRef?.click()
          await asyncSleep(0.6)

          // const reasonStayIdRef = document.querySelector("#reasonStayId") as HTMLElement
          // enterText(reasonStayIdRef, reasonStayId)
          // await asyncSleep(1)
          // const reasonStayIdMatchRef = document.querySelector("#reasonStayId_list")?.parentElement?.querySelector(".rc-virtual-list .rc-virtual-list-holder-inner>div:nth-child(1)") as HTMLElement
          // reasonStayIdMatchRef?.click()
          // await asyncSleep(0.6)
          const reasonStayId = "Du lịch"
          const reasonStayIdMatchRef = document.querySelector("#reasonStayId_list")?.parentElement?.querySelector(`div[title='${reasonStayId}']`) as HTMLElement
          reasonStayIdMatchRef.click()

          fillRefField("#note", reasonStayId)
          const buttonsRef = Array.from(document.querySelectorAll(".ant-row.ant-row-end.mt-2 button")) as HTMLElement[]
          buttonsRef?.[0]?.click()
          await asyncSleep(5)
          buttonsRef?.[3]?.click()
          await asyncSleep(2)
        }
      }
    } catch (err: any) {
      console.log(err, '--------------', data);
    }

  })
}

renderBidButton()
// 12/13/2023 12:00:00 AM