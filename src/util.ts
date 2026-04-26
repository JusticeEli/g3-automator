export const injectSetListenerForGlobalElements = async () => {


    await setListenersForGlobalElements(

        () => {


            setClickListenerForCustomerMsisdn()


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

export const test = () => {
    //  fillRelatedAccount()
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
