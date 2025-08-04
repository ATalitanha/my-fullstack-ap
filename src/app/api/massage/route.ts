import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {

    const mass = await prisma.message.findMany();

    return NextResponse.json(mass);
};

export async function POST(req: Request) {
    try {
        const mass = await req.text();
        const data = JSON.parse(mass);

        const createdMessage = await prisma.message.create({
            data,
        });

        return NextResponse.json({ message: "پیام ثبت شد", data: createdMessage }, { status: 201 });
    } catch (error) {
        console.error("خطا در ذخیره پیام:", error);
        return NextResponse.json({ error: "خطا در پردازش درخواست" }, { status: 500 });;
    };
};

export async function DELETE(req: Request) {
  const mass = await req.text();
  const data = JSON.parse(mass);

  try {
    if (data.deleteAll === true) {
      // حذف همه پیام‌ها
      await prisma.message.deleteMany({});
    } else if (data.id) {
      // حذف پیام مشخص شده
      await prisma.message.delete({
        where: { id: data.id },
      });
    } else {
      return NextResponse.json(
        { message: "پارامتر id یا deleteAll لازم است" },
        { status: 400 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { message: "خطا در حذف پیام" },
      { status: 404 }
    );
  }

  return NextResponse.json("", { status: 201 });
}