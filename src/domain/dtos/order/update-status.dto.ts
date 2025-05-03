import { UUIDAdaptor } from "../../../config/plugin";

export class UpdateStatusDto {

    constructor(
        public order_id: string,
        public status: any
    ) { }

    static create(object: { [key: string]: any }): [string?, UpdateStatusDto?] {
        const { order_id, status } = object;

        const statusValid = ['confirm', 'on_way', 'complete', 'rejected'];

        if (!UUIDAdaptor.isValidUUID(order_id)) return ['The order id is not valid'];
        if (!statusValid.includes(status)) return ['The status is not valid'];

        return [undefined, new UpdateStatusDto(order_id, status)];
    }
}