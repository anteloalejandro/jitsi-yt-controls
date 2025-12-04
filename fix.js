/**
 * Starts observing for mutations in the entire DOM body,
 * and if one of those changes **directly** adds any `iframe`,
 * sets the `control` URL parameter to `1` in its `src` attribute
 *
 * @todo Check mutations other than adding directly an `iframe`, like modifying the `innerHTML` attribute.
 *
 * @returns A function that stops the observer
 * @see [MutationObserver MDN reference](https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver)
 */
function yt_fix_observer() {
  const observer_target = document.body;
  const observer = new MutationObserver(mutation_list => {
    /** @type {HTMLIFrameElement | null} */
    let iframe = null;
    for (const mut of mutation_list) {
      for (const node of mut.addedNodes) {
        if (node.nodeName == "IFRAME") {
          iframe = node;
          break;
        }
      }
    }
    if (iframe == null) {
      console.log("NOTE: mutations detected, but iframe was not added");
      console.log(mutation_list);
      return;
    }

    console.log("NOTE: iframe added, fixing controls...");
    let url = new URL(iframe.src);
    url.searchParams.set("controls", 1);
    iframe.src = url.toString();
  })
  observer.observe(observer_target, { childList: true, subtree: true });

  return observer.disconnect;
}
