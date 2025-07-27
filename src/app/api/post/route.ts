import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";


export async function GET() {

    const post = await prisma.post.findMany();

    return NextResponse.json(post);
};

export async function POST(req: Request) {

    const text = await req.text();
    try {
        JSON.parse(text);
    } catch {
        return NextResponse.json({massage: ""}, {status:400});
    };
    const data = JSON.parse(text);

    if(
        !data.id || !data.title || !data.relase_year || !data.relase_month || !data.relase_day || !data.description
    ) {
        return NextResponse.json({massage: "",data}, {status:400});
    };

    const existingPost = await prisma.post.findFirst({
        where: {
            id: data.id,
            title: data.title,
            relase_year: data.relase_year,
            relase_month: data.relase_month,
            relase_day: data.relase_day,
            description: data.description
        }
    });
    if (existingPost) {
        return NextResponse.json(
            {
                error: 'پست با این مشخصات قبلاً ثبت شده است',
            },
            { status: 409 }
        );
    };
    await prisma.post.create({
        data
    });

    return NextResponse.json("");
};

export async function DELETE(req:Request) {
    const text = await req.text();
    try {
        JSON.parse(text)
    } catch {
        return NextResponse.json("", {status:400})
    };
    const data = JSON.parse(text);

    if(
        !data.id || !data.title || !data.relase_year || !data.relase_month || !data.relase_day || !data.description
    ) {
        return NextResponse.json("",{status:400})
    };

    const existingPost = await prisma.post.findFirst({
        where: {
            id: data.id,
            title: data.title,
            relase_year: data.relase_year,
            relase_month: data.relase_month,
            relase_day: data.relase_day,
            description: data.description
        }
    });

    if(!existingPost) {
        return NextResponse.json("",{status:400})
    };

    const dPost = await prisma.post.delete({
        where: {
            id: data.id,
            title: data.title,
            relase_year: data.relase_year,
            relase_month: data.relase_month,
            relase_day: data.relase_day,
            description: data.description
        }
    });


    return NextResponse.json({"massage":""}, {status:200});
};