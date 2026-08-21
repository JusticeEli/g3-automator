import { injectCommonReversalDialog } from "./CommonReversalsDialog";
import { injectRocketButton } from "./RocketButton";
import { injectContentScriptMessageListener, injectSetListenerForGlobalElements, } from "./util";



console.log("g3-automator extension loaded!");











window.onload = () => {
    console.log("onLoad");



    injectRocketButton()
    injectSetListenerForGlobalElements()
    injectCommonReversalDialog()
    injectContentScriptMessageListener()
}





