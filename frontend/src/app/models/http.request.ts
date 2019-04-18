import { HttpRequest as AngularHttpRequest } from '@angular/common/http';

export class HttpRequest extends AngularHttpRequest<any> {
    name: string;    
    static: boolean;
    expectedParameters: string[];
    url: string;
}