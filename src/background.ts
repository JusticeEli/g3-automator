
chrome.runtime.onMessage.addListener(async (msg, sender, sendResponse) => {
    console.log("msg: " + msg);

    const prefix = "https://crmsaf.safaricom.co.ke/siebel/";

    const tabs = await chrome.tabs.query({});

    const existingTab = tabs.find(t => t.url!.startsWith(prefix))!;
    await chrome.tabs.update(existingTab.id, { active: true });

    switch (msg.type) {
        case "ADD_MERCHANT_REVERSAL_INTERACTION": {

            chrome.tabs.sendMessage(existingTab.id!, {
                type: "ADD_MERCHANT_REVERSAL_INTERACTION",
                txnId: msg.txnId
            });

            break
        }
        case "ADD_SFC_MERCHANT_REVERSAL_INTERACTION": {

            chrome.tabs.sendMessage(existingTab.id!, {
                type: "ADD_SFC_MERCHANT_REVERSAL_INTERACTION",
                txnId: msg.txnId
            });

            break
        }    
        case "ADD_BANK_MERCHANT_REVERSAL_SR": {

            chrome.tabs.sendMessage(existingTab.id!, {
                type: "ADD_BANK_MERCHANT_REVERSAL_SR",
                txnId: msg.txnId
            });

            break
        }
        case "ADD_P2P_REVERSAL_INTERACTION": {

            chrome.tabs.sendMessage(existingTab.id!, {
                type: "ADD_P2P_REVERSAL_INTERACTION"
            });

            break
        }
        case "ADD_POCHI_REVERSAL_INTERACTION": {

            chrome.tabs.sendMessage(existingTab.id!, {
                type: "ADD_POCHI_REVERSAL_INTERACTION"
            });

            break
        }
        case "ADD_PAYBILL_REVERSAL_INTERACTION": {

            chrome.tabs.sendMessage(existingTab.id!, {
                type: "ADD_PAYBILL_REVERSAL_INTERACTION",
                txnId: msg.txnId,
                paybillName: msg.paybillName,
                officePhoneNumber: msg.officePhoneNumber

            });

            break
        }


    }

    return true;
});