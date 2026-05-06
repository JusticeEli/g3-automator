import { waitForElementWithParagraphTextContentToAppear } from "./util-crmsaf";

const createReverseButton = () => {

    const button = document.createElement("button");

    button.innerText = "Copy Receipt";
    button.style.backgroundColor = "green";
    button.style.color = "white";
    button.style.border = "none";
    button.style.padding = "6px 3px";
    button.style.borderRadius = "4px";
    button.style.cursor = "pointer";
    return button
}

const configureReverseButton = async () => {
    const container = await waitForElementWithParagraphTextContentToAppear("Receipt No. ") as HTMLParagraphElement
    const reverseButton = createReverseButton()
    container.parentElement!.appendChild(reverseButton)
    console.log("reverse loaded");
    
}

export const injectReverseButton = () => {
    console.log("injectReverseButton");
    configureReverseButton()
}