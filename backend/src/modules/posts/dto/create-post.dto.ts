export class CreatePostDto {
  title: string;

  content: string;

  imageUrl?: string;

  isJob?: boolean;

  salary?: string;

  location?: string;

  jobType?: string;

  skills?: string[];

  requirements?: string[];
}
