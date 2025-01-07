export interface Clinic {
    id: number;
    name: string;
    pincode: string;
    years: number;
    language: string;
    province: string;
    type: string;
    territory: string;
    lat: number;
    lng: number;
    contact: number;
    address: {
        street: string;
        city: string;
        state: string;
        country: string;
        postalCode: string;
    }; 
}
 