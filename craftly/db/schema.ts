// lib/db/schema.ts - ISPRAVNA VERZIJA
import { pgTable, uuid, text, timestamp, foreignKey } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// lib/db/schema.ts
export const users = pgTable("users", {
  id: text("id").primaryKey(),      
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});


// CVS
export const cvs = pgTable("cvs", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull(),
  title: text("title").notNull(),
  summary: text("summary"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// EXPERIENCE
export const experience = pgTable("experience", {
  id: uuid("id").primaryKey().defaultRandom(),
  cvId: uuid("cv_id").notNull(),
  company: text("company").notNull(),
  position: text("position").notNull(),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date"),
  description: text("description"),
});

// EDUCATION
export const education = pgTable("education", {
  id: uuid("id").primaryKey().defaultRandom(),
  cvId: uuid("cv_id").notNull(),
  school: text("school").notNull(),
  degree: text("degree"),
  startDate: timestamp("start_date"),
  endDate: timestamp("end_date"),
});

// SKILLS
export const skills = pgTable("skills", {
  id: uuid("id").primaryKey().defaultRandom(),
  cvId: uuid("cv_id").notNull(),
  name: text("name").notNull(),
  level: text("level"),
});

// RELATIONS
export const usersRelations = relations(users, ({ many }) => ({
  cvs: many(cvs),
}));

export const cvsRelations = relations(cvs, ({ one, many }) => ({
  user: one(users, {
    fields: [cvs.userId],
    references: [users.id],
  }),
  experiences: many(experience),
  education: many(education),
  skills: many(skills),
}));

export const experienceRelations = relations(experience, ({ one }) => ({
  cv: one(cvs, {
    fields: [experience.cvId],
    references: [cvs.id],
  }),
}));

export const educationRelations = relations(education, ({ one }) => ({
  cv: one(cvs, {
    fields: [education.cvId],
    references: [cvs.id],
  }),
}));

export const skillsRelations = relations(skills, ({ one }) => ({
  cv: one(cvs, {
    fields: [skills.cvId],
    references: [cvs.id],
  }),
}));