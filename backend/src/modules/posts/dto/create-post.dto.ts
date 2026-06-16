export class CreatePostDto {
  title: string;

  content: string;

  imageUrl?: string;

  isJob?: boolean;

  salary?: string;

  location?: string;

  jobType?: string;

  language?: string;

  schedule?: string;

  paymentType?: string;

  hiresNeeded?: number;

  deadline?: string;

  skills?: string[];

  requirements?: string[];
}
