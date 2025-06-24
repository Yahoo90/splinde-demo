import { Section } from "./types";

const demoData: Section = {
    name: "Annual Report",
    children: [
        {
            name: "Sales",
            children: [
                {
                    name: "Q1 Sales",
                    sum: 120,
                    note: "Strong performance in North America",
                },
                {
                    name: "Q2 Sales",
                    sum: 140,
                    note: "European market showed slight growth",
                },
                {
                    name: "Q3 Sales",
                    sum: 110,
                    note: "Asia-Pacific underperformed expectations",
                },
                {
                    name: "Q4 Sales",
                    sum: 130,
                    note: "Holiday promotions boosted revenue",
                },
            ],
        },
        {
            name: "Marketing",
            children: [
                {
                    name: "Digital Campaigns",
                    sum: 180,
                    note: "Social media ads had the highest ROI",
                },
                {
                    name: "Event Sponsorships",
                    sum: 120,
                    note: "Sponsored 5 major industry events",
                },
            ],
        },
        {
            name: "R&D",
            children: [
                {
                    name: "New Product Development",
                    sum: 150,
                    note: "Three prototypes developed and tested",
                },
                {
                    name: "Innovation Lab",
                    sum: 100,
                    note: "Ongoing AI-based experimentation",
                },
            ],
        },
        {
            name: "Operations",
            children: [
                {
                    name: "HR",
                    children: [
                        {
                            name: "HR tool",
                            sum: 20,
                            note: "Yearly cost to manage roles and applicants"
                        }
                    ]
                },
                {
                    name: "Logistics",
                    sum: 90,
                    note: "Improved efficiency through route optimization",
                },
                {
                    name: "Customer Support",
                    sum: 60,
                    note: "Reduced average resolution time by 15%",
                },
            ],
        },
    ],
};

export { demoData };