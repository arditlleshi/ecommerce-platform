import { boolean, index, pgTable, text, timestamp } from 'drizzle-orm/pg-core';

export const authUsers = pgTable('user', {
  id: text().primaryKey(),
  name: text().notNull(),
  email: text().notNull().unique(),
  emailVerified: boolean().notNull(),
  image: text(),
  createdAt: timestamp('createdAt', {
    withTimezone: true,
  })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp('updatedAt', {
    withTimezone: true,
  })
    .defaultNow()
    .notNull(),
});

export const authSessions = pgTable(
  'session',
  {
    id: text().primaryKey(),
    expiresAt: timestamp('expiresAt', {
      withTimezone: true,
    }).notNull(),
    token: text().notNull().unique(),
    createdAt: timestamp('createdAt', {
      withTimezone: true,
    })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp('updatedAt', {
      withTimezone: true,
    }).notNull(),
    ipAddress: text(),
    userAgent: text(),
    userId: text()
      .notNull()
      .references(() => authUsers.id, {
        onDelete: 'cascade',
      }),
  },
  (table) => [index('session_userId_idx').on(table.userId)],
);

export const authAccounts = pgTable(
  'account',
  {
    id: text().primaryKey(),
    accountId: text().notNull(),
    providerId: text().notNull(),
    userId: text()
      .notNull()
      .references(() => authUsers.id, {
        onDelete: 'cascade',
      }),
    accessToken: text(),
    refreshToken: text(),
    idToken: text(),
    accessTokenExpiresAt: timestamp('accessTokenExpiresAt', {
      withTimezone: true,
    }),
    refreshTokenExpiresAt: timestamp('refreshTokenExpiresAt', {
      withTimezone: true,
    }),
    scope: text(),
    password: text(),
    createdAt: timestamp('createdAt', {
      withTimezone: true,
    })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp('updatedAt', {
      withTimezone: true,
    }).notNull(),
  },
  (table) => [index('account_userId_idx').on(table.userId)],
);

export const authVerifications = pgTable(
  'verification',
  {
    id: text().primaryKey(),
    identifier: text().notNull(),
    value: text().notNull(),
    expiresAt: timestamp('expiresAt', {
      withTimezone: true,
    }).notNull(),
    createdAt: timestamp('createdAt', {
      withTimezone: true,
    })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp('updatedAt', {
      withTimezone: true,
    })
      .defaultNow()
      .notNull(),
  },
  (table) => [index('verification_identifier_idx').on(table.identifier)],
);
