"use client"
import { useEffect, useState } from "react";
import { Echo, PrismaClient } from '@prisma/client';
import { getQueryString } from "./functions";
const dayjs = require('dayjs')

const prisma = new PrismaClient();

export default function Home() {

    const [ echos, setEchos ] = useState<Echo[]>([]);
    const [ secret, setSecret ] = useState<string|null>(null);
    const [ loaded, setLoaded ] = useState(false);

    useEffect(() => {
        setSecret(getQueryString('secret'));
        setLoaded(true);
    }, []);

    useEffect(() => {
        if(!loaded) return;
        (async function() {
            let echos:Echo[] = await (await fetch(`/api?secret=${secret}`)).json();
            setEchos(echos);
        })();
    }, [secret, loaded]);

    function getEchoJSON(echo:Echo) {
        return JSON.stringify({
            args:JSON.parse(echo.args),
            form: JSON.parse(echo.form),
            headers: JSON.parse(echo.headers),
            url: echo.url,
            json: JSON.parse(echo.json),
            data: JSON.parse(echo.data)
        }, null, 2);
    }

    console.log(echos);

    return (
        <main className="flex min-h-screen flex-col items-center p-24">
            <h1>Project Steps:</h1>
            <ul>
                <li>Take in a get / post / put / delete and echo it back</li>
                <li>Store the requests in a DB and show the last request</li>
                <li>Add the ability to create unqiue request urls so request logs can be semi-private</li>
            </ul>
            <div className="flex flex-col p-10 gap-10">
                {
                    echos.map(echo => {
                        return (
                            <div className="w-[800px] shadow-md border-2 p-10 flex flex-col text-ellipsis overflow-hidden" key={echo.id}>
                                <div className="w-full flex justify-between -mt-6 font-semibold">
                                    <div>{echo.id}</div>
                                    <div>{dayjs(echo.createdAt).format('DD/MM/YYYY HH:mm a') }</div>
                                </div>
                                <pre className="">{getEchoJSON(echo)}</pre>
                            </div>
                        );
                    })
                }
            </div>
        </main>
    );
}
