import { useState } from "react";
import Card from "./card";
import { CONTENT_TYPES, INTENTS, ItemMutation, type RenderedItem } from "./types";
import { useSubmit } from "@remix-run/react";

interface ColumnProps {
    name: string;
    columnId: string;
    items: RenderedItem[];
}

export function Column({ name, columnId, items }: ColumnProps) {
    let [acceptDrop, setAcceptDrop] = useState(false);
    let submit = useSubmit();

    return (
        <div
            onDragOver={(event) => {
                if (
                    items.length === 0 &&
                    event.dataTransfer.types.includes(CONTENT_TYPES.card)
                ) {
                    event.preventDefault();
                    setAcceptDrop(true);
                }
            }}
            onDragLeave={() => {
                setAcceptDrop(false);
            }}
            onDrop={(event) => {
                let transfer = JSON.parse(
                    event.dataTransfer.getData(CONTENT_TYPES.card),
                );
                // invariant(transfer.id, "missing transfer.id");
                // invariant(transfer.title, "missing transfer.title");

                let mutation: ItemMutation = {
                    order: 1,
                    columnId: columnId,
                    id: transfer.id,
                    title: transfer.title,
                };

                submit(
                    { ...mutation, intent: INTENTS.moveItem },
                    {
                        method: "post",
                        navigate: false,
                        // use the same fetcher instance for any mutations on this card so
                        // that interruptions cancel the earlier request and revalidation
                        fetcherKey: `card:${transfer.id}`,
                    },
                );

                setAcceptDrop(false);
            }}
        >
            <div></div>
            <ul>
                {items
                    .sort((a, b) => a.order - b.order)
                    .map((item, index, items) => (
                        <Card
                            key={item.id}
                            title={item.title}
                            content={item.content}
                            id={item.id}
                            order={item.order}
                            columnId={columnId}
                        // previousOrder={items[index - 1] ? items[index - 1].order : 0}
                        // nextOrder={
                        //     items[index + 1] ? items[index + 1].order : item.order + 1
                        // }
                        />
                    ))}
            </ul>
        </div>
    )
}