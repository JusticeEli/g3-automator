
export abstract class DiySmsFlow {
    protected abstract message: string;

    async send(): Promise<void> {
        console.log(`Sending DIY: ${this.message}`);

        clickConfigureSmsButton();

        const dialog = await waitForSendWirelessMessageDialogToAppear();

        const textArea = dialog.querySelector("textarea") as HTMLTextAreaElement;

        await manualType(textArea, this.message);

        await clickSendToSubmitDiy(dialog);
    }
}

export const clickConfigureSmsButton = () => {
    const configureSmsButton = document.querySelector('button[title="Send SMS Form Applet:Configure SMS"]') as HTMLButtonElement
    configureSmsButton.click()
}
export const waitForSendWirelessMessageDialogToAppear = async () => {

    const selector = 'div[title="Send Wireless Message Form Applet"]'
    const sendWirelessMessageDialog = await waitForElementToAppear(
        selector
    );

    return sendWirelessMessageDialog
}
export const waitForElementToAppear = (selector: string, timeout = 120_000) => {
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

        // Optional: timeout safety
        setTimeout(() => {
            observer.disconnect();
            reject("Element not found within timeout");
        }, timeout);
    }

    )
}
export const manualType = async (inputField: HTMLInputElement | HTMLTextAreaElement, text: string, speed = 1) => {
    for (let i = 0; i < text.length; i++) {
        const char = text[i];
        inputField.value += char;
        await sleep(speed)
    }

    inputField.focus();
    await sleep(300)
    //await waitForDOMToSettle()

    console.log("Typing finished!");
};
export const clickSendToSubmitDiy = async (sendWirelessMessageDialog: Element) => {
    console.log("clickSendToSubmitDiy");
    const sendButton = sendWirelessMessageDialog.querySelector('button[title="Send Wireless Message Form Applet:Send"]') as HTMLButtonElement;

    sendButton.click()

    await waitForSendWirelessMessageDialogToDisappear()

    console.log("diy sent successfully");
}
export const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
const waitForSendWirelessMessageDialogToDisappear = async () => {

    const selector = 'div[title="Send Wireless Message Form Applet"]'
    await waitForElementToDisappear(
        selector
    );
    console.log("waitForSendWirelessMessageDialogToDisappear");


}
export const waitForElementToDisappear = (
    selector: string,
    timeout = 60000
): Promise<void> => {
    return new Promise((resolve, reject) => {
        // If already gone, resolve immediately
        if (!document.querySelector(selector)) {
            return resolve();
        }

        const observer = new MutationObserver(() => {
            const el = document.querySelector(selector);
            if (!el) {
                observer.disconnect();
                resolve();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true,
        });

        setTimeout(() => {
            observer.disconnect();
            reject("Element did not disappear within timeout");
        }, timeout);
    });
};