import { useEffect, useRef } from "react";
import invariant from "tiny-invariant";
import { Form, useFetcher, useSubmit } from "@remix-run/react";

import { INTENTS, ItemMutationFields } from "./types";
import { SaveButton, CancelButton } from "./components";

export function NewCard({
  columnId,
  nextOrder,
  onComplete,
  onAddCard,
}: {
  columnId: string;
  nextOrder: number;
  onComplete: () => void;
  onAddCard: () => void;
}) {
  let textAreaRef = useRef<HTMLTextAreaElement>(null);
  let buttonRef = useRef<HTMLButtonElement>(null);
  //   let submit = useSubmit();
  let fetcher = useFetcher();

  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data) {
      onAddCard()
    }
  }, [fetcher])

  return (
    <fetcher.Form
      method="post"
      className="flex flex-col gap-2.5 p-2 pt-1"
      onSubmit={(event) => {
        event.preventDefault();
        // if(fetcher.state === "idle"){
        //     return
        // }

        let formData = new FormData(event.currentTarget);
        let id = crypto.randomUUID();
        formData.set(ItemMutationFields.id.name, id);

        fetcher.submit(formData, { method: "post" });

        // submit(formData, {
        //   method: "post",
        //   fetcherKey: `card:${id}`,
        //   navigate: false,
        //   unstable_flushSync: true,
        // });

        invariant(textAreaRef.current);
        textAreaRef.current.value = "";
        // onAddCard();
      }}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          onComplete();
        }
      }}
    >
      <input type="hidden" name="intent" value={INTENTS.createItem} />
      <input
        type="hidden"
        name={ItemMutationFields.columnId.name}
        value={columnId}
      />
      <input
        type="hidden"
        name={ItemMutationFields.order.name}
        value={nextOrder}
      />

      <textarea
        autoFocus
        required
        ref={textAreaRef}
        name={ItemMutationFields.title.name}
        placeholder="Enter a title for this card"
        className="outline-none shadow shadow-slate-300 border-slate-300 text-sm rounded-lg w-full py-1 px-2 resize-none placeholder:text-sm placeholder:text-slate-500 h-14"
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            event.preventDefault();
            invariant(buttonRef.current, "expected button ref");
            buttonRef.current.click();
          }
          if (event.key === "Escape") {
            onComplete();
          }
        }}
        onChange={(event) => {
          let el = event.currentTarget;
          el.style.height = el.scrollHeight + "px";
        }}
      />
      <div className="flex justify-between">
        <SaveButton style={{ background: "black" }} ref={buttonRef} disabled={fetcher.state !== "idle"}>Save Card{fetcher.state}</SaveButton>
        <CancelButton onClick={onComplete}>Cancel</CancelButton>
      </div>
    </fetcher.Form>
  );
}