class MongoVotoModel {
    constructor(db, connectionTime) {
      this.db = db;
      this.connectionTime = connectionTime;
      this.collection = this.db.collection('votos');
    }
  
    async inserirVoto(idVotante, candidatoId, regiao) {
      try {
        const start_time = process.hrtime();
  
        const result = await this.collection.insertOne({
          idvotante: idVotante,
          candidato_Id: candidatoId,
          region: regiao,
          data_inclusao: new Date()
        });
  
        const end_time = process.hrtime(start_time);
        const queryTime = (end_time[0] * 1e9 + end_time[1]) / 1e6;
  
        return {
          success: true,
          message: "Voto inserido com sucesso.",
          connection_time: this.connectionTime,
          query_time: queryTime
        };
      } catch (error) {
        return {
          success: false,
          message: `Erro ao inserir voto: ${error.message}`,
          connection_time: this.connectionTime
        };
      }
    }
  
    async verificarVoto(idVotante) {
      try {
        const start_time = process.hrtime();
  
        const votou = await this.collection.countDocuments({ idvotante: idVotante });
  
        const end_time = process.hrtime(start_time);
        const queryTime = (end_time[0] * 1e9 + end_time[1]) / 1e6;
  
        return {
          status: true,
          votou: votou > 0,
          connection_time: this.connectionTime,
          query_time: queryTime
        };
      } catch (error) {
        return {
          status: false,
          message: `Erro ao verificar voto: ${error.message}`,
          connection_time: this.connectionTime
        };
      }
    }
  
    async getQuantidadeVotos() {
      try {
        const start_time = process.hrtime();
  
        const result = await this.collection.aggregate([
          { $group: { _id: "$candidato_Id", votos: { $sum: 1 } } },
          { $project: { candidato_id: "$_id", votos: 1, _id: 0 } }
        ]).toArray();
  
        const end_time = process.hrtime(start_time);
        const queryTime = (end_time[0] * 1e9 + end_time[1]) / 1e6;
  
        return {
          status: true,
          data: result,
          connection_time: this.connectionTime,
          query_time: queryTime
        };
      } catch (error) {
        return {
          status: false,
          message: `Erro ao obter quantidade de votos: ${error.message}`,
          connection_time: this.connectionTime
        };
      }
    }
  
    async getQuantidadeVotosPorRegiao() {
      try {
        const start_time = process.hrtime();
  
        const result = await this.collection.aggregate([
          { $group: { _id: { region: "$region", candidato_Id: "$candidato_Id" }, votos: { $sum: 1 } } },
          { $project: { region: "$_id.region", candidato_id: "$_id.candidato_Id", votos: 1, _id: 0 } }
        ]).toArray();
  
        const end_time = process.hrtime(start_time);
        const queryTime = (end_time[0] * 1e9 + end_time[1]) / 1e6;
  
        return {
          status: true,
          data: result,
          connection_time: this.connectionTime,
          query_time: queryTime
        };
      } catch (error) {
        return {
          status: false,
          message: `Erro ao obter quantidade de votos por região: ${error.message}`,
          connection_time: this.connectionTime
        };
      }
    }
  }
  
  export default MongoVotoModel;
  