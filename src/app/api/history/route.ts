import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
    try {
        const history = await prisma.calculation.findMany({
            orderBy: { createdAt: "desc" },
            take: 10,
        });
        return NextResponse.json(history, { status: 200 });
    } catch (error) {
        console.error("Error fetching history:", error);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    };
};

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { expression, result } = body;

        if (!expression || result === undefined) {
            return NextResponse.json({ success: false, error: "expression and result are required" }, { status: 400 });
        }

        const created = await prisma.calculation.create({
            data: {
                expression,
                result,
            },
        });

        return NextResponse.json({ success: true, data: created });
    } catch (error) {
        console.error(error);
        console.error("Error creating calculation:", error);
        return NextResponse.json({ success: false, error: 'Failed to create calculation' }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest) {
    try {
        await prisma.calculation.deleteMany();

        return NextResponse.json({ success: true, message: "Calculation deleted" });
    } catch (error) {
        console.error("Error deleting calculation:", error);
        return NextResponse.json(
            { success: false, error: "Failed to delete calculation" },
            { status: 500 }
        );
    }
}