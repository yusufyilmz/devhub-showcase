import template from "@shared/assistant/cv.hbs";
import { createCvResponse } from "@shared/assistant/cv-response";

export const cvResponse = createCvResponse(template);
