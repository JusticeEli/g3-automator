import { injectRocketButton } from "./RocketButton";
import { injectSetListenerForGlobalElements, } from "./util";



console.log("view360-automator extension loaded!");














window.onload = () => {
    console.log("onLoad");



    injectRocketButton()
    injectSetListenerForGlobalElements()
}





