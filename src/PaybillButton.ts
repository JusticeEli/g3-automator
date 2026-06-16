import { specificItemClicked } from "./CommonReversalsDialog";
import { getTransactionType } from "./util";

export const injectPaybillButton = async () => {
    const sendOfficeNumberButton = document.getElementById("createSendOfficeNumberButton")
    try {
        const transactionType = await getTransactionType()

        if (transactionType == "Pay Bill") {
            createSendOfficeNumberButton()
        }

    } catch (error) {
        console.error("❌ An error occurred:", error);

        if (sendOfficeNumberButton) {
            sendOfficeNumberButton.remove()
        }

    }


}
export const createSendOfficeNumberButton = () => {
    console.log("createSendOfficeNumberButton");

    // Avoid adding it twice
    if (document.getElementById("createSendOfficeNumberButton")) return;


    //main button
    const button = document.createElement("button");
    button.id = "createSendOfficeNumberButton"
    button.innerText = "Send Office number";
    button.style.backgroundColor = "green";
    button.style.color = "white";
    button.style.border = "none";
    button.style.padding = "6px 3px";
    button.style.borderRadius = "4px";
    button.style.cursor = "pointer";
    button.dataset.g3Automator = "true";



    button.style.position = "fixed"
    button.style.top = "17%";
    button.style.right = "50%";



    button.onclick = async () => {
        await specificItemClicked("PAYBILL REVERSAL")

    }
    document.body.appendChild(button)
}





export const clearCustomElements = () => {
    console.log("clearCustomElements");
    document
        .querySelectorAll('[data-g3-automator="true"]')
        .forEach(el => el.remove());

}