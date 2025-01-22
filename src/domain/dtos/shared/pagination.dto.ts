export class PaginationDto {
    constructor(
        public page: number,
        public limit: number
    ) { }

    static create = (object: { [key: string]: any }): [string?, PaginationDto?] => {
        const { page = 1, limit = 10 } = object;

        if (isNaN(+page) || isNaN(+limit)) {
            return ['Page and limit must be numbers'];
        }

        if (!page || !limit) {
            return ['Page and limit are missing'];
        }

        if (page < 1) {
            return ['Page must be greater or equal than 1'];
        }

        if (limit < 1) {
            return ['Limit must be greater or equal than 1']
        }

        return [undefined, new PaginationDto(+page, +limit)];
    }
}