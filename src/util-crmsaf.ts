import { DiySmsFlow } from "./DiySmsFlow";

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
            case "ADD_PIN_RESET_INTERACTION": {

                addPinResetInteraction(msg.txnId)
                break
            }   
             case "ADD_PIN_UNLOCK_INTERACTION": {

                addPinUnlockInteraction(msg.txnId)
                break
            }
            case "ADD_SFC_MERCHANT_REVERSAL_INTERACTION": {

                addSfcMerchantReversalInteraction(msg.txnId)

                break
            }
            case "ADD_BANK_MERCHANT_REVERSAL_SR": {

                addBankMerchantReversalSr(msg.txnId)

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
            case "ADD_PAYBILL_REVERSAL_INTERACTION": {
                addPaybillReversalInteraction(msg)
                break
            }


        }
    });
}
const clickCommonStuffButton = () => {
    const commonStuffButton = document.querySelector('#commonStuffButtonId') as HTMLButtonElement
    commonStuffButton.click()
}
const addMerchantReversalInteraction = (txnId: string) => {
    console.log("addMerchantReversalInteraction");
    const merchantReversalDiv = document.querySelector('#MerchantREVERSAL-commonStuffButton') as HTMLDivElement
    merchantReversalDiv.click()


}
const addPinResetInteraction = (txnId: string) => {
    console.log("addPinResetInteraction");
    const merchantReversalDiv = document.querySelector('#PinReset-commonStuffButton') as HTMLDivElement
    merchantReversalDiv.click()


}
const addPinUnlockInteraction = (txnId: string) => {
    console.log("addPinUnlockInteraction");
    
    const merchantReversalDiv = document.querySelector('#PinUnlock-commonStuffButton') as HTMLDivElement
    merchantReversalDiv.click()


}
const addSfcMerchantReversalInteraction = (txnId: string) => {
    console.log("addSfcMerchantReversalInteraction");
    const merchantReversalDiv = document.querySelector('#SfcMerchantREVERSAL-commonStuffButton') as HTMLDivElement
    merchantReversalDiv.click()


}
const addBankMerchantReversalSr = (txnId: string) => {
    console.log("addBankMerchantReversalSr");
    const merchantReversalDiv = document.querySelector('#InitiateBankReversal2-commonStuffButton') as HTMLDivElement
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
const addPaybillReversalInteraction = async (msg: { txnId: string, officePhoneNumber: string, paybillName: string }) => {
    console.log("addPaybillReversalInteraction msg: " + msg);

    const sms = `Jambo, kindly contact ${msg.paybillName}   on ${msg.officePhoneNumber} (Normal rates apply) for assistance. Thank you.`

    await sendPaybillContactDetails(sms)

    const comment = `${msg.txnId}
${sms}
    `
    await writeContentToClipBoard(comment)

    const merchantReversalDiv = document.querySelector('#PaybillREVERSAL-commonStuffButton') as HTMLDivElement
    merchantReversalDiv.click()


}
export const sendPaybillContactDetails = async (sms: string) => {
    console.log("sendPaybillContactDetails");

    await new (class extends DiySmsFlow {
        protected message =
            sms
    })().send();


}

export const waitForElementWithParagraphTextContentToAppear = (textContent: string, timeout = 5_000) => {
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

export const waitForTransactionType = async () => {
    const label = await waitForElementWithParagraphTextContentToAppear(
        "Transaction Type"
    ) as HTMLParagraphElement;

    const parent = label.parentElement!;

    return new Promise<string>((resolve) => {

        const getValue = () => {
            const dataElement = parent.querySelectorAll("p")[1];

            const value = dataElement?.textContent?.trim();

            if (value && value !== "-") {
                return value;
            }

            return null;
        };

        // Check immediately
        const value = getValue();

        if (value) {
            resolve(value);
            return;
        }

        // Keep watching for changes
        const observer = new MutationObserver(() => {
            const value = getValue();

            if (value) {
                observer.disconnect();
                resolve(value);
            }
        });

        observer.observe(parent, {
            childList: true,
            subtree: true,
            characterData: true
        });
    });
};

const writeContentToClipBoard = async (content: string) => {
    console.log("content: " + content);
    await navigator.clipboard.writeText(content)

}