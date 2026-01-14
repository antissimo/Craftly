ALTER TABLE "cvs" DROP CONSTRAINT "cvs_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "education" DROP CONSTRAINT "education_cv_id_cvs_id_fk";
--> statement-breakpoint
ALTER TABLE "experience" DROP CONSTRAINT "experience_cv_id_cvs_id_fk";
--> statement-breakpoint
ALTER TABLE "skills" DROP CONSTRAINT "skills_cv_id_cvs_id_fk";
--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "name" text NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_email_unique" UNIQUE("email");