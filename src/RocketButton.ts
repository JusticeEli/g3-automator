import { test } from "./util";

export const injectRocketButton = () => {
    console.log("injectRocketButton");


    // Avoid adding it twice
    if (document.getElementById("rocketButton")) return;

    const button = document.createElement("button");
    button.id = "rocketButton";
    button.innerText = "🚀";

    // Style it (floating button)
    button.style.position = "fixed";
    button.style.bottom = "10%";
    button.style.right = "10%";
    button.style.backgroundColor = "rgba(0,0,0,0)";
    button.style.cursor = "pointer";
    button.style.border = "none"
    button.style.zIndex = "9999";

    // What happens when clicked
    button.addEventListener("click", () => {

        rocketButtonClicked()
    });

    document.body.appendChild(button);
}

export const rocketButtonClicked = () => {
    console.log("rocket...");
    test()

}

