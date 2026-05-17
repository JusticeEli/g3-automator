const showConfirmationDialog = (dialogDescription: string, okMessage: string): Promise<boolean> => {
    return new Promise((resolve) => {
        // Overlay
        const overlay = document.createElement("div");
        overlay.id = "showConfirmationDialogId";
        overlay.style.position = "fixed";
        overlay.style.top = "0";
        overlay.style.left = "0";
        overlay.style.width = "100vw";
        overlay.style.height = "100vh";
        overlay.style.backgroundColor = "rgba(0, 0, 0, 0.4)";
        overlay.style.display = "flex";
        overlay.style.alignItems = "center";
        overlay.style.justifyContent = "center";
        overlay.style.zIndex = "10000";

        // Dialog box
        const dialog = document.createElement("div");
        dialog.style.background = "white";
        dialog.style.padding = "20px";
        dialog.style.borderRadius = "8px";
        dialog.style.width = "350px";
        dialog.style.boxShadow = "0 5px 15px rgba(0,0,0,0.3)";
        dialog.style.textAlign = "center";

        // Message
        const message = document.createElement("p");
        message.style.color = "green";
        message.textContent = dialogDescription;
        message.style.marginBottom = "20px";
        message.style.textAlign = "left";
        message.style.whiteSpace="pre-wrap"


       
        // When user clicks outside dialog
        overlay.addEventListener("click", (e) => {
            if (e.target === overlay) {
                document.body.removeChild(overlay);
                resolve(false); // treat it like Cancel
            }
        });

        // Assemble
   
        dialog.appendChild(message);
        overlay.appendChild(dialog);
        document.body.appendChild(overlay);
    });
};


export const showConfirmationDialogAndWaitForAnswer = async (dialogDescription: string, okMessage: string = "Cancel") => {
    const send = await showConfirmationDialog(dialogDescription, okMessage);

    if (send) {
        console.log("send");

    } else {
        console.log("close");
    }
    return send
}