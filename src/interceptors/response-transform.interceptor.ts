import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { StandardResponse } from 'src/interfaces/standard-response.inteface';

@Injectable()
/**
 * Transforms the response into an acceptable JSON type.
 * 
 * - no response => `{status: "OK"}`
 * - string => `{status: "OK", message: "<your string>"}`
 * - object => `{status: "<your status or OK>", "message": "<your message if any>", content: "<all other properties>"}
 * - any other response => `{status: "OK", content: "<your response>"}`
 */
export class ResponseTransformInterceptor<T> implements NestInterceptor<T, StandardResponse<T>> {
  intercept(_context: ExecutionContext, next: CallHandler): Observable<StandardResponse<T>> {
    return next.handle().pipe(map((data: T) => {
        // if no response
        if (data === null || data === undefined) {
            return {
                "status": "OK"
            };
        }

        // if the data is just a string, this is a message
        else if (typeof data === 'string') {
            return {
                status: "OK",
                message: data,
            };
        }

        // if the data is a real object, this could be a well-crafted response
        else if (typeof data === 'object' && !Array.isArray(data)) {
            const { status, message, content, ...rest }: { [key: string]: any } = data;
            
            const response: StandardResponse<T> = {
                status: status ?? "OK", 
            };

            if (message) {
                response.message = message;
            }

            // if there is a content, we input that
            // if there isn't, we put everything else as an object under it
            if (content) {
                response.content = {...content, ...rest};
            } else {
                response.content = rest as T;
            }

            return response;
        }

        // for every other case
        else {
            return {
                status: "OK",
                content: data,
            };
        }
    }));
  }
}
