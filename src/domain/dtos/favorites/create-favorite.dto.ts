import { UUIDAdaptor } from "../../../config/plugin";

export class CreateFavoriteDto {

    constructor(
        public customer_id: string,
        public furniture_id: string
    ) { }

    static create(object: { [key: string]: any }): [string?, CreateFavoriteDto?] {
        const { customer_id, furniture_id } = object;

        if (!customer_id) return ['customer_id is missing'];
        if (!furniture_id) return ['furniture_id is missing'];
        if (!UUIDAdaptor.isValidUUID(customer_id)) return ['customer_id is not valid'];
        if (!UUIDAdaptor.isValidUUID(furniture_id)) return ['furniture_id is not valid'];

        return [undefined, new CreateFavoriteDto(customer_id, furniture_id)]
    }
}