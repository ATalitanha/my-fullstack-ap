import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';


export async function GET() {

    const users = await prisma.user.findMany();

    return NextResponse.json(users);


};

export async function POST(req: Request) {
    const text = await req.text();
    const data = JSON.parse(text);

    if (!data.name || !data.age) {
        return NextResponse.json(
            { error: 'نام و سن الزامی هستند' },
            { status: 400 }
        );
    }

    console.log('Received data:', data);

    let users = await prisma.user.findMany();
    const existingUser = await prisma.user.findFirst({
        where: {
            id: data.id,
            name: data.name,
            age: Number(data.age),
        }
    });

    if (existingUser) {
        return NextResponse.json(
            {
                error: 'کاربر با این مشخصات قبلاً ثبت شده است',
            },
            { status: 409 }
        );
    }



    await prisma.user.create({
      data
    });




    return NextResponse.json(
        { message: 'داده با موفقیت دریافت شد', users, data },
        { status: 201 }
    );

}

export async function DELETE(req: Request) {
    const text = await req.text();
    const data = JSON.parse(text);

    if (!data.id) {
      return NextResponse.json(
        { error: 'شناسه کاربر (id) الزامی است' },
        { status: 400 }
      );
    };
    try {
       const user = await prisma.user.delete({
        where: {
            id:data.id,
            name: data.name,
            age: Number(data.age)
        }
    }); 
    } catch {
        return NextResponse.json("user not found", {status:400})
    }
    

    const nUser = await prisma.user.findMany();

    return NextResponse.json({massage:"",nUser},{status:200});
};