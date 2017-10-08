import Entity from '../xrm-models/Entity';
import { Collection, DataItem } from '../xrm-models/DataTypes';

export interface IRequestOptions
{
    Method: 'get' | 'post' | 'put' | 'patch' | 'delete';
    Query: QueryBuilder;
    Body?: DataItem | Entity;
    Headers?: Collection<string>;
}

export class QueryBuilder
{
    private _parameters: Collection<string> = {};

    constructor(public Path: string) {}

    public AddParameter(paramName: string, paramValue: string)
    {
        console.group('QueryBuilder');

        console.info(`Adding parameter "${paramName}" with value "${paramValue}"`);
        this._parameters[paramName] = paramValue;

        console.groupEnd();
        return this;
    }

    public Build()
    {
        console.group('QueryBuilder');

        console.info('Building path');
        let parameters = Object.keys(this._parameters).map(key => `$${key}=${this._parameters[key]}`);
        let queryPath = `${this.Path}?${parameters.join('&')}`;
        console.info(`Built path "${queryPath}"`);

        console.groupEnd();
        return queryPath;
    }
}

export class XrmRequest implements IRequestOptions
{
    public Query: QueryBuilder;
    public Method: 'get' | 'post' | 'put' | 'patch' | 'delete';
    public Body?: DataItem | Entity;
    public Headers?: Collection<string>;
    public SerializedBody?: string;
    public SerializedQuery?: string;

    constructor(requestOptions: IRequestOptions)
    {
        console.group('XrmRequest');

        console.group('IRequestOptions read');
        for (const requestProperty of Object.keys(requestOptions))
        {
            console.info(`Setting property "${requestProperty}"`);
            console.info(requestOptions[requestProperty]);
            this[requestProperty] = requestOptions[requestProperty];
        }
        console.groupEnd();

        console.info('Serializing Body');
        if (this.Body)
            this.SerializedBody = JSON.stringify(this.Body);

        console.info('Serializing Query');
        this.SerializedQuery = this.Query.Build();

        console.info('Validating request headers');
        ValidateRequestHeaders(this);

        console.info(this);
        console.groupEnd();
    }
}

const ValidateRequestHeaders = (requestOptions: XrmRequest) =>
{
    if (requestOptions.Method !== 'get' && requestOptions.Method !== 'delete')
    {
        requestOptions.Headers = requestOptions.Headers || {};
        requestOptions.Headers['Content-Type'] = requestOptions.Headers['Content-Type'] 
            || 'application/json; charset=utf-8';
        requestOptions.Headers['Content-Length'] = requestOptions.Headers['Content-Length']
            || `${requestOptions.SerializedBody && requestOptions.SerializedBody.length}` || '0';
    }
};
