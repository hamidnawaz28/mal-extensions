import { createRoot } from 'react-dom/client'
import '../../base.css'
import ContentScript from './ContentScript'
import { waitForElement } from './helpers';



const renderBidButton = async () => {
  await waitForElement(mainGridSelector);
  const mainDiv = await logoGridSelector() as HTMLElement;

  if (!mainDiv) return;

  const newContainer = document.createElement("div");
  newContainer.id = "my-bid-button-root";  
  newContainer.style.position = "relative";
  ;
  mainDiv.parentElement?.insertBefore(newContainer, mainDiv.nextSibling);


  const root = createRoot(newContainer);
  root.render(<ContentScript />);
}

const logoGridSelector = async () => {
  return document.querySelector("i[alt='Meta Ad Library'] ")?.parentElement?.parentElement?.parentElement?.parentElement?.parentElement as HTMLElement
}
const mainGridSelector = async () => {
  return document.querySelector("[aria-haspopup='menu']")?.parentElement?.parentElement?.parentElement?.parentElement?.parentElement?.parentElement?.parentElement?.parentElement?.parentElement as HTMLElement

}
renderBidButton()
