/**
 * @param {HTMLElement} element 
 * @param {HTMLElement | string} targetElementOrSelector 
 */
 export function portal(element, targetElementOrSelector)
 {
	 const targetElement = typeof targetElementOrSelector == 'string'
		 ? document.querySelector(targetElementOrSelector) 
		 : targetElementOrSelector;
	 const portalChildren = [...element.children];
 
	 if (targetElement == null)
		 throw new Error('Target element not found/undefined.');
 
	 targetElement.append(...portalChildren);
 
	 return {
		 destroy()
		 {
			 for (const portalChild of portalChildren)
				 portalChild.remove();
		 }
	 }
 }