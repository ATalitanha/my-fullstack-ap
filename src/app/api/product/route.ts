import { NextResponse } from "next/server";
import prodct from '../../../../lib/db'

export async function GET() {
    return NextResponse.json(prodct)
};

