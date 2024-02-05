'use client'
import { Dispatch, FormEvent, FormEventHandler, SetStateAction, useEffect, useState } from 'react';
import { Echo, PrismaClient } from '@prisma/client';
import { getQueryString } from './functions';
const dayjs = require('dayjs')

const prisma = new PrismaClient();

export default function Home() {

    const [ echos, setEchos ] = useState<Echo[]>([]);
    const [ secret, setSecret ] = useState<string|null>(null);
    const [ loaded, setLoaded ] = useState(false);
    const [ secretCodeText, setSecretCodeText ] = useState('');

    useEffect(() => {
        setSecret(getQueryString('secret'));
        setLoaded(true);
    }, []);

    useEffect(() => {
        window.addEventListener('popstate', readdPoppedState);

        return () => {
            window.removeEventListener('popstate', readdPoppedState);
        };
    }, []);

    function readdPoppedState(event:PopStateEvent) {
        if (!event.state) return;
        setSecret(event.state['secretCodeText']);
    }

    useEffect(() => {
        if(!loaded) return;
        (async function() {
            let echos:Echo[] = await (await fetch(`/api?secret=${secret}`)).json();
            setEchos(echos);
        })();

        document.title = (secret && secret.length > 0) ? `ReQe - Echos - ${secret}` : 'ReQe - Latest Public Echo';
        
        if(secret && secret.length > 0) {
            setSecretCodeText(secret);
        }

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

    function UpdateSecret(event:FormEvent<HTMLFormElement>) {
        event.preventDefault(); event.stopPropagation();
        if(secretCodeText === secret) return;

        const url = new URL(window.document.URL);

        if(secretCodeText.length > 0) {
            url.searchParams.set('secret', secretCodeText);
        } else {
            url.searchParams.delete('secret')
        }

        window.history.pushState({secretCodeText: secretCodeText}, '', url)
        setSecret(secretCodeText);
    }

    return (
        <main className='flex min-h-screen flex-col items-center p-24'>
            <SiteTitle />
            <SecretEchoSearch secretCodeText={secretCodeText} setSecretCodeText={setSecretCodeText} updateSecret={UpdateSecret} />
            <EchoTitle secret={secret} loading={!loaded} />
            <div className='flex flex-col gap-10'>
                {
                    echos.map(echo => {
                        return (
                            <div className='w-[800px] shadow-md border-2 p-10 flex flex-col text-ellipsis overflow-hidden' key={echo.id}>
                                <div className='w-full flex justify-between -mt-6 font-semibold'>
                                    <div>{echo.id}</div>
                                    <div>{dayjs(echo.createdAt).format('DD/MM/YYYY hh:mm a') }</div>
                                </div>
                                <pre className=''>{getEchoJSON(echo)}</pre>
                            </div>
                        );
                    })
                }
            </div>
        </main>
    );
}

function SiteTitle() {
    return (
        <>
            <h1 className='text-4xl mb-1'>Request Echo</h1>
            <sub>A REST echo service with a memory.</sub>
        </>
    );
}

function SecretEchoSearch({secretCodeText, setSecretCodeText, updateSecret}:{secretCodeText:string; setSecretCodeText: Dispatch<SetStateAction<string>>; updateSecret:any}) {
    return(
        <div className='mt-5'>
            <div>Secret Code</div>
            <form className='flex justify-around items-center' onSubmit={updateSecret}>
                <input className='mr-2' type='text' value={secretCodeText} onChange={({ target: { value } }) => setSecretCodeText(value)} />
                <button type='submit'>Save</button>
            </form>
        </div>
    )
}

function EchoTitle({secret, loading}:{secret:string|null, loading:boolean}) {
    if(loading) return <h2 className='mt-5 text-lg'>Loading Echos...</h2>;
    if(!secret) return <h2 className='mt-5 text-lg'>Latest Public Echo</h2>;

    return <h2 className='mt-5 text-lg'>Secret &apos;{secret}&apos; Echos</h2>
}