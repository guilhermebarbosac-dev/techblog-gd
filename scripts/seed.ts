//SCRIPT DE POPULAÇÃO DO BANCO DE DADOS
import { PrismaClient } from "../lib/generated/prisma";
import { readFileSync } from "fs";
import { join } from "path";
import { generateHashPassword } from "@/lib/crypto";

//CONEXÃO COM O BANCO DE DADOS ATRAVÉS DO PRISMA
const prisma = new PrismaClient();

//TYPAGEM DOS DADOS DE ARTIGO MOCKADOS
interface MockArticle {
  id: number;
  title: string;
  avatar?: string;
  author: string;
  content: string;
  tags: string[];
  updatedAt?: string;
}

//FUNÇÃO DE POPULAÇÃO DO BANCO DE DADOS
async function main() {
  console.log("🌱 Starting database seeding...");

  //CAMINHO PARA O ARQUIVO JSON COM OS DADOS DE ARTIGOS MOCKADOS E LEITURA
  const articlesPath = join(process.cwd(), "app/api/mocks/articles.json");
  const articlesData: MockArticle[] = JSON.parse(
    readFileSync(articlesPath, "utf8")
  );

  //EXCLUSÃO DE TODOS OS DADOS DO BANCO
  console.log("🗑️  Clearing existing data...");
  await prisma.articleTag.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.article.deleteMany();
  await prisma.tag.deleteMany();
  await prisma.session.deleteMany();
  await prisma.user.deleteMany();

  //CRIAÇÃO DE TODOS OS AUTORES DOS ARTIGOS
  const uniqueAuthors = [
    ...new Set(articlesData.map((article) => article.author)),
  ];
  const authorsMap = new Map<string, string>();

  console.log("👤 Creating authors...");
  for (const authorName of uniqueAuthors) {
    const hashedPassword = await generateHashPassword("password123"); // Default password\r
    const user = await prisma.user.create({
      data: {
        name: authorName,
        email: `${authorName.toLowerCase().replace(/\s+/g, ".")}@techblog.com`,
        password: hashedPassword,
        avatar:
          "https://images.pexels.com/photos/33551085/pexels-photo-33551085.jpeg", // Default avatar
      },
    });
    authorsMap.set(authorName, user.id);
    console.log(`✅ Created user: ${authorName}`);
  }

  //CRIAÇÃO DE TAGS STATICAS
  const predefinedTags = ["Frontend", "Backend", "Mobile", "DevOps", "AI"];
  const tagsMap = new Map<string, string>();

  console.log("🏷️  Creating tags...");

  for (const tagName of predefinedTags) {
    const tag = await prisma.tag.create({
      data: {
        name: tagName,
      },
    });
    tagsMap.set(tagName, tag.id);
    console.log(`✅ Created tag: ${tagName}`);
  }

  //CRIAÇÃO DE ARTIGOS RETORNADOS NO MOCK
  console.log("📝 Creating articles...");
  for (const articleData of articlesData) {
    const authorId = authorsMap.get(articleData.author);

    if (!authorId) {
      console.error(`❌ Author not found: ${articleData.author}`);
      continue;
    }

    const article = await prisma.article.create({
      data: {
        title: articleData.title,
        content: articleData.content,
        authorId: authorId,
        updatedAt: articleData.updatedAt
          ? new Date(articleData.updatedAt)
          : new Date(),
      },
    });

    //PERCORRENDO E VINCULANDO AS TAGS REFERENCIADAS NO ARTIGO
    for (const tagName of articleData.tags) {
      const tagId = tagsMap.get(tagName);
      if (tagId) {
        await prisma.articleTag.create({
          data: {
            articleId: article.id,
            tagId: tagId,
          },
        });
      }
    }

    console.log(`✅ Created article: ${articleData.title}`);
  }

  //LOG DE SUCESSO E QUANTIDADE DE DADOS INSERIDOS.
  console.log("✨ Database seeding completed successfully!");
  console.log(`📊 Summary:`);
  console.log(`   - Users: ${uniqueAuthors.length}`);
  console.log(`   - Tags: ${predefinedTags.length}`);
  console.log(`   - Articles: ${articlesData.length}`);
}

//CHAMADA DA FUNÇÃO DE POPULAÇÃO
main()
  .catch((e) => {
    console.error("❌ Error during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
