import {ChangeLog} from "@/lib/type"

export function getChangeLogs(): ChangeLog[] {
    return [
        {
            version: "1.2.0",
            changes: ["Added dark mode support", "Improved performance by 30%", "Fixed navigation issues on mobile devices"],
        },
        {
            version: "1.1.0",
            changes: [
                "Redesigned dashboard interface",
                "Added export to CSV functionality",
                "Fixed bug with date picker component",
            ],
        },
        {
            version: "1.0.0",
            changes: ["Initial release", "Core functionality implemented", "Basic reporting features"],
        },
    ];
};