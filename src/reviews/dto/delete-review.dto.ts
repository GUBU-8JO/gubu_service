import { PartialType } from "@nestjs/mapped-types";
import { FindReviewDto } from "./find-review.dto";

export class DeleteReviewDto extends PartialType(FindReviewDto) {}
