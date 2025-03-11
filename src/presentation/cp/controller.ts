import { Request, Response } from "express";
import { CPService } from "../services/cp.service";
import { CustomError } from "../../domain/errors/custom.error";

export class CPController {

    private handleError = (res: Response, error: unknown) => {
        if (error instanceof CustomError) {
            return res.status(error.statusCode).json({ ok: false, message: error.message });
        }

        return res.status(500).json({ ok: false, message: 'Internal error server' });
    }

    constructor(private cpService: CPService) { }

    getLocationFromCp = (req: Request, res: Response) => {
        const { type, cp } = req.params;
    
        if (type !== 'mx' && type !== 'us') return res.status(400).json({ ok: false, message: 'The cp type is not correct!' });
        if (cp.length === 0) return res.status(400).json({ ok: false, message: 'Cp is missing' });

        this.cpService.getLocationFromCp(type, cp)
            .then(resp => res.json(resp))
            .catch(error => this.handleError(res, error));
    }
}