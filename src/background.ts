
chrome.runtime.sendMessage({
    type: "GO_TO_CRM_TAB"
});



chrome.runtime.onMessage.addListener(async (msg, sender, sendResponse) => {

    const prefix = "https://crmsaf.safaricom.co.ke/siebel/";

    const tabs = await chrome.tabs.query({});

    const existingTab = tabs.find(t => t.url!.startsWith(prefix))!;
    await chrome.tabs.update(existingTab.id, { active: true });

    switch (msg.type) {
        case "ADD_MERCHANT_REVERSAL_INTERACTION": {

            chrome.tabs.sendMessage(existingTab.id!, {
                type: "ADD_MERCHANT_REVERSAL_INTERACTION",
                txnId:msg.txnId
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


    }

    return true;
});