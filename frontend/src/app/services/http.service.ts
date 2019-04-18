import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject, Observable } from 'rxjs';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { HttpRequest } from '../models/http.request';
import { HttpResponse } from '../models/http.response';

enum ContentType {
    FORM = 'application/x-www-form-urlencoded',
    JSON = 'application/json',
    TEXT = 'text/plain'
}

enum RequestMethod {
    GET = "GET",
    POST = "POST",
    PUT = "PUT",
    DELETE = "DELETE",
    OPTIONS = "OPTIONS",
    HEAD = "HEAD",
    PATCH = "PATCH"
}

@Injectable({
    providedIn: 'root',
})
export class HttpService {

    private CHARSET = 'UTF-8';
    private CONTENT_TYPE = ContentType.FORM;
    private HEADERS = new HttpHeaders({ 'Content-Type': this.CONTENT_TYPE + this.CHARSET });
    private SETTINGS_URL = '/assets/data/http.requests.json';
    private requests: Array<HttpRequest> = new Array<HttpRequest>();
    private staticResponses: Array<HttpResponse<JSON>> = new Array<HttpResponse<JSON>>();

    public loaded = new BehaviorSubject(false);

    constructor(private httpClient: HttpClient) {
        this.loadSettings();
    }

    private loadSettings() {
        this.httpClient.get<JSON>(this.SETTINGS_URL).subscribe(
            json => {
                if (json !== undefined && json != null) {
                    try {
                        for (const req of json["requests"]) {
                            let newRequest: HttpRequest = new HttpRequest(req.method, req.url, {
                                withCredentials: true
                            });

                            newRequest.expectedParameters = req.parameters;
                            newRequest.name = req.name;
                            newRequest.static = req.static;
                            this.requests.push(newRequest);
                        }
                        this.loaded.next(true);
                    }
                    catch (exception) {
                        throw Error('Can not process http.requests.json.');
                    }
                }
            }, () => { throw Error('http.request.json is wrong (doesnt exists/syntax error)') }, () => {
            });
    }

    public setSettingsUrl(url: string) {
        this.SETTINGS_URL = url;
    }

    public setCharset(string: string) {
        this.CHARSET = string;
        this.setHeaders();
    }

    public setContentType(type: ContentType) {
        this.CONTENT_TYPE = type;
        this.setHeaders();
    }

    public getParamNames(name: string) {
        return this.find(name).expectedParameters;
    }

    private setHeaders() {
        this.HEADERS = new HttpHeaders({ 'Content-Type': this.CONTENT_TYPE + ';' + this.CHARSET });
    }

    /**
     * 
     * Returns the first matched request otherwise undefined.
     * 
     * 
     * @param name The request name
     * 
     */
    public find(name: string) {
        return this.requests.find(function (element) {
            return element.name === name;
        });
    }

    public request(name: string, parameteres?: HttpParams | Object): Subject<any> {
        const retVal = new Subject<JSON>();
        const request = this.find(name);

        if (request === undefined) {
            throw Error('Request not found: ' + name);
            return retVal;
        }

        if (request.static) {
            for (const response of this.staticResponses) {
                if (request.name === response.name) {
                    retVal.next(response.body);
                    return retVal;
                }
            }
        }

        let _parameters: any = {};
        if (parameteres instanceof HttpParams) {
            _parameters = new HttpParams();
            for (const key of request.expectedParameters) {
                const value = parameteres.get(key);
                if (value) {
                    _parameters = _parameters.append(key, value);
                } else {
                    console.error(request.name + ' request have unset parameter value (key: ' + key + ')');
                }
            }
        }
        else if (parameteres) {
            let json;
            try {
                json = JSON.parse(parameteres.toString());
            }
            catch (exception) {
                throw Error('Can not make json from parameters (request: ' + request.name + ' , parameters: ' + parameteres);
            }
            _parameters = JSON.parse(parameteres.toString());
        }

        if (parameteres === undefined && request.expectedParameters && request.expectedParameters.length) {
            console.error(request.name + ' request have ' + request.expectedParameters.length + ' unset paramter!');
        }

        let observable: Observable<any> = new Observable<any>();
        if (request.method === RequestMethod.POST) {
            observable = this.httpClient.post(request.url, _parameters, {
                headers: this.HEADERS,
                withCredentials: true
            });
        } else if (request.method == RequestMethod.GET || request.method == '') {
            observable = this.httpClient.get(request.url, _parameters);
        }

        observable.subscribe((_response: JSON) => {
            if (request.static) {
                let newStaticResponse = new HttpResponse<JSON>({ body: _response });
                newStaticResponse.name = request.name;
                this.staticResponses.push(newStaticResponse);
            }
            retVal.next(_response);
        }, () => {
            throw Error(request.name + ' 404 or response does not fit the following type: ' + 'JSON');
        });

        return retVal;
    }


    public parameterBuilder(obj: any): HttpParams {
        let ret = new HttpParams();
        Object.keys(obj).forEach(key => {
            ret = ret.append(key, obj[key]);
        });
        return ret;
    }

}