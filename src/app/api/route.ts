import { NextRequest } from "next/server";
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request:NextRequest) {
    let param = request.nextUrl.searchParams.get('secret');
    console.log(param);
    let echos = (param && param !== 'null') ? await getSecretEchos(param) : await getPublicEcho();
    return Response.json(echos);
}

async function getPublicEcho() {
  return await prisma.echo.findMany( {take: 1, where: { secret: null }, orderBy: { createdAt: 'desc' } } );
}

async function getSecretEchos(param:string) {
  return await prisma.echo.findMany( {take: 5, where: { secret: param }, orderBy: { createdAt: 'desc' } } );
}