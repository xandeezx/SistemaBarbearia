// seed.js — Execute na sua máquina:
// 1. npm install mongodb
// 2. node seed.js

const { MongoClient } = require("mongodb");

const URI = "mongodb+srv://arthurmonte38_db_user:root@cluster0.vqohsw1.mongodb.net/matheus-barbearia?appName=Cluster0";
async function seed() {
  const client = new MongoClient(URI);
  try {
    await client.connect();
    console.log("✅ Conectado ao MongoDB Atlas!");

    const db = client.db("matheus-barbearia");

    // Limpar dados anteriores
    await db.collection("servicos").drop().catch(() => {});
    await db.collection("configs").drop().catch(() => {});

    // Serviços
    await db.collection("servicos").insertMany([
      { nome: "Corte", preco: 35, duracao: 30, descricao: "Corte masculino completo", ativo: true },
      { nome: "Barba", preco: 25, duracao: 30, descricao: "Modelagem e hidratação da barba", ativo: true },
      { nome: "Corte + Barba", preco: 55, duracao: 60, descricao: "Combo completo corte e barba", ativo: true },
      { nome: "Sobrancelha", preco: 15, duracao: 15, descricao: "Design de sobrancelha", ativo: true },
      { nome: "Pigmentação", preco: 80, duracao: 60, descricao: "Coloração e pigmentação", ativo: true },
    ]);
    console.log("✅ 5 serviços inseridos");

    // Configurações
    await db.collection("configs").insertOne({
      horarioAbertura: "09:00",
      horarioFechamento: "20:00",
      intervalo: 30,
      diasFuncionamento: [1, 2, 3, 4, 5, 6],
    });
    console.log("✅ Configurações inseridas");

    console.log("\n🎉 Banco populado com sucesso!");
  } catch (err) {
    console.error("❌ Erro:", err.message);
  } finally {
    await client.close();
  }
}

seed();
