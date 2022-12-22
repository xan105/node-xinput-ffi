export function listDevices(): Promise<{
    name: string;
    manufacturer: string;
    vendorID: number;
    productID: number;
    xinput: boolean;
    interfaces: string[];
    guid: string[];
}[]>;
