import { HttpResponse as AngularHttpHttpResponse } from '@angular/common/http';

export class HttpResponse<T> extends AngularHttpHttpResponse<T> {
    name: string;    
}