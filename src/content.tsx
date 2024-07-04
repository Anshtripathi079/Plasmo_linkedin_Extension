import Arrow from "assets/Arrow.png"
import Insert from "assets/Insert.png"
import Regenerate from "assets/Regenerate.png"
import cssText from "data-text:~style.css"
import type { PlasmoCSConfig } from "plasmo"
import React, { useEffect, useRef, useState } from "react"

import AiIcon from "~components/AiIcon"

export const config: PlasmoCSConfig = {
  matches: ["https://*.linkedin.com/*"]
}

export const getStyle = () => {
  const style = document.createElement("style")
  style.textContent = cssText
  return style
}

const PlasmoOverlay = () => {
  const [showIcon, setShowIcon] = useState(false)
  const [iconPosition, setIconPosition] = useState<{
    bottom: number
    right: number
  }>({ bottom: 0, right: 0 })
  const [isModalOpen, setIsModalOpen] = useState(false)
  const inputRef = useRef<HTMLElement>(null)
  const [command, setCommand] = useState("")
  const [showCommand, setShowCommand] = useState("")
  const [dummyResponse, setDummyResponse] = useState("")

  /* This function handles the focus event on the msg field.
  1. Checks if the focused element is a msg field and stores its reference.
  2. Extracts the element's position relative to the viewport.
  3. Calculates the icon's position based on the viewport dimensions.
  4. Sets the icon's state to true, displaying it on the screen.
  */

  const handleFocus = (event: FocusEvent) => {
    if (
      event.target instanceof HTMLElement &&
      event.target.hasAttribute("contenteditable") &&
      event.target.closest(".msg-form__msg-content-container")
    ) {
      inputRef.current = event.target
      const rect = event.target.getBoundingClientRect()
      const viewportHeight = window.innerHeight
      const viewportWidth = window.innerWidth

      setIconPosition({
        bottom: viewportHeight - rect.bottom + 10,
        right: viewportWidth - rect.right - 12
      })
      setShowIcon(true)
    }
  }

  // Removes the icon when the msg field is not in focus
  const handleBlur = () => setShowIcon(false)

  // This function triggers when the icon is clicked and is used to open the modal.
  const handleIconClick = () => {
    inputRef.current?.focus()
    setIsModalOpen(true)
  }

  const closeModal = () => setIsModalOpen(false)

  /*
  Function to generate the dummy response, clears the input field and updates the show command state.
  */
  const handleGenerateClick = () => {
    setShowCommand(command)
    setCommand("")
    setDummyResponse(
      "Thank you for the opportunity! If you have any more questions or if there's anything else I can help you with, feel free to ask."
    )
  }

  /*
  Function to insert the generated dummy response to the linkedin message field.
  Steps used in logic:
  -> Get the message field into focus to insert the text into it.
  -> We use the Range and Selection APIs to insert the text at the caret position.
  -> After inserting the text, we ensure the caret is placed at the end of the inserted text.
  -> To ensure LinkedIn recognizes the content change, we dispatch an 'input' event on the contenteditable element (msg field).
  */

  const handleInsertClick = () => {
    if (inputRef.current) {
      inputRef.current.focus()

      const selection = window.getSelection()
      if (selection) {
        const range = selection.getRangeAt(0)
        range.deleteContents()

        const textNode = document.createTextNode(dummyResponse)
        range.insertNode(textNode)

        range.setStartAfter(textNode)
        range.setEndAfter(textNode)
        selection.removeAllRanges()
        selection.addRange(range)

        const inputEvent = new Event("input", { bubbles: true })
        inputRef.current.dispatchEvent(inputEvent)
      }
    }
    setIsModalOpen(false)
  }

  /*
  useEffect to attach and detach events when component mounts and unmounts.
  */

  useEffect(() => {
    document.addEventListener("focusin", handleFocus) // This event is fired when an element in the document gains focus.
    document.addEventListener("focusout", handleBlur) // This event is fired when an elemennt in the document losses focus.

    // cleanup function to detach the event listeners.
    return () => {
      document.removeEventListener("focusin", handleFocus)
      document.removeEventListener("focusout", handleBlur)
    }
  }, [])

  return (
    <>
      {showIcon && (
        <AiIcon
          style={{
            position: "fixed",
            bottom: `${iconPosition.bottom}px`,
            right: `${iconPosition.right}px`
          }}
          onClick={handleIconClick}
        />
      )}
      {isModalOpen && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
          onClick={closeModal}>
          <div
            className="bg-[#F9FAFB] p-7 rounded-xl shadow-lg relative w-[400px]"
            onClick={(e) => e.stopPropagation()}>
            {dummyResponse && (
              <>
                <div className="flex justify-end ">
                  <span className="p-4 bg-[#DFE1E7] text-2xl text-[#666D80] text-wrap rounded-xl max-w-[200px] mt-1">
                    {showCommand}
                  </span>
                </div>
                <div className="mt-5 p-4 bg-[#DBEAFE] max-w-[300px] text-[#666D80] rounded-xl text-wrap text-2xl">
                  {dummyResponse}
                </div>
              </>
            )}
            <div className="mb-4 mt-4">
              <input
                value={command}
                onChange={(e) => setCommand(e.target.value)}
                type="text"
                placeholder="Your prompt"
                className="p-3 mt-1 text-xl border rounded-lg w-full"
              />
            </div>
            <div className="flex justify-end">
              {dummyResponse && (
                <button
                  onClick={handleInsertClick}
                  className=" flex items-center gap-2 text-black text-xl font-semibold px-4 py-2 rounded-lg mr-4 border border-1 border-[#666D80] hover:bg-gray-100 transition-all">
                  <img
                    src={Insert}
                    alt="Insert Text"
                    className="w-3 text-[#666D80]"
                  />
                  <span className="text-[#666D80] font-semibold">Insert</span>
                </button>
              )}
              <button
                onClick={dummyResponse ? null : handleGenerateClick}
                className="bg-[#3B82F6] hover:bg-[#3372d6] transition-all  text-white text-xl font-semibold px-4 py-2  flex items-center gap-2 rounded-lg">
                <img
                  src={dummyResponse ? Regenerate : Arrow}
                  alt="Generate"
                  className={dummyResponse ? "w-4" : "w-6"}
                />
                <span>{dummyResponse ? "Regenerate" : "Generate"}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default PlasmoOverlay
