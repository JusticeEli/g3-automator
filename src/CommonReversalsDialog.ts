import { waitForElementToAppearForever } from "./util";
import { waitForElementWithParagraphTextContentToAppear } from "./util-crmsaf";



export const injectCommonReversalDialog = () => {
    console.log("injectCommonReversalDialog");
    configureCommonReversalDialoag()
}
const configureCommonReversalDialoag = async () => {

    const div = await waitForElementToAppearForever('div[class="page-title"]') as HTMLDivElement
    const container = div.parentElement!.parentElement!
    const dialog = createCommonReversalDialog()
    container.appendChild(dialog)
    console.log("reverse loaded");

}

const createCommonReversalDialog = () => {

    // Wrapper
    const wrapper = document.createElement("div");

    //main button
    const button = document.createElement("button");

    button.innerText = "Common Stuff ▼";
    button.style.backgroundColor = "green";
    button.style.color = "white";
    button.style.border = "none";
    button.style.padding = "6px 3px";
    button.style.borderRadius = "4px";
    button.style.cursor = "pointer";


    //dropdown
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
    dropdown.style.display = "display"; // hidden initially
    dropdown.style.flexDirection = "row"
    dropdown.style.alignItems = "center";
    dropdown.style.gap = "8px";
    dropdown.style.zIndex = "1000";
    dropdown.style.whiteSpace = "nowrap"
    dropdown.style.zIndex = "999999";

    // Dropdown items
    const items = ["Merchant REVERSAL", "P2P REVERSAL", "POCHI REVERSAL"]
    items.forEach((itemText) => {
        const item = document.createElement("div");
        item.id = `${itemText}-commonStuffButton`.replace(" ", "")
        item.textContent = itemText;
        item.style.padding = "8px 12px";
        item.style.cursor = "pointer";
        //  item.style.width = "100%"

        item.onmouseenter = () => {
            item.style.background = "#f2f2f2";
        };

        item.onmouseleave = () => {
            item.style.background = "white";
        };

        item.onclick = () => {
            console.log("Selected:", itemText);

            // Hide dropdown
            dropdown.style.display = "none";

            // Return button to normal
            button.textContent = "Common Stuff ▼";

            specificItemClicked(itemText)
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

const specificItemClicked = async (sr: string) => {
    console.log("sr: " + sr);
    await writeContentToClipBoard(await getTransactionId())
    switch (sr) {

        case "Merchant REVERSAL": {
            initiateMerchantReversalJourney()
            break
        }
        case "P2P REVERSAL": {
            initiateP2pReversalJourney()
            break
        }
        case "POCHI REVERSAL": {
            initiatePochiReversalJourney()
            break
        }
    }
}

const initiateMerchantReversalJourney = async () => {
    console.log("initiateMerchantReversalJourney");
    chrome.runtime.sendMessage({
        type: "ADD_MERCHANT_REVERSAL_INTERACTION",
        txnId: await getTransactionId()
    });

}
const initiateP2pReversalJourney = async () => {
    console.log("initiateP2pReversalJourney");
    chrome.runtime.sendMessage({
        type: "ADD_P2P_REVERSAL_INTERACTION"
    });

}
const initiatePochiReversalJourney = async () => {
    console.log("initiatePochiReversalJourney");
    chrome.runtime.sendMessage({
        type: "ADD_POCHI_REVERSAL_INTERACTION"
    });

}

const getTransactionId = async () => {
    console.log("getTransactionId");
    const receiptP = await waitForElementWithParagraphTextContentToAppear("Receipt No. ") as HTMLParagraphElement
    const container = receiptP.parentElement!
    const trnP = container.querySelectorAll("p")[1] as HTMLParagraphElement

    return trnP.textContent!

}

const writeContentToClipBoard = async (content: string) => {
    console.log("content: " + content);
    await navigator.clipboard.writeText(content)

}