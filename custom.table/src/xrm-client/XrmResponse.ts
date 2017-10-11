export type ResponseValue = boolean | number | string | Date | object | Array<object>;

export interface IResponseProperty<T extends ResponseValue>
{
    value: T;
}

export const ValidateResponse = (response: Response) =>
{
    switch (response.status)
    {
        case 200:
        case 204:
        case 304:
            return response;

        default:
            throw new ServiceError(response);
    }
};

class ServiceError extends Error
{
    constructor(public Response: Response)
    {
        super(Response.statusText);
        console.error(Response);
    }
}