import SqliteVotoModel from '../models/sqliteVotoModel.js';
import MysqlVotoModel from '../models/mysqlVotoModel.js';
import MongoVotoModel from '../models/mongoVotoModel.js';

class VotoController {
  constructor(database) {
      this.db = database.getConnection();
      this.connectionTime = Date.now();
      this.votoModel = this.createVotoModel(database);
  }

  createVotoModel(database) {
      switch (database.constructor.name) {
          case 'SqliteDatabase':
              return new SqliteVotoModel(database.getConnection());
          case 'MysqlDatabase':
              return new MysqlVotoModel(database.getConnection());
          case 'MongoDatabase':
               return new MongoVotoModel(database.getConnection());
          default:
              throw new Error("Unsupported database type");
      }
  }

  async storeVoto(req, res) {
    const { idvotante, candidatoId, region } = req.body;

    if (!idvotante || !candidatoId || !region) {
      return res.status(400).json({ message: "Dados incompletos" });
    }

    try {
      const votanteJaVotou = await this.votoModel.verificarVoto(idvotante);
      if (votanteJaVotou.votou) {
        return res.status(409).json({ status: false, message: "Você já registrou um voto." });
      }

      const result = await this.votoModel.inserirVoto(idvotante, candidatoId, region);
      return res.status(200).json(result);
    } catch (error) {
      return res.status(500).json({ status: false, message: `Erro ao registrar voto: ${error.message}` });
    }
  }

  async getQuantidadeVotos(req, res) {
    try {
      const result = await this.votoModel.getQuantidadeVotos();
      return res.status(200).json(result);
    } catch (error) {
      return res.status(500).json({ status: false, message: `Erro ao obter quantidade de votos: ${error.message}` });
    }
  }

  async getQuantidadeVotosPorRegiao(req, res) {
    try {
      const result = await this.votoModel.getQuantidadeVotosPorRegiao();
      return res.status(200).json(result);
    } catch (error) {
      return res.status(500).json({ status: false, message: `Erro ao obter quantidade de votos por região: ${error.message}` });
    }
  }
}

export default VotoController;
