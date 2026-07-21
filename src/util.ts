import { initiateKopoKopoMerchantReversalJourney, specificItemClicked, writeContentToClipBoard } from "./CommonReversalsDialog"
import { showConfirmationDialogAndWaitForAnswer } from "./ConfirmationDialog"
import { waitForElementToAppear } from "./DiySmsFlow"
import { showMessageDialog } from "./MessageDialog"
import { clearCustomElements, createSendOfficeNumberButton, injectPaybillButton } from "./PaybillButton"
import { waitForElementWithParagraphTextContentToAppear } from "./util-crmsaf"

export const injectSetListenerForGlobalElements = async () => {


    await setListenersForGlobalElements(

        () => {

            // clearCustomElements()
            injectPaybillButton()
            setClickListenerForCustomerMsisdn()
            setClickListenerForQuickQueryCustomerMsisdn()
            setClickListenerForQuickQuerySearchTransaction()
            setClickListenerForReverseButton()
            setClickListenerForResetPinButton()
            setClickListenerForUnlockPinButton()


        }
    )
}
const setListenersForGlobalElements_2 = (callBack: () => void) => {
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


const setListenersForGlobalElements = (callback: () => void) => {
    let timeout: number;

    const observer = new MutationObserver(() => {
        clearTimeout(timeout);

        timeout = window.setTimeout(() => {
            callback();
        }, 500); // wait 500ms after mutations settle
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true,
    });

    return observer;
};

const setClickListenerForReverseButton = async () => {
    console.log("setClickListenerForReverseButton");
    const selector = 'button'
    const reverseButton = await waitForElementToAppearWithTextContentForever(selector, "Reverse") as HTMLButtonElement
    reverseButton.onclick = () => {
        reverseButtonClicked()
    }

}
const setClickListenerForResetPinButton = async () => {
    console.log("setClickListenerForResetPinButton");
    const selector = 'button'
    const resetPinButton = await waitForElementToAppearWithTextContentForever(selector, "Reset PIN") as HTMLButtonElement
    resetPinButton.onclick = () => {
        resetPinButtonClicked()
    }

}
const setClickListenerForUnlockPinButton = async () => {
    console.log("setClickListenerForUnlockPinButton");
    const selector = 'button'
    const resetPinButton = await waitForElementToAppearWithTextContentForever(selector, "Unlock PIN") as HTMLButtonElement
    resetPinButton.onclick = () => {
        unlockPinButtonClicked()

    }

}
export const getTransactionType = async () => {
    console.log("getTransactionType");
    const label = await waitForElementWithParagraphTextContentToAppear("Transaction Type") as HTMLParagraphElement

    const parent = label.parentElement!
    const dataElement = parent.querySelectorAll("p")[1]
    console.log("transaction type: " + dataElement.textContent);
    return dataElement.textContent!

}
const getReasonType = async () => {
    console.log("getReasonType");
    const label = await waitForElementWithParagraphTextContentToAppear("Reason Type ") as HTMLParagraphElement

    const parent = label.parentElement!
    const dataElement = parent.querySelectorAll("p")[1]
    console.log("reason type: " + dataElement.textContent);
    return dataElement.textContent!


}
const resetPinButtonClicked = async () => {
    console.log("resetPinButtonClicked");

    const placeHolderTextArea = await waitForElementToAppear('textarea[placeholder="Please enter"]') as HTMLTextAreaElement



    const submitButton = await waitForElementToAppearWithTextContent('button', "Submit") as HTMLButtonElement
    submitButton.onclick = async () => {

        const vettingDetails = placeHolderTextArea.value
        console.log("vettingDetails");
        console.log(vettingDetails);
        await writeContentToClipBoard(vettingDetails)


        addPinResetInteraction()
    }

}
const unlockPinButtonClicked = async () => {
    console.log("unlockPinButtonClicked");

    const placeHolderTextArea = await waitForElementToAppear('textarea[placeholder="Please enter"]') as HTMLTextAreaElement



    const submitButton = await waitForElementToAppearWithTextContent('button', "Submit") as HTMLButtonElement
    submitButton.onclick = async () => {

        const vettingDetails = placeHolderTextArea.value
        console.log("vettingDetails");
        console.log(vettingDetails);
        await writeContentToClipBoard(vettingDetails)


        addPinUnlockInteraction()
    }

}
const reverseButtonClicked = async () => {
    console.log("reverseButtonClicked");

    const transactionType = (await getTransactionType()).trim()
    console.log("transactionType: " + transactionType);
    const reasonType = (await getReasonType()).trim()
    console.log("reasonType: " + reasonType);

    switch (transactionType) {
        case "Customer Merchant Payment": {

            reverseForMerchant()
            break
        }
        case "Send Money": {
            reverseForSendMoney(reasonType)

            break
        }
        case "send": {


            break
        }
    }

}
const reverseForSendMoney = async (reasonType: string) => {
    console.log("reverseForSendMoney: reasonType: " + reasonType);

    const selector = '#submitProcessTransaction'
    const submitButton = await waitForElementToAppear(selector) as HTMLButtonElement


    if (reasonType.startsWith("Customer Transfer")) {
        submitButton.onclick = () => {
            submitForSendMoney()

        }

    } else if (reasonType.startsWith("Customer Send to Micro SME Business")) {
        submitButton.onclick = () => {
            submitForSendMoneyMicroSmeBusiness()
        }
    }




}


const submitForSendMoney = async () => {
    console.log("submitForSendMoney");


    const message =
        `
Do you want to add Interaction ?
`
    const yes = await showConfirmationDialogAndWaitForAnswer(message, "yes")
    if (yes) {
        await dismissDialogAndAddP2pReversalInteraction()
    }







}

const waitInsufficientFundsDialog = async () => {
    console.log("waitInsufficientFundsDialog");

    //click confirm dialog
    await dismissInsufficientFundsDialog()



}
const dismissDialogAndAddP2pReversalInteraction = async () => {
    console.log("waitApprovedByAnotherOperator");
    //click confirm dialog
    await dismissApprovedByAnotherOperatorDialog()

    await specificItemClicked("P2P REVERSAL")


}
const dismissDialogAndAddPochiReversalInteraction = async () => {
    //click confirm dialog
    await dismissApprovedByAnotherOperatorDialog()

    await specificItemClicked("POCHI REVERSAL")


}
const submitForSendMoneyMicroSmeBusiness = async () => {
    console.log("submitForSendMoney");

    const message =
        `
Do you want to add Interaction ?
`
    const yes = await showConfirmationDialogAndWaitForAnswer(message, "yes")
    if (yes) {
        await dismissDialogAndAddPochiReversalInteraction()
    }




}
const submitForMerchantPayment = async () => {
    console.log("submitForMerchantPayment");








    /////////
    const title = await clickMoneyRecipient()

    const topOrgName = (await getTopOrganizationName(title))!.trim()


    closeActiveTab()




    switch (topOrgName) {
        case "SFC-Lipa na Mpesa Business Till Head office 17": {
            reverseForMerchantSfc()
            break;
        }
        case "fe": {

            break;
        }
        default: {
            break
        }
    }



    //click confirm dialog
    await dismissApprovedByAnotherOperatorDialog()


    await specificItemClicked("P2P REVERSAL")




}
const dismissApprovedByAnotherOperatorDialog = async () => {
    console.log("dismissApprovedByAnotherOperatorDialog");

    await waitForElementToAppearWithTextContent('p', "The request must be approved by another operator.")
    const submitButton = await waitForElementToAppearWithTextContent('button', "Confirm") as HTMLButtonElement
    submitButton.click()
}
const dismissInsufficientFundsDialog = async () => {
    console.log("dismissInsufficientFundsDialog");

    await waitForElementToAppearWithTextContentIncludes('p', "insufficient")
    const submitButton = await waitForElementToAppearWithTextContent('button', "Confirm") as HTMLButtonElement
    submitButton.click()
}
const reverseForMerchant = async () => {
    console.log("reverseForMerchant");
    const title = await clickMoneyRecipient()

    const topOrgName = (await getTopOrganizationName(title))!.trim()

    const orgName = (await getOrganizationName())!.trim()




    closeActiveTab()



    const message =
        `
    -----Top Organization:--- 
    
    ${topOrgName}

    ----Organization:--- 

    ${orgName}
    `
    console.log("message");
    console.log(message);



    if (topOrgName.startsWith("SFC-Lipa na Mpesa Business Till Head office") || topOrgName.startsWith("SFC-Lipa na Mpesa Head office")) {
        reverseForMerchantSfc()

    } else if (topOrgName.startsWith("KOPO KOPO")) {
        reverseForMerchantKopoKopo()

    }
    else {

        if (isTillBankAggregated(topOrgName)) {
            reverseForMerchantBank(message, topOrgName)

        } else {

            await showMessageDialog(message)
        }

    }




}

const isTillBankAggregated = (topOrgName: string) => {


    const keywords = [
        "bank",
        "KCB",
        "MFB",

    ];

    if (keywords.some(keyword => topOrgName.toLowerCase().includes(keyword.toLowerCase()))) {
        return true
    } else {
        return false
    }

}
const reverseForMerchantBank = async (message: string, topOrgName: string) => {
    console.log("reverseForMerchantBank");

    const finalMessage =
        `${message}
    Do you want to raise SR for this bank reversal ?
    `
    const send = await showConfirmationDialogAndWaitForAnswer(finalMessage, "yes")
    if (send) {
        raiseSrForMerchantBankReversal()
    }



}
const raiseSrForMerchantBankReversal = () => {
    console.log("raiseSrForMerchantBankReversal");
    specificItemClicked("Bank Merchant REVERSAL")
}
const reverseForMerchantSfc = async () => {
    console.log("reverseForMerchantSfc");
    //set click listener for submit button
    const selector = '#submitProcessTransaction'
    const submitButton = await waitForElementToAppear(selector) as HTMLButtonElement
    submitButton.onclick = async () => {

        await submitForSfcMerchantReversal()
    }

}
const reverseForMerchantKopoKopo = async () => {
    console.log("reverseForMerchantSfc");
    //set click listener for submit button
    const selector = '#submitProcessTransaction'
    const submitButton = await waitForElementToAppear(selector) as HTMLButtonElement
    submitButton.onclick = async () => {

        await submitForKopoKopoMerchantReversal()
    }

}
const submitForSfcMerchantReversal = async () => {
    console.log("submitForSendMoney");


    const message =
        `
Do you want to add Interaction ?
`
    const yes = await showConfirmationDialogAndWaitForAnswer(message, "yes")
    if (yes) {
        await dismissDialogAndAddInteractionForSfcMerchantReversal()
    }

}
const submitForKopoKopoMerchantReversal = async () => {
    console.log("submitForKopoKopoMerchantReversal");


    const message =
        `
Do you want to add Interaction ?
`
    const yes = await showConfirmationDialogAndWaitForAnswer(message, "yes")
    if (yes) {
        await dismissDialogAndAddInteractionForKopoKopoMerchantReversal()
    }

}
const dismissDialogAndAddInteractionForSfcMerchantReversal = async () => {
    await dismissApprovedByAnotherOperatorDialog()
    await specificItemClicked("Sfc Merchant REVERSAL")
}
const dismissDialogAndAddInteractionForKopoKopoMerchantReversal = async () => {
    await dismissApprovedByAnotherOperatorDialog()
    await specificItemClicked("KOPO KOPO")
}
export const clickKycInfoTab = async () => {
    console.log("clickKycInfoTab");

    const kycTab = await waitForElementWithDivTextContentToAppear("KYC Info") as HTMLDivElement

    kycTab.click()


}
export const waitForCustomerMsisdnInput = async () => {
    console.log("waitForCustomerMsisdnInput");
    const msisdnLabel = await waitForElementToAppearWithTextContentForever("label", "MSISDN")
    const container = msisdnLabel.parentElement!
    const customerMsisdnInput = await waitForElementToAppearForever('input[placeholder="Please enter"][class="el-input__inner"]', container)
    return customerMsisdnInput as HTMLInputElement
}

const setClickListenerForCustomerMsisdn = async () => {
    console.log("setClickListenerForCustomerMsisdn");

    //wait for search input

    const customerMsisdnInput = await waitForCustomerMsisdnInput()
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



const setClickListenerForQuickQueryCustomerMsisdn = async () => {
    console.log("setClickListenerForQuickQueryCustomerMsisdn");

    //wait for search input
    const selector = 'input[placeholder="MSISDN, % is supported"][class="el-input__inner"]'
    await waitForElementToAppearForever(selector)
    console.log("input found");

    const customerMsisdnInput = document.querySelector(selector) as HTMLInputElement;
    customerMsisdnInput.onclick = async () => {
        customerMsisdnInput.value = "%"
        customerMsisdnInput.value += await getContentInClipBoard()
        customerMsisdnInput.dispatchEvent(new Event("input", { bubbles: true }))

        await clickQuickQuerySearchButton()



        //wait for details record


        const detailsButton = (await waitForElementToAppearWithTextContentIncludes('span', "Details")).parentElement as HTMLButtonElement


        detailsButton.click()


        await clickReviewTransaction()
        await clickTransactionsTab()
        await fillRelatedAccount()


    }


}
const setClickListenerForQuickQuerySearchTransaction = async () => {
    console.log("setClickListenerForQuickQuerySearchTransaction");

    //wait for search input
    const selector = 'input[placeholder="Receipt No."][class="el-input__inner"]'
    await waitForElementToAppearForever(selector)
    console.log("input found");

    const customerMsisdnInput = document.querySelector(selector) as HTMLInputElement;
    customerMsisdnInput.onclick = async () => {
        customerMsisdnInput.value += await getContentInClipBoard()
        customerMsisdnInput.dispatchEvent(new Event("input", { bubbles: true }))


        // const searchTransactionDiv = (await waitForElementToAppearWithTextContent('div', "Search Transaction") as HTMLDivElement)!.parentElement!.parentElement as HTMLDivElement
        const searchTransactionDiv = customerMsisdnInput.parentElement!
            .parentElement!
            .parentElement!
            .parentElement!
            .parentElement!
            .parentElement!
            .parentElement! as HTMLDivElement;

        const searchButton = await waitForElementToAppearWithTextContent('button[class="el-button search-btn"]', "Search", searchTransactionDiv) as HTMLButtonElement

        searchButton.click()

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


    specificItemClicked("KOPO KOPO")


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
    console.log("shortcode:" + shortCode);

    await waitForElementToAppearWithTextContentForever('div', shortCode)
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
export const clickMoneyRecipient = async () => {
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


    const payBillName = payBillNameDiv.textContent!.split("-")
        .slice(1)        // take everything after first hyphen
        .join("-")       // rejoin with hyphen in case there are more hyphens
        .replace("Details", "")
        .trim();
    console.log("paybill: " + payBillName);
    return payBillName

}
const addMerchantReversalInteraction = async () => {
    console.log("addMerchantReversalInteraction");
    chrome.runtime.sendMessage({
        type: "ADD_MERCHANT_REVERSAL_INTERACTION"
    });

}
const addPinResetInteraction = async () => {
    console.log("addPinResetInteraction");
    chrome.runtime.sendMessage({
        type: "ADD_PIN_RESET_INTERACTION"
    });

}
const addPinUnlockInteraction = async () => {
    console.log("addPinUnlockInteraction");

    chrome.runtime.sendMessage({
        type: "ADD_PIN_UNLOCK_INTERACTION"
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
const clickQuickQuerySearchButton = async () => {
    console.log("clickSearchButton");
    const searchButton = await waitForElementToAppearWithTextContent('button[class="el-button search-btn"]', "Search") as HTMLButtonElement

    searchButton.click()
}


const getContentInClipBoard = async () => {
    console.log("getContentInClipBoard");
    return navigator.clipboard.readText()

}

export const waitForElementToAppearForever = (selector: string, parent: Element = document.body,) => {
    return new Promise<Element>((resolve, reject) => {

        const element = parent.querySelector(selector);
        if (element) {
            return resolve(element); // already exists
        }

        const observer = new MutationObserver(() => {
            const el = parent.querySelector(selector);
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


export const waitForElementToAppearWithTextContent = (selector: string, textContent: string, parent: Element = document.body, timeout = 5_000) => {
    console.log("selector: " + selector);

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

export const waitForElementToAppearWithTextContentIncludes = (selector: string, textContent: string, parent: Element = document.body, timeout = 5_000) => {

    return new Promise<Element>((resolve, reject) => {
        const element = Array.from(parent.querySelectorAll(selector)).find(s => s.textContent!.trim().toLowerCase().includes(textContent.toLowerCase()))

        if (element) {
            return resolve(element); // already exists
        }

        const observer = new MutationObserver(() => {
            const el = Array.from(parent.querySelectorAll(selector)).find(s => s.textContent!.trim().toLowerCase().includes(textContent.toLowerCase()))
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

