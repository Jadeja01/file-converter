import { NextResponse } from "next/server";

export default async function handler() {
    return NextResponse.json({
        success: false,
        message: "This feature is not implemented yet."
    })
};
