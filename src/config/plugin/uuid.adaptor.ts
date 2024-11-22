import { validate } from "uuid"

export const UUIDAdaptor = {
    isValidUUID: (uuid: string) => {
        return validate(uuid);
    }
}