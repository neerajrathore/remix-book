import { useLoaderData } from "@remix-run/react";

export default function Board() {

    let { board } = useLoaderData<any>() || { board: { columns: [], items: [] } };

    // let optAddingColumns = usePendingColumns();
    type Column =
        | (typeof board.columns)[number]
    // | (typeof optAddingColumns)[number];
    type ColumnWithItems = Column & { items: typeof board.items };

    let columns = new Map<string, ColumnWithItems>();
    for (let column of [...board.columns]) {
        columns.set(column.id, { ...column, items: [] });
    }

    // add items to their columns
    // for (let item of itemsById.values()) {
    //     let columnId = item.columnId;
    //     let column = columns.get(columnId);
    //     invariant(column, "missing column");
    //     column.items.push(item);
    // }
    return (
        <div>
            <h1>
                Board Name
            </h1>
            <div>
                {[...columns.values()].map((col) => {
                    return (
                        <h2>column</h2>
                    );
                })}

            </div>
        </div>
    )
}