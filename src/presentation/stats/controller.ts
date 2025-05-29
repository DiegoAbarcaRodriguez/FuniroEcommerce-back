import { Request, Response } from "express";
import { CustomError } from "../../domain/errors/custom.error";
import { StatsService } from "../services/stats.service";

export class StatsController {

    constructor(private statsService: StatsService) { }


    handleError = (res: Response, error: unknown) => {

        if (error instanceof CustomError) {
            return res.status(error.statusCode).json({ ok: false, message: error.message });
        }

        console.log(error);

        return res.status(500).json({ ok: false, message: 'Internal error server' });
    }

    getStatOrders = (req: Request, res: Response) => {

        const { year } = req.query;

        if (!year || isNaN(+year)) {
            return res.status(400).json({ ok: false, message: 'The entered year is not valid!' });
        }


        this.statsService.getStatsOrders(year as string)
            .then(resp => res.json(resp))
            .catch(error => this.handleError(res, error));

    }


    getTotalOrdersByWeek = (req: Request, res: Response) => {
        const { year } = req.query;

        if (!year || isNaN(+year)) {
            return res.status(400).json({ ok: false, message: 'The entered year is not valid!' });
        }

        this.statsService.getTotalOrdersByWeek(year as string)
            .then(resp => res.json(resp))
            .catch(error => this.handleError(res, error));


    }

    getTotalOrdersByMonth = (req: Request, res: Response) => {
        const { year } = req.query;

        if (!year || isNaN(+year)) {
            return res.status(400).json({ ok: false, message: 'The entered year is not valid!' });
        }

        this.statsService.getTotalOrdersByMonth(year as string)
            .then(resp => res.json(resp))
            .catch(error => this.handleError(res, error));


    }

    getTotalOrdersByYear = (req: Request, res: Response) => {



        this.statsService.getTotalOrdersByYear()
            .then(resp => res.json(resp))
            .catch(error => this.handleError(res, error));


    }



}