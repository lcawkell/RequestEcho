import Image from "next/image";

export default function Home() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
            <h1>Project Steps:</h1>
            <ul>
                <li>Take in a get / post / put / delete and echo it back</li>
                <li>Store the requests in a DB and show the last 10 request</li>
                <li>Add the ability to create unqiue request urls so request logs can be semi-private</li>
            </ul>
        </main>
    );
}
