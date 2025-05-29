import { getTotalOrdersByMonth, getTotalOrdersByWeek, getTotalOrdersByYear } from "@prisma/client/sql";
import { prismaClient } from "../../data";

interface StatsByWeek {
    '_avg': {
        total: number
    },
    '_sum': {
        total: number
    },
    '_count': {
        total: number
    }
}



export class StatsService {

    private calculateChangingPercentage = (totalLastWeek?: StatsByWeek, totalThisWeek?: StatsByWeek) => {
        if (!totalLastWeek || !totalLastWeek) return;

        let percentages: { percentage: number, key: string, total?: number }[] = [];

        for (const key of Object.keys(totalLastWeek)) {
            const changing = (totalThisWeek![key as keyof StatsByWeek].total || 0) - (totalLastWeek![key as keyof StatsByWeek].total || 0);
            const percentage = totalLastWeek![key as keyof StatsByWeek].total === 0 ? totalThisWeek![key as keyof StatsByWeek].total : (changing / totalLastWeek![key as keyof StatsByWeek].total) * 100;
            percentages.push({ key, percentage });
        }

        return percentages;
    }


    private getStatsPercentageDifferenceByWeek = async (finalLastWeek: string, beginingLastWeek: string, finalThisWeek: string, beginingThisWeek: string) => {
        try {

            const totalLastWeek = await prismaClient.order.aggregate({
                _sum: {
                    total: true
                },
                _avg: {
                    total: true
                },
                _count: {
                    total: true
                },
                where: {
                    modify_at: {
                        lte: finalLastWeek
                    },
                    AND: [
                        {
                            modify_at: {
                                gte: beginingLastWeek
                            }
                        },
                        {
                            NOT: { status: 'rejected' }
                        }
                    ]
                }
            });

            const totalThisWeek = await prismaClient.order.aggregate({
                _sum: {
                    total: true
                },
                _avg: {
                    total: true
                },
                _count: {
                    total: true
                },
                where: {
                    modify_at: {
                        lte: finalThisWeek
                    },
                    AND: [
                        {
                            modify_at: {
                                gte: beginingThisWeek
                            }
                        },
                        {
                            NOT: { status: 'rejected' }
                        }
                    ]
                }
            });


            return this.calculateChangingPercentage(totalLastWeek as StatsByWeek, totalThisWeek as StatsByWeek);

        } catch (error) {
            throw error;
        }
    }

    private getStatsWeeklyChange = async (year: string) => {
        try {

            let date = new Date();

            date.setDate(date.getDate() - (7 + date.getUTCDay()));
            let beginingLastWeek = new Date(date).toISOString().replace(/T(.*)/, 'T00:00:00.00Z').replace(`${date.getFullYear()}-`, year + '-');
            date.setDate(date.getDate() + 6);
            let finalLastWeek = new Date(date).toISOString().replace(/T(.*)/, 'T23:59:59.59Z').replace(`${date.getFullYear()}-`, year + '-');;

            date = new Date();
            date.setDate(date.getDate() - date.getUTCDay());
            const beginingThisWeek = new Date(date).toISOString().replace(/T(.*)/, 'T00:00:00.00Z').replace(`${date.getFullYear()}-`, year + '-');
            date.setDate(date.getDate() + 6);
            const finalThisWeek = new Date(date).toISOString().replace(/T(.*)/, 'T23:59:59.59Z').replace(`${date.getFullYear()}-`, year + '-');

            return await this.getStatsPercentageDifferenceByWeek(finalLastWeek, beginingLastWeek, finalThisWeek, beginingThisWeek);





        } catch (error) {
            throw error;
        }
    }

    getStatsOrders = async (year: string) => {
        try {


            const stats = await prismaClient.order.aggregate({
                _sum: {
                    total: true
                },
                _avg: {
                    total: true,
                },
                _count: {
                    total: true
                },
                where:
                {
                    modify_at: {
                        lte: `${year}-12-31T23:59:59.59Z`
                    },
                    AND: [
                        {
                            modify_at: {
                                gte: `${year}-01-01T00:00:00.000Z`
                            }
                        },
                        {
                            status: 'confirm'
                        }
                    ]

                }
            });

            let percentages;
            percentages = await this.getStatsWeeklyChange(year);


            const incomesStats = percentages?.map(percentage => ({
                ...percentage,
                total: stats[percentage.key as keyof StatsByWeek].total

            }));

            return {
                ok: true,
                incomesStats

            };

        } catch (error) {
            throw error;
        }
    }


    getTotalOrdersByWeek = async (year: string) => {
        try {
            let weeksByYear = [];

            const totals = await prismaClient.$queryRawTyped(getTotalOrdersByWeek(+year));

            for (let index = 0; index < 52; index++) {
                weeksByYear.push(0);
            }

            totals.forEach(({ date_part, total }) => weeksByYear[--date_part!] = total);

            return {
                ok: true,
                totalsByWeek: weeksByYear
            }

        } catch (error) {
            throw error;
        }
    }

    getTotalOrdersByMonth = async (year: string) => {
        try {
            let monthsByYear = [];

            const totals = await prismaClient.$queryRawTyped(getTotalOrdersByMonth(+year));

            for (let index = 0; index < 12; index++) {
                monthsByYear.push(0);
            }

            totals.forEach(({ date_part, total }) => monthsByYear[--date_part!] = total);

            return {
                ok: true,
                totalsByMonth: monthsByYear
            }

        } catch (error) {
            throw error;
        }
    }

    getTotalOrdersByYear = async () => {
        try {


            const totals = await prismaClient.$queryRawTyped(getTotalOrdersByYear());



            return {
                ok: true,
                totalsByYear: totals
            }

        } catch (error) {
            throw error;
        }
    }

}