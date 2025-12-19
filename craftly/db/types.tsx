
import { InferSelectModel } from 'drizzle-orm';
import { users, cvs, experience, education, skills } from './schema';

export type User = InferSelectModel<typeof users>;
export type CV = InferSelectModel<typeof cvs>;
export type Experience = InferSelectModel<typeof experience>;
export type Education = InferSelectModel<typeof education>;
export type Skill = InferSelectModel<typeof skills>;

export type CVWithRelations = CV & {
  user: User;
  experiences: Experience[];
  education: Education[];
  skills: Skill[];
};

export type ExploreCV = {
  id: string;
  title: string;
  summary: string;
  updatedAt: Date;
  userEmail: string;
  userName: string;
};