interface cardProps {
    title: string,
    content: string | null;
    id: string;
    columnId: string;
    order: number;
    // nextOrder: number;
    // previousOrder: number;
}

export default function Card({ title }: cardProps) {
    return (
        <li>
            <div
                draggable

            >
                <h3>
                    {title}
                </h3>
            </div>
        </li>
    )
}