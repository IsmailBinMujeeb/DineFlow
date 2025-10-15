import { AppSidebar } from "@/components/app-sidebar"
import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import { DataTable } from "@/components/data-table"
import { SectionCards } from "@/components/section-cards"
import { SiteHeader } from "@/components/site-header"
import {
    SidebarInset,
    SidebarProvider,
} from "@/components/ui/sidebar"
import { useEffect, useState } from "react"

export default function Dashboard() {
    const [topItems, setTopItems] = useState([]);
    const [daily, setDaily] = useState([]);
    const [sales, setSales] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                setIsLoading(true);
                setError(null);

                const token = localStorage.getItem('access-token');
                const headers = {
                    Authorization: `Bearer ${token}`,
                };

                // Fetch top items
                const topItemsResponse = await fetch(
                    `${import.meta.env.VITE_API_URL}analytics/top-items`,
                    { headers }
                );

                if (!topItemsResponse.ok) {
                    throw new Error(`Failed to fetch top items: ${topItemsResponse.status}`);
                }

                const topItemsData = await topItemsResponse.json();
                setTopItems(topItemsData.items);
                console.log(topItemsData.items)
                // Fetch daily data
                const dailyDataResponse = await fetch(
                    `${import.meta.env.VITE_API_URL}analytics/daily`,
                    { headers }
                );

                if (dailyDataResponse.status === 404) {
                    setDaily([]);
                } else if (!dailyDataResponse.ok) {
                    throw new Error(`Failed to fetch daily data: ${dailyDataResponse.status}`);
                } else {
                    const dailyData = await dailyDataResponse.json();
                    console.log(dailyData.data);
                    setDaily(dailyData.data);
                }

                const salesResponse = await fetch(
                    `${import.meta.env.VITE_API_URL}analytics/sales?daysAgo=7`,
                    { headers }
                );

                if (salesResponse.status === 404) {
                    setSales([]);
                } else if (!salesResponse.ok) {
                    console.log(salesResponse)
                    throw new Error(`Failed to fetch sales data: ${salesResponse.status}`);
                } else {
                    const salesData = await salesResponse.json();
                    console.log(salesData.revenue);
                    setSales(salesData.revenue);
                }
            } catch (err) {
                console.error('Error fetching analytics:', err);
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchAnalytics();
    }, []);

    const totalRevenue = daily.reduce((sum, order) => sum + (order.grandTotal || 0), 0);
    const totalCustmors = daily.length;
    const ordersPending = daily.filter(order => order.status === 'pending').length
    const ordersCanceled = daily.filter(order => order.status === 'cancel').length

    if (isLoading) {
        return (
            <SidebarProvider
                style={{
                    "--sidebar-width": "calc(var(--spacing) * 72)",
                    "--header-height": "calc(var(--spacing) * 12)",
                }}
                className="dark text-zinc-50"
            >
                <AppSidebar variant="inset" />
                <SidebarInset>
                    <SiteHeader />
                    <div className="flex flex-1 items-center justify-center">
                        <p className="text-muted-foreground">Loading analytics...</p>
                    </div>
                </SidebarInset>
            </SidebarProvider>
        );
    }

    if (error) {
        return (
            <SidebarProvider
                style={{
                    "--sidebar-width": "calc(var(--spacing) * 72)",
                    "--header-height": "calc(var(--spacing) * 12)",
                }}
                className="dark text-zinc-50"
            >
                <AppSidebar variant="inset" />
                <SidebarInset>
                    <SiteHeader />
                    <div className="flex flex-1 items-center justify-center">
                        <div className="text-center">
                            <p className="text-destructive mb-2">Error loading analytics</p>
                            <p className="text-sm text-muted-foreground">{error}</p>
                        </div>
                    </div>
                </SidebarInset>
            </SidebarProvider>
        );
    }

    return (
        <SidebarProvider
            style={{
                "--sidebar-width": "calc(var(--spacing) * 72)",
                "--header-height": "calc(var(--spacing) * 12)",
            }}
            className="dark text-zinc-50"
        >
            <AppSidebar variant="inset" />
            <SidebarInset>
                <SiteHeader />
                <div className="flex flex-1 flex-col">
                    <div className="@container/main flex flex-1 flex-col gap-2">
                        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                            <SectionCards revenue={totalRevenue} totalCustmors={totalCustmors} pending={ordersPending} canceled={ordersCanceled} />
                            <div className="px-4 lg:px-6">
                                <ChartAreaInteractive sales={sales} />
                            </div>
                            <DataTable data={topItems} />
                        </div>
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}