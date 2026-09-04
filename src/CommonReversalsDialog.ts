import { CRM_ID } from "./Constants";
import { clickKycInfoTab, clickMoneyRecipient, getOfficePhoneNumber, getPayBillName, waitForElementToAppearForever, waitForElementToAppearWithTextContentForever } from "./util";
import { waitForElementWithParagraphTextContentToAppear } from "./util-crmsaf";



export const injectCommonReversalDialog = () => {
    console.log("injectCommonReversalDialog");
    configureCommonReversalDialoag()
}
const configureCommonReversalDialoag = async () => {

    const div = await waitForElementToAppearForever('div[class="page-title"]') as HTMLDivElement
    const container = div.parentElement!.parentElement!
    const dialog = createCommonReversalDialog()

    dialog.style.position = "fixed"
    dialog.style.top = "2%";
    dialog.style.right = "40%";
    document.body.appendChild(dialog)

    console.log("reverse loaded");

}

const createCommonReversalDialog = () => {

    // Wrapper
    const wrapper = document.createElement("div");
    wrapper.style.zIndex = "999999";


    //main button
    const button = document.createElement("button");

    button.innerText = "Common Stuff ▼";
    button.style.backgroundColor = "green";
    button.style.color = "white";
    button.style.border = "none";
    button.style.padding = "6px 3px";
    button.style.borderRadius = "4px";
    button.style.cursor = "pointer";


    // Dropdown
    const dropdown = document.createElement("div");
    dropdown.style.position = "absolute";
    dropdown.style.top = "100%";
    button.style.borderRadius = "10%"

    dropdown.style.left = "0";
    dropdown.style.marginTop = "4px";
    dropdown.style.minWidth = "160px";
    dropdown.style.background = "white";
    button.style.border = "none"
    dropdown.style.boxShadow = "0 4px 8px rgba(0,0,0,0.15)";
    dropdown.style.display = "none"; // hidden initially
    dropdown.style.zIndex = "1000";
    dropdown.style.whiteSpace = "nowrap"
    dropdown.style.zIndex = "999999";

    // Dropdown items
    const items = ["Merchant REVERSAL", "P2P REVERSAL", "POCHI REVERSAL", "PAYBILL REVERSAL"]
    items.forEach((itemText) => {
        const item = document.createElement("div");
        item.id = `${itemText}-commonStuffButton`.replace(" ", "")
        item.textContent = itemText;
        item.style.padding = "8px 12px";
        item.style.cursor = "pointer";
        item.style.width = "100%"

        item.onmouseenter = () => {
            item.style.background = "#f2f2f2";
        };

        item.onmouseleave = () => {
            item.style.background = "white";
        };

        item.onclick = async () => {
            console.log("Selected:", itemText);

            // Hide dropdown
            dropdown.style.display = "none";

            // Return button to normal
            button.textContent = "Common Stuff ▼";
            const txnId = await getTransactionId()
            specificItemClicked(itemText, txnId)
        };

        dropdown.appendChild(item);
    });

    // Toggle dropdown
    button.onclick = (e) => {
        e.stopPropagation();

        const isOpen = dropdown.style.display === "block";

        if (isOpen) {
            dropdown.style.display = "none";
            button.textContent = "Common Stuff ▼";
        } else {
            dropdown.style.display = "block";
            button.textContent = "Common Stuff ▲";
        }
    };

    // Click outside closes dropdown
    document.addEventListener("click", () => {
        dropdown.style.display = "none";
        button.textContent = "Common Stuff ▼";
    });

    wrapper.appendChild(button);
    wrapper.appendChild(dropdown);

    return wrapper;
}

export const specificItemClicked = async (sr: string, txnId: string) => {
    console.log("sr: " + sr);
    switch (sr) {

        case "Merchant REVERSAL": {
            await writeContentToClipBoard(sessionStorage.getItem("txnId")!)

            initiateMerchantReversalJourney(txnId)
            break
        }
        case "Sfc Merchant REVERSAL": {
            await writeContentToClipBoard(sessionStorage.getItem("txnId")!)

            initiateSfcMerchantReversalJourney(txnId)
            break
        }
        case "SFC_MERCHANT_REVERSAL_INSUFFICIENT_FUNDS": {
            initiateSfcMerchantReversalInsufficientFundsJourney(txnId)
            break
        } 
         case "KOPO_KOPO_MERCHANT_REVERSAL_INSUFFICIENT_FUNDS": {
            
            initiateKopoKopoMerchantReversalInsufficientFundsJourney(txnId)
            break
        }
        case "KOPO KOPO": {

            initiateKopoKopoMerchantReversalJourney(txnId)
            break
        }
        case "Bank Merchant REVERSAL": {
            await writeContentToClipBoard(sessionStorage.getItem("txnId")!)

            initiateBankMerchantReversalJourney(txnId)
            break
        }
        case "P2P REVERSAL": {
            await writeContentToClipBoard(sessionStorage.getItem("txnId")!)

            initiateP2pReversalJourney(txnId)
            break
        }
        case "ADD_P2P_REVERSAL_INSUFFICIENT_FUNDS_INTERACTION": {

            initiateP2pReversalInsufficientFundsJourney(txnId)
            break
        }
        case "POCHI REVERSAL": {
            await writeContentToClipBoard(sessionStorage.getItem("txnId")!)

            initiatePochiReversalJourney(txnId)
            break
        }
        case "PAYBILL REVERSAL": {
            initiatePaybillReversalJourney(txnId)
            break
        }
    }
}


export const initiateMerchantReversalJourney = async (txnId: string) => {
    console.log("initiateMerchantReversalJourney");
    chrome.runtime.sendMessage(
        CRM_ID, // Extension ID
        {
            action: "ADD_MERCHANT_REVERSAL_INTERACTION",
            txnId: txnId
        }
    );
}
export const initiateSfcMerchantReversalJourney = async (txnId: string) => {
    console.log("initiateSfcMerchantReversalJourney");
    chrome.runtime.sendMessage(
        CRM_ID, // Extension ID
        {
            action: "ADD_SFC_MERCHANT_REVERSAL_INTERACTION",
            txnId: txnId
        }
    );
}
export const initiateSfcMerchantReversalInsufficientFundsJourney = async (txnId: string) => {
    console.log("initiateSfcMerchantReversalInsufficientFundsJourney");

    chrome.runtime.sendMessage(
        CRM_ID, // Extension ID
        {
            action: "SFC_MERCHANT_REVERSAL_INSUFFICIENT_FUNDS",
            txnId: txnId
        }
    );
}
export const initiateKopoKopoMerchantReversalInsufficientFundsJourney = async (txnId: string) => {
    console.log("initiateKopoKopoMerchantReversalInsufficientFundsJourney");

    chrome.runtime.sendMessage(
        CRM_ID, // Extension ID
        {
            action: "KOPO_KOPO_MERCHANT_REVERSAL_INSUFFICIENT_FUNDS",
            txnId: txnId
        }
    );
}

//

export const initiateKopoKopoMerchantReversalJourney = async (txnId: string) => {
    console.log("initiateKopoKopoMerchantReversalJourney");
    chrome.runtime.sendMessage(
        CRM_ID, // Extension ID
        {
            action: "ADD_KOPO_KOPO_MERCHANT_REVERSAL_INTERACTION",
            subType: "Kopokopo Reversal",
            txnId: txnId
        }
    );


}
export const initiateBankMerchantReversalJourney = async (txnId: string) => {
    console.log("initiateBankMerchantReversalJourney");
    chrome.runtime.sendMessage(
        CRM_ID, // Extension ID
        {
            action: "ADD_BANK_MERCHANT_REVERSAL_SR",
            txnId: txnId
        }
    );
}

const initiatePaybillReversalJourney = async (txnId: string) => {
    console.log("initiatePaybillReversalJourney");


    const title = await clickMoneyRecipient()


    // wait for screen to load
    const shortCode = title.split("-")[0].trim()
    console.log("shortcode:" + shortCode);

    await waitForElementToAppearWithTextContentForever('div', shortCode)

    //


    await clickKycInfoTab()
    const officePhoneNumber = await getOfficePhoneNumber()
    const paybillName = await getPayBillName()



    ////
    chrome.runtime.sendMessage(

        CRM_ID, {
        action: "ADD_PAYBILL_REVERSAL_INTERACTION",
        txnId: txnId,
        officePhoneNumber: officePhoneNumber,
        paybillName: paybillName
    }
    );

}

export const initiateP2pReversalJourney = async (txnId: string) => {
    console.log("initiateP2pReversalJourney");
    chrome.runtime.sendMessage(
        CRM_ID, // Extension ID
        {
            action: "ADD_P2P_REVERSAL_INTERACTION",
            txnId: txnId
        }
    );
}
export const initiateP2pReversalInsufficientFundsJourney = async (txnId: string) => {

    console.log("initiateP2pReversalInsufficientFundsJourney");
    chrome.runtime.sendMessage(
        CRM_ID, // Extension ID
        {
            action: "ADD_P2P_REVERSAL_INSUFFICIENT_FUNDS_INTERACTION",
            txnId: txnId
        }
    );
}

export const initiatePochiReversalJourney = async (txnId: string) => {
    console.log("initiatePochiReversalJourney");
    chrome.runtime.sendMessage(
        CRM_ID, // Extension ID
        {
            action: "ADD_POCHI_REVERSAL_INTERACTION",
            txnId: txnId
        }
    );
}


export const getTransactionId = async () => {
    console.log("getTransactionId");
    const receiptP = await waitForElementWithParagraphTextContentToAppear("Receipt No. ") as HTMLParagraphElement
    const container = receiptP.parentElement!
    const trnP = container.querySelectorAll("p")[1] as HTMLParagraphElement

    return trnP.textContent!

}

export const writeContentToClipBoard = async (content: string) => {
    console.log("content: " + content);
    await navigator.clipboard.writeText(content)

}
const getClipBoardContent = async () => {
    console.log("getClipBoardContent");

    const content = await navigator.clipboard.readText()
    console.log("clipboard content: " + content);
    return content


}