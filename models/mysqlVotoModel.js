class MysqlVotoModel {
    constructor(db, connectionTime) {
      this.db = db;
      this.connectionTime = connectionTime;
    }
  
    async inserirVoto(idVotante, candidatoId, regiao) {
      try {
        const start_time = process.hrtime();
  
        const [result] = await this.db.execute(
          `INSERT INTO Votos (idvotante, candidato_Id, region) VALUES (?, ?, ?)`,
          [idVotante, candidatoId, regiao]
        );
  
        const end_time = process.hrtime(start_time);
        const queryTime = (end_time[0] *  end_time[1]);
  
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
  
        const [rows] = await this.db.execute(
          `SELECT COUNT(*) as total FROM Votos WHERE idvotante = ?`,
          [idVotante]
        );
  
        const end_time = process.hrtime(start_time);
        const queryTime = (end_time[0] * 1e9 + end_time[1]) / 1e6;
  
        return {
          status: true,
          votou: rows[0].total > 0,
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
        const [result] = await this.db.execute(`SELECT candidato_id, COUNT(*) as votos FROM Votos GROUP BY candidato_id`);
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
        const [result] = await this.db.execute(`SELECT region, candidato_id, COUNT(*) as votos FROM Votos GROUP BY region, candidato_id`);
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
  
  export default MysqlVotoModel;
  