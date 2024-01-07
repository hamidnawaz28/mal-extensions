import Browser from 'webextension-polyfill';
import { MESSAGING, SCRAPING_STATUS } from '../common/constants';
import {
    addData,
    changeStatus,
    refreshPopupData
} from '../common/services';
import { asyncSleep, runTimeMessage, tabMesage, updateData } from '../common/browserMethods';

const refresh = async () => {
    refreshPopupData()
    runTimeMessage({ message: MESSAGING.INVOKE_PAGE_REFRESH })
}

class Entry {
    constructor() { }
    public run() {
        console.log('apollo data collector data script added');
        const self = this

        Browser.runtime.onMessage.addListener(async function (request: any) {
            const { message } = request
            console.log('------------', request);

            if (message == MESSAGING.START_DATA_COLLECTION) {

                const { totalRows, totalPages } = self.getTotalPages()
                await updateData({ totalPages, status: SCRAPING_STATUS.COLLECTING, totalRows })
                for (let page = 0; page <= totalPages; page++) {
                    await updateData({ currentPage: page + 1 })
                    await refresh()
                    const dataRowsRefs = Array.from(document.querySelectorAll(".finder-results-list-panel-content tbody tr[data-cy='SelectableTableRow']")) as HTMLElement[]
                    const dataIndex = self.dataIndexs()
                    for (const row of dataRowsRefs) {
                        await self.processInformation(row, dataIndex)
                        await refresh()
                    }
                    const nextButton = self.nextButton()
                    if (nextButton.disabled) break
                    nextButton.click()
                    await asyncSleep(10)
                }
                await changeStatus(SCRAPING_STATUS.IDLE)
                await refresh()
            }
        })
    }

    private async processInformation(row: HTMLElement, dataIndex: any) {
        const dataCellsRef = row.querySelectorAll('td')
        const emailActions = dataCellsRef[dataIndex.email]
        await this.clickEmailButton(emailActions)

        const phone = await this.getPhoneNumber(row)

        const getText = (index: number) => {
            return dataCellsRef?.[index]?.innerText
        }

        const dataItem = {
            name: getText(dataIndex.name),
            title: getText(dataIndex.title),
            company: getText(dataIndex.company),
            email: getText(dataIndex.email),
            phone,
            contactLocation: getText(dataIndex.contactLocation),
            employees: getText(dataIndex.employees),
            industry: getText(dataIndex.industry),
            keywords: getText(dataIndex.keywords),
        }
        await addData(dataItem)
    }

    private findDataIndex(headerName: string) {
        const headersRef = Array.from(document.querySelectorAll(".finder-results-list-panel-content thead tr th")) as HTMLElement[]
        return headersRef.map((el: HTMLElement) => el.innerText).findIndex(el => el == headerName)
    }

    private dataIndexs(): any {
        return {
            name: this.findDataIndex('Name'),
            title: this.findDataIndex('Title'),
            company: this.findDataIndex('Company'),
            quickActions: this.findDataIndex('Quick Actions'),
            contactLocation: this.findDataIndex('Contact Location'),
            employees: this.findDataIndex('# Employees'),
            email: this.findDataIndex('Email'),
            industry: this.findDataIndex('Industry'),
            keywords: this.findDataIndex('Keywords'),
        }
    }

    private nextButton() {
        const isRightArrowDisabledRef: any = document.querySelector('[aria-label="right-arrow"]') as HTMLButtonElement
        return isRightArrowDisabledRef
    }

    private isLoading(rowRef: HTMLElement) {
        const loadingButton = rowRef.querySelector(".apollo-icon-rotate-right") as HTMLButtonElement
        return !!loadingButton
    }

    private async clickEmailButton(cell: HTMLElement) {
        // const emailActionbutton = cell.querySelector("[id*='contactFinderActions'] button") as HTMLElement
        const emailActionbutton = cell.querySelector(".apollo-icon-cloud-download ") as HTMLElement
        emailActionbutton?.click()
        await asyncSleep(5)
    }

    private async getPhoneNumber(row: HTMLElement) {
        const phoneIconRef = row.querySelector("[id*='contactFinderActions'] .apollo-icon-phone") as HTMLElement
        phoneIconRef?.parentElement?.click()
        await asyncSleep(2)
        const allButtonsRef = Array.from(document.querySelectorAll('[data-elem="button-label"]')) as HTMLElement[]
        const showHqButton = allButtonsRef.find(el => el.innerText?.toLowerCase()?.includes('show hq number')) as HTMLElement
        showHqButton?.click()
        await asyncSleep(1)
        const allNumberButtonsRef = Array.from(document.querySelectorAll('span')) as HTMLElement[]
        const numberButtonRef = allNumberButtonsRef.find(el => el.innerText.toLowerCase().includes('hq number')) as HTMLElement
        const numberRef = numberButtonRef?.parentElement?.querySelector('div') as HTMLElement
        const number = numberRef?.innerText?.replace('\nCall HQ', '') ?? ''
        phoneIconRef?.parentElement?.click()
        return number
    }

    private getTotalPages() {
        const rightArrowRef = document.querySelector('[aria-label="right-arrow"]') as HTMLElement
        const totalItemsRef = rightArrowRef?.parentElement?.parentElement?.querySelector('div>span') as HTMLElement
        let itemsRef = totalItemsRef.innerText.split(' of ')[1].replace(/[,]/g, '')
        let totalItems: any = Number(itemsRef)
        const pagesFloat = String(totalItems / 25)
        let pages = parseInt(pagesFloat)

        if (totalItems % 25 != 0) pages = pages + 1
        return { totalRows: totalItems, totalPages: pages }
    }
}

const entry = new Entry()
entry.run()