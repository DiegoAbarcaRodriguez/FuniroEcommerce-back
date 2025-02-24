import { UUIDAdaptor } from "../../../config/plugin";

export class CreateReviewDto {

    constructor(
        public grade: number,
        public comment: string,
        public customer_fk: string,
        public furniture_fk: string,
    ) { }

    static create(object: { [id: string]: any }): [string?, CreateReviewDto?] {
        const { grade, comment, customer_fk, furniture_fk } = object;

        if (!grade) return ['The grade is missing'];

        if (grade < 0 || grade > 5) return ['The grade are not valid'];

        if (!comment) return ['The comment is missing'];

        if (!UUIDAdaptor.isValidUUID(customer_fk)) return ['The customer_fk is not valid'];

        if (!UUIDAdaptor.isValidUUID(furniture_fk)) return ['The furniture_fk is not valid'];

        return [undefined, new CreateReviewDto(grade, comment, customer_fk, furniture_fk)];
    }
}