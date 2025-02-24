import { v4, validate } from "uuid"

export const UUIDAdaptor = {
    isValidUUID: (uuid: string) => {
        return validate(uuid);
    },

    generateUUID: () => {
        return v4();
    }
}