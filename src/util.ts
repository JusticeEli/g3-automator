import { showConfirmationDialogAndWaitForAnswer } from "./ConfirmationDialog"

export const injectSetListenerForGlobalElements = async () => {


    await setListenersForGlobalElements(

        () => {


            setClickListenerForCustomerMsisdn()
            setClickListenerForReverseButton()


        }
    )
}
const setListenersForGlobalElements = (callBack: () => void) => {
    return new Promise<Element>(() => {
        const observer = new MutationObserver(() => {
            callBack()
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });


    }

    )
}
const setClickListenerForReverseButton = async () => {
    console.log("setClickListenerForReverseButton");
    const selector = 'button'
    const reverseButton = await waitForElementToAppearWithTextContentForever(selector, "Reverse") as HTMLButtonElement
    reverseButton.onclick = () => {
        reverseButtonClicked()
    }

}
const reverseButtonClicked = async () => {
    console.log("reverseButtonClicked");
    const title = await clickMoneyRecipient()

    const topOrgName = await getTopOrganizationName(title)

    const orgName = await getOrganizationName()

    closeActiveTab()

    const message =
        `
    Top Organization: ${topOrgName}

    Organization: ${orgName}
    `
    console.log("message");
    console.log(message);
    // await waitForDOMToSettle()

    await showConfirmationDialogAndWaitForAnswer(message)
}
const setClickListenerForCustomerMsisdn = async () => {
    console.log("setClickListenerForCustomerMsisdn");

    //wait for search input
    const selector = 'input[placeholder="Please enter"][class="el-input__inner"]'
    await waitForElementToAppearForever(selector)
    console.log("input found");

    const customerMsisdnInput = document.querySelector(selector) as HTMLInputElement;
    customerMsisdnInput.onclick = async () => {
        customerMsisdnInput.value = "%"
        customerMsisdnInput.value += await getContentInClipBoard()
        customerMsisdnInput.dispatchEvent(new Event("input", { bubbles: true }))

        await clickSearchButton()

        //wait for table records to change
        await waitForTableToChange()

        //wait for details record

        const detailsButtonSelector = 'button[class="el-button el-button--primary is-link operation-button"]'
        await waitForElementToAppearForever(detailsButtonSelector)

        const detailsButton = document.querySelector(detailsButtonSelector) as HTMLButtonElement
        detailsButton.click()


        await clickReviewTransaction()
        await clickTransactionsTab()
        await fillRelatedAccount()


    }


}
const fillRelatedAccount = async () => {
    console.log("fillRelatedAccount");

    const relatedAccountParentDiv = await waitForElementToAppearWithTextContent('div[class="el-form-item is-required asterisk-left el-form-item--label-top el-tooltip__trigger"]', "Related AccountPlease select")

    const relatedAccountChildDiv = await waitForElementToAppearWithTextContent('div.el-select__selected-item.el-select__placeholder', "Please select", relatedAccountParentDiv)

    const span = relatedAccountChildDiv.querySelector('span') as HTMLSpanElement
    span.click()

    //click all from dropdown
    const allItem = await waitForElementToAppearWithTextContent('li[class="el-select-dropdown__item"][ role="option"]', "All") as HTMLLIElement
    allItem?.click()



    await clickSearchButton()

}
const clickTransactionsTab = async () => {
    console.log("waitForUserOverViewScreenToAppear");

    const selector = 'div[class="el-tabs__item is-top"][ id="tab-transactions"][ aria-controls="pane-transactions"][ role="tab"]'
    const textContent = "Transactions"


    const div = await waitForElementToAppearWithTextContent(selector, textContent) as HTMLDivElement
    div.click()




}
const clickReviewTransaction = async () => {
    console.log("waitForUserOverViewScreenToAppear");

    const selector = 'span[class="number-title el-tooltip__trigger el-tooltip__trigger"]'
    const textContent = "Review Transaction"


    const span = await waitForElementToAppearWithTextContent(selector, textContent) as HTMLSpanElement
    span.click()
}

export const test = async () => {





}
const closeActiveTab = () => {
    console.log("closeActiveTab..............");


    const activeTab = document.querySelector(
        ".tags-view-item.active"
    ) as HTMLDivElement
    const closeSpan = activeTab.querySelector('span[class="close-icon"]') as HTMLSpanElement
    const closeLink = closeSpan.querySelector("i") as HTMLLIElement
    closeLink.click()

}
const getTopOrganizationName = async (title: string) => {
    console.log("getTopOrganizationName");
    const shortCode = title.split("-")[0].trim()
    console.log("shortcode:"+shortCode);
    
    await waitForElementToAppearWithTextContentForever('div',shortCode)
    const topOrgLabelDiv = await waitForElementWithDivTextContentToAppear("Top Organization Name") as HTMLDivElement


    const parent = topOrgLabelDiv.parentElement as HTMLDivElement
    const topOrgDiv = parent.querySelectorAll("div")[1]
    console.log("org name: " + topOrgDiv.textContent);
    return topOrgDiv.textContent


}
const getOrganizationName = async () => {
    console.log("getOrganizationName");
    const topOrgLabelDiv = await waitForElementWithDivTextContentToAppear("Organization Name") as HTMLDivElement
    const parent = topOrgLabelDiv.parentElement as HTMLDivElement
    const topOrgDiv = parent.querySelectorAll("div")[1]
    const orgSpan = topOrgDiv.querySelector("span")!
    console.log("org name: " + orgSpan.textContent);
    return orgSpan.textContent


}
const clickMoneyRecipient = async () => {
    console.log("clickMoneyRecipient");
    const accountEntriesDiv = (await waitForElementWithDivTextContentToAppear(" Account Entries") as HTMLDivElement).parentElement as HTMLDivElement
    const entriesTable = accountEntriesDiv.querySelectorAll("table")[1]

    const recipientRow = entriesTable.querySelectorAll("tr")[1] as HTMLTableRowElement

    const recipientTableData = recipientRow.querySelectorAll("td")[1] as HTMLTableCellElement
    console.log("data: " + recipientTableData.textContent);

    const recipientSpan = recipientTableData.querySelector("span")!

    recipientSpan.click()

    return recipientTableData.textContent!


}
export const getOfficePhoneNumber = async () => {
    console.log("getOfficePhoneNumber");

    const officePhoneNumberTitleDiv = await waitForElementWithDivTextContentToAppear("Office Phone Number") as HTMLDivElement
    const officePhoneNumberDiv = officePhoneNumberTitleDiv.nextElementSibling! as HTMLDivElement
    console.log("phone number: " + officePhoneNumberDiv.textContent);

    return officePhoneNumberDiv.textContent


}
export const getPayBillName = async () => {
    console.log("getPayBillName");

    const selector = 'div[class="page-title"]'
    const payBillNameDiv = await waitForElementToAppearForever(selector) as HTMLDivElement


    const payBillName = payBillNameDiv.textContent!.split("-")[1].replace("Details", "")

    console.log("paybill: " + payBillName);
    return payBillName

}
const addMerchantReversalInteraction = async () => {
    console.log("addMerchantReversalInteraction");
    chrome.runtime.sendMessage({
        type: "ADD_MERCHANT_REVERSAL_INTERACTION"
    });

}

const waitForTableToChange = (): Promise<void> => {
    return new Promise((resolve) => {
        const tbody = document.querySelector(".el-table__body tbody")!;


        const observer = new MutationObserver(() => {
            console.log("tbody changed ✅");
            observer.disconnect();
            resolve();
        });

        observer.observe(tbody, {
            childList: true,  // watch for added/removed rows
            subtree: true,    // watch all descendants
            attributes: true, // watch attribute changes
            characterData: true // watch text changes
        });
    });
};


const clickSearchButton = async () => {
    console.log("clickSearchButton");
    const searchButton = await waitForElementToAppearWithTextContent('button[class="el-button el-button--primary form-btn-margin-left-8"]', "Search") as HTMLButtonElement

    searchButton.click()
}


const getContentInClipBoard = async () => {
    console.log("getContentInClipBoard");
    return navigator.clipboard.readText()

}

export const waitForElementToAppearForever = (selector: string) => {
    return new Promise<Element>((resolve, reject) => {

        const element = document.querySelector(selector);
        if (element) {
            return resolve(element); // already exists
        }

        const observer = new MutationObserver(() => {
            const el = document.querySelector(selector);
            if (el) {
                observer.disconnect();
                resolve(el);
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

    }

    )
}


export const waitForElementToAppearWithTextContent = (selector: string, textContent: string, parent: Element = document.body, timeout = 5_000) => {
    return new Promise<Element>((resolve, reject) => {
        const element = Array.from(parent.querySelectorAll(selector)).find(s => s.textContent!.trim() == textContent)

        if (element) {
            return resolve(element); // already exists
        }

        const observer = new MutationObserver(() => {
            const el = Array.from(parent.querySelectorAll(selector)).find(s => s.textContent!.trim() == textContent)
            if (el) {
                observer.disconnect();
                resolve(el);
            }
        });

        observer.observe(parent, {
            childList: true,
            subtree: true
        });

        // Optional: timeout safety
        setTimeout(() => {
            observer.disconnect();
            reject("Element not found within timeout");
        }, timeout);
    }

    )
}
export const waitForElementToAppearWithTextContentForever = (selector: string, textContent: string, parent: Element = document.body) => {
    return new Promise<Element>((resolve, reject) => {
        const element = Array.from(parent.querySelectorAll(selector)).find(s => s.textContent!.trim() == textContent)

        if (element) {
            return resolve(element); // already exists
        }

        const observer = new MutationObserver(() => {
            const el = Array.from(parent.querySelectorAll(selector)).find(s => s.textContent!.trim() == textContent)
            if (el) {
                observer.disconnect();
                resolve(el);
            }
        });

        observer.observe(parent, {
            childList: true,
            subtree: true
        });

    }

    )
}

export const waitForElementWithDivTextContentToAppear = (textContent: string, timeout = 120_000) => {
    return new Promise<Element>((resolve, reject) => {

        const element = Array.from(document.querySelectorAll("div")).find(e => e.textContent == textContent)

        if (element) {
            console.log("found:first try " + element.textContent);

            return resolve(element); // already exists
        }

        const observer = new MutationObserver(() => {
            const el = Array.from(document.querySelectorAll("div")).find(e => e.textContent == textContent)
            if (el) {
                console.log("found: " + el.textContent);

                observer.disconnect();
                resolve(el);
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        // Optional: timeout safety
        setTimeout(() => {
            observer.disconnect();
            reject("Element not found within timeout");
        }, timeout);
    }

    )
}

const waitForDOMToSettle = (timeout = 50): Promise<void> => {
    return new Promise((resolve) => {
        let timer: ReturnType<typeof setTimeout>;

        const observer = new MutationObserver(() => {
            // reset timer every time DOM changes
            clearTimeout(timer);

            // resolve when DOM has been stable for 500ms
            timer = setTimeout(() => {
                observer.disconnect();
                console.log("DOM settled ✅");
                resolve();
            }, timeout);
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true,
            characterData: true
        });

        // safety timeout
        setTimeout(() => {
            observer.disconnect();
            resolve();
        }, 10000);
    });
};