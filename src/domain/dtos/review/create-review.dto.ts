import { UUIDAdaptor } from "../../../config/plugin";

export class CreateReviewDto {

    constructor(
        public grade: number,
        public comment: string,
        public customer_id: string,
        public furniture_id: string,
        public title: string
    ) { }

    static create(object: { [id: string]: any }): [string?, CreateReviewDto?] {
        const { grade, comment, customer_id, furniture_id, title } = object;

        if (!grade) return ['The grade is missing'];

        if (grade < 0 || grade > 5) return ['The grade is not valid'];

        if (!comment) return ['The comment is missing'];

        if (!UUIDAdaptor.isValidUUID(customer_id)) return ['The customer_id is not valid'];

        if (!UUIDAdaptor.isValidUUID(furniture_id)) return ['The furniture_fk is not valid'];

        if (!title) return ['The title is missing'];

        return [undefined, new CreateReviewDto(+grade, comment, customer_id, furniture_id, title)];
    }
}