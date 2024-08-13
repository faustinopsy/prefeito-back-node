class Voto {
    constructor(db, connectionTime) {
      this.db = db;
      this.connectionTime = connectionTime;
    }
  
    async inserirVoto(idVotante, candidatoId, regiao) {
      try {
        const start_time = process.hrtime();
  
        await this.db.run(
          `INSERT INTO Votos (idvotante, candidato_Id, region) VALUES (?, ?, ?)`,
          [idVotante, candidatoId, regiao]
        );
  
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
  
        const votou = await this.db.get(
          `SELECT COUNT(*) as total FROM Votos WHERE idvotante = ?`,
          [idVotante]
        );
  
        const end_time = process.hrtime(start_time);
        const queryTime = (end_time[0] * 1e9 + end_time[1]) / 1e6;
  
        return {
          status: true,
          votou: votou.total > 0,
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
      const start_time = process.hrtime();
      const result = await this.db.all(`SELECT candidato_id, COUNT(*) as votos FROM Votos GROUP BY candidato_id`);
      const end_time = process.hrtime(start_time);
      const queryTime = (end_time[0] * 1e9 + end_time[1]) / 1e6;
  
      return {
        status: true,
        data: result,
        connection_time: this.connectionTime,
        query_time: queryTime
      };
    }
  
    async getQuantidadeVotosPorRegiao() {
      const start_time = process.hrtime();
      const result = await this.db.all(`SELECT region, candidato_id, COUNT(*) as votos FROM Votos GROUP BY region, candidato_id`);
      const end_time = process.hrtime(start_time);
      const queryTime = (end_time[0] * 1e9 + end_time[1]) / 1e6;
  
      return {
        status: true,
        data: result,
        connection_time: this.connectionTime,
        query_time: queryTime
      };
    }
  }
  
  export default Voto;
