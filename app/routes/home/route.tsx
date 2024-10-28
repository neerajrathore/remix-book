import { Form, Link, useFetcher, useLoaderData, useNavigation } from "@remix-run/react";
import { Button } from "~/components/Button";
import { Label, LabeledInput } from "~/components/Input";
import { INTENTS } from "../board.$id/types";
import { ActionFunctionArgs, LoaderFunctionArgs, redirect } from "@remix-run/node";
import { requireAuthCookie } from "~/auth";
import { createBoard, getHomeData } from "./queries";


export async function loader({ request }: LoaderFunctionArgs) {
    let userId = await requireAuthCookie(request);
    let boards = await getHomeData(userId);
    return { boards };
}

export async function action({ request }: ActionFunctionArgs) {
    let userId = await requireAuthCookie(request);
    let formData = await request.formData();
    let name = String(formData.get('name'))
    let color = String(formData.get('color'))
    if (!name) {
        throw new Response("bad request", { status: 400 })
    }
    let board = await createBoard(userId, name, color)
    return redirect(`/board/${board.id}`)
}


export default function Home() {
    return (
        <div className="h-full">
            <NewBoard />
            <Boards />
        </div>
    );
}


function Boards() {
    let { boards } = useLoaderData<typeof loader>();
    return (
        <div className="p-8">
            <h2 className="font-bold mb-2 text-xl">Boards</h2>
            <nav className="flex flex-wrap gap-8">
                {boards?.map((board: any) => (
                    <Board
                        key={board.id}
                        name={board.name}
                        id={board.id}
                        color={board.color}
                    />
                ))}
            </nav>
        </div>
    );
}

function Board({
    name,
    id,
    color,
}: {
    name: string;
    id: number;
    color: string;
}) {
    let fetcher = useFetcher();
    let isDeleting = fetcher.state !== "idle";
    return isDeleting ? null : (
        <Link
            to={`/board/${id}`}
            className="w-60 h-40 p-4 block border-b-8 shadow rounded hover:shadow-lg bg-white relative"
            style={{ borderColor: color }}
        >
            <div className="font-bold">{name}</div>
            <fetcher.Form method="post">
                <input type="hidden" name="intent" value={INTENTS.deleteBoard} />
                <input type="hidden" name="boardId" value={id} />
                <button
                    aria-label="Delete board"
                    className="absolute top-4 right-4 hover:text-brand-red"
                    type="submit"
                    onClick={(event) => {
                        event.stopPropagation();
                    }}
                >
                    delete
                </button>
            </fetcher.Form>
        </Link>
    );
}

function NewBoard() {
    let navigation = useNavigation();
    let isCreating = navigation.formData?.get("intent") === "createBoard";

    return (
        <Form method="post" className="p-8 max-w-md">
            {/* <input type="hidden" name="intent" value="createBoard" /> */}
            <div>
                <h2 className="font-bold mb-2 text-xl">New Board</h2>
                <LabeledInput
                    label="Name"
                    name="name"
                    type="text"
                    required />
            </div>

            <div className="mt-4 flex items-center gap-4">
                <div className="flex items-center gap-1">
                    <Label htmlFor="board-color">Color</Label>
                    <input
                        id="board-color"
                        name="color"
                        type="color"
                        defaultValue="#cbd5e1"
                        className="bg-transparent"
                    />
                </div>
                <Button type="submit">{isCreating ? "Creating..." : "Create"}</Button>
            </div>
        </Form>
    );
}