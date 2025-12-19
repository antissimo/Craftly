console.log("DATABASE_URL:", process.env.DATABASE_URL);
console.log("Type:", typeof process.env.DATABASE_URL);
console.log("Length:", process.env.DATABASE_URL?.length);
console.log("Contains 'postgres':", process.env.DATABASE_URL?.includes('postgres'));