import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

@Injectable()
export class MaskSensitiveDataInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(map((data) => this.maskInObject(data)));
  }

  private maskInObject(obj: any): any {
    if (typeof obj !== "object" || obj === null) {
      return obj;
    }

    if (Array.isArray(obj)) {
      return obj.map((item) => this.maskInObject(item));
    }

    const newObj = {};
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        if (key === "email" && typeof obj[key] === "string") {
          newObj[key] = this.maskEmail(obj[key]);
        } else if (key === "mobile" && typeof obj[key] === "string") {
          newObj[key] = this.maskMobile(obj[key]);
        } else {
          newObj[key] = this.maskInObject(obj[key]);
        }
      }
    }
    return newObj;
  }

  private maskEmail(email: string): string {
    const [name, domain] = email.split("@");
    if (!name || !domain) {
      return email; // Return original if not a valid email format
    }
    const maskedName = name.length > 3 ? name.substring(0, 3) + "***" : "***";
    return `${maskedName}@${domain}`;
  }

  private maskMobile(mobile: string): string {
    return mobile.length > 3 ? "***" + mobile.slice(-4) : "***";
  }
}
