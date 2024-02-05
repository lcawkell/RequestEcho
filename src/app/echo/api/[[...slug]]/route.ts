import { NextRequest, NextResponse } from "next/server";
import { URLSearchParams } from "url";
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request:NextRequest) {
  return await doRequest(request);
}

export async function POST(request:NextRequest) {
  return await doRequest(request);
}

async function doRequest(request: NextRequest) {
  const form = await parseFormData(request.clone())
  const headers = await parseHeaders(request);
  const { json, data } = await parseBody(request);
  const url = request.url;
  const args = await parseArgs(request);
  const secret = request.nextUrl.searchParams.get('secret') ;

  let response = {
    args, data, form, headers, json, url
  };

  await prisma.echo.create({
    data: {
      args: JSON.stringify(args),
      form: JSON.stringify(form),
      headers: JSON.stringify(headers),
      url,
      json: JSON.stringify(json),
      data: JSON.stringify(data),
      secret: (secret && secret !== '') ? secret : null
    }
  });

  return NextResponse.json(response);
}

async function parseFormData(request:Request) {
  try {
    const formData:FormData = await request.formData()
    var object:any = {};
    formData.forEach(function(value, key){
        object[key] = value;
    });
    return object;
  }
  catch(e) {
    return {};
  }
}

async function parseHeaders(request:NextRequest) {
  try {
    const headers:Headers = request.headers;
    var object:any = {};
    headers.forEach(function(value, key){
        object[key] = value;
    });
    return object;
  }
  catch(e) {
    return {};
  }
}

async function parseArgs(request:NextRequest) {
  try {
    const searchParams:URLSearchParams = request.nextUrl.searchParams;
    var object:any = {};
    searchParams.forEach(function(value, key){
        object[key] = value;
    });
    return object;
  }
  catch(e) {
    return {};
  }
}

async function parseBody(request: Request) {
  let contentType = request.headers.get("Content-Type");
  
  if(contentType === 'text/plain') {
    return processAsText(request);
  }

  if(contentType?.indexOf('multipart/form-data') !== -1) {
    return {json: null, data: {}};
  }
  
  return tryProcessAsJSON(request);
}

async function tryProcessAsJSON(request: Request) {
  try {
    let data = {};
    let json:{}|null = {};

    json = await parseJson(request.clone());
    data = await parseJson(request.clone());

    return { json, data };
  } catch(e) {
    return processAsText(request.clone());
  }
}

async function processAsText(request: Request) {
  try {
    let data = {};
    let json:{}|null = {};

    json = null;
    data = await parseData(request);

    return { json, data };
  } catch(e) {
    return {json:null, data: {}};
  }
}

async function parseJson(request: Request) {
    return await request.json();
}

async function parseData(request: Request) {
  try {
    return await request.text();
  } catch(e) {
    console.log(e);
    return {};
  }
}