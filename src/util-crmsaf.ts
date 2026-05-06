export const injectMessageListener = async () => {
    console.log("injectMessageListener");

    chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
        console.log("message received...msg: " + msg.type);

        clickCommonStuffButton()

        switch (msg.type) {
            case "ADD_MERCHANT_REVERSAL_INTERACTION": {

                addMerchantReversalInteraction(msg.txnId)

                break
            }
            case "ADD_P2P_REVERSAL_INTERACTION": {

                addP2pReversalInteraction()
                break
            }
            case "ADD_POCHI_REVERSAL_INTERACTION": {

                addPochiReversalInteraction()
                break
            }


        }
    });
}
const clickCommonStuffButton = () => {
    const commonStuffButton = document.querySelector('#commonStuffButtonId') as HTMLButtonElement
    commonStuffButton.click()
}
const addMerchantReversalInteraction = (txnId:string) => {
    console.log("addMerchantReversalInteraction");
    const merchantReversalDiv = document.querySelector('#MerchantREVERSAL-commonStuffButton') as HTMLDivElement
    merchantReversalDiv.click()


}
const addP2pReversalInteraction = () => {
    console.log("addP2pReversalInteraction");
    const merchantReversalDiv = document.querySelector('#P2PREVERSAL-commonStuffButton') as HTMLDivElement
    merchantReversalDiv.click()


}
const addPochiReversalInteraction = () => {
    console.log("addPochiReversalInteraction");
    const merchantReversalDiv = document.querySelector('#POCHIREVERSAL-commonStuffButton') as HTMLDivElement
    merchantReversalDiv.click()


}


export const waitForElementWithParagraphTextContentToAppear = (textContent: string, timeout = 120_000) => {
    return new Promise<Element>((resolve, reject) => {

        const element = Array.from(document.querySelectorAll("p")).find(e => e.textContent == textContent)

        if (element) {
            console.log("found:first try " + element.textContent);

            return resolve(element); // already exists
        }

        const observer = new MutationObserver(() => {
            const el = Array.from(document.querySelectorAll("p")).find(e => e.textContent == textContent)
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