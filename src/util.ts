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

        clickSearchButton()

        //wait for table records to change
        await waitForTableToChange()

        //wait for details record

        const detailsButtonSelector = 'button[class="el-button el-button--primary is-link operation-button"]'
        await waitForElementToAppearForever(detailsButtonSelector)

        const detailsButton = document.querySelector(detailsButtonSelector) as HTMLButtonElement
        detailsButton.click()

    }


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


const clickSearchButton = () => {
    console.log("clickSearchButton");
    const searchButton = document.querySelector('button[class="el-button el-button--primary form-btn-margin-left-8"]') as HTMLButtonElement
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
