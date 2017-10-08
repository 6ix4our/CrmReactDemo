import Entity from '../xrm-models/Entity';
import EntityReference from '../xrm-models/EntityReference';
import { IEntitySchema } from '../xrm-models/IEntitySchema';
import { XrmRequest, IRequestOptions } from './XrmRequest';
import { IResponseProperty, ResponseValue, ValidateResponse } from './XrmResponse';
import { Collection } from '../xrm-models/DataTypes';

export { IRequestOptions, QueryBuilder } from './XrmRequest';

export interface IServiceOptions
{
    EndpointUrl: string;
    Headers?: Collection<string>;
}

export class XrmClient
{
    private static async ParseResponse<T extends IResponseProperty<ResponseValue> | ResponseValue>(response: Response)
    {
        if (response.status === 204)
            return;
        else
            return await response.json() as T;
    }

    private static async ParseEntityResponse(response: Response, schema: IEntitySchema)
    {
        return await XrmClient.ParseResponse<object>(response)
            .then(result =>
            {
                if (!result)
                    return;

                return ConvertObjectToEntity(schema, result);
            });
    }

    private static async ParseEntitiesResponse(response: Response, schema: IEntitySchema)
    {
        return await XrmClient.ParseResponse<IResponseProperty<Array<object>>>(response)
            .then(result =>
            {
                if (!result)
                    return;

                let entities = result.value.map(rawObject => ConvertObjectToEntity(schema, rawObject));

                return entities;
            });
    }

    private static async ParseEntityReferenceResponse(response: Response, schema: IEntitySchema)
    {
        return await XrmClient.ParseResponse<object>(response)
            .then(result => 
            {
                if (!result)
                    return;

                return ConvertObjectToEntityReference(schema, result);
            });
    }

    constructor(private _serviceOptions: IServiceOptions) 
    {
        console.group('XrmClient');

        console.info('Creating client instance');
        _serviceOptions.Headers = _serviceOptions.Headers || {};
        _serviceOptions.Headers['Accept'] = _serviceOptions.Headers['Accept'] || 'application/json';
        _serviceOptions.Headers['OData-MaxVersion'] = _serviceOptions.Headers['OData-MaxVersion'] || '4.0';
        _serviceOptions.Headers['OData-Version'] = _serviceOptions.Headers['OData-Version'] || '4.0';
        console.info(_serviceOptions);
        console.groupEnd();
    }

    public async Execute(requestOptions: IRequestOptions)
    {
        console.group('XrmClient');
        
        let request = new XrmRequest(requestOptions);

        let requestInit = {
            method: request.Method,
            headers: new Headers(request.Headers),
            credentials: 'same-origin'
        } as RequestInit;

        if (request.SerializedBody)
            requestInit.body = request.SerializedBody;

        console.info('Sending request');
        return await fetch(`${this._serviceOptions.EndpointUrl}/${request.SerializedQuery}`, requestInit)
            .then(ValidateResponse)
            .then(response => {
                console.info(response);

                console.groupEnd();
                return response;
            });
    }

    public async ExecuteForProperty<T extends ResponseValue>(requestOptions: IRequestOptions)
    {
        return await this.Execute(requestOptions)
            .then(response => XrmClient.ParseResponse<IResponseProperty<T>>(response));
    }

    public async ExecuteForEntity(schema: IEntitySchema, requestOptions: IRequestOptions)
    {
        return await this.Execute(requestOptions)
            .then(response => XrmClient.ParseEntityResponse(response, schema));
    }

    public async ExecuteForEntityCollection(schema: IEntitySchema, requestOptions: IRequestOptions)
    {
        return await this.Execute(requestOptions)
            .then(response => XrmClient.ParseEntitiesResponse(response, schema));
    }

    public async ExecuteForEntityReference(schema: IEntitySchema, requestOptions: IRequestOptions)
    {
        return await this.Execute(requestOptions)
            .then(response => XrmClient.ParseEntityReferenceResponse(response, schema));
    }
}

export const ConvertObjectToEntityReference = (schema: IEntitySchema, rawObject: object) =>
{
    console.group('ConvertObjectToEntityReference');
    
    if (rawObject['Id'])
    {
        let entityReference = new EntityReference(schema, rawObject['Id']);
        console.info(entityReference);

        console.groupEnd();
        return entityReference;
    }

    console.warn('Could not convert');
    console.warn(rawObject);
    console.groupEnd();
    return;
};

export const ConvertObjectToEntity = (schema: IEntitySchema, rawObject: object) =>
{
    console.group('ConvertObjectToEntity');

    let entity = new Entity(schema);
    
    console.info('Parsing through object');
    console.info(rawObject);
    for (const valueName of Object.keys(rawObject))
    {
        let value = rawObject[valueName];
        let annotationSplit = valueName.split('@');

        let referenceName = /^_.*_value$/.test(annotationSplit[0]) 
            ? annotationSplit[0].slice(1, -6)
            : annotationSplit[0];

        if (annotationSplit.length > 1)
        {
            if (annotationSplit[1] === FormattedValueSuffix)
                entity.FormattedAttributes[referenceName] = value;
            else if (annotationSplit[1] === LogicalLookupName)
                entity.LookupLogicalNames[referenceName] = value;

            continue;
        }
        
        let referenceSchema = schema.EntityReferenceSchemas[referenceName];
        
        if (referenceSchema !== undefined)
        {
            entity.Attributes[referenceName] = new EntityReference(referenceSchema, value);
            
            continue;
        }

        entity.Attributes[referenceName] = value;
    }

    console.info(entity);
    console.groupEnd();
    return entity;
};

const FormattedValueSuffix = 'OData.Community.Display.V1.FormattedValue';
const LogicalLookupName = 'Microsoft.Dynamics.CRM.lookuplogicalname';
