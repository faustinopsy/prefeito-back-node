import express from 'express';
import VotoController from '../controllers/votoController.js';

class VotoRota {
    constructor(database) {
        this.router = express.Router();
        this.controller = new VotoController(database);
        this.setupRoutes();
    }

    setupRoutes() {
        this.router.post('/voto', (req, res) => this.controller.storeVoto(req, res));
        this.router.get('/voto/quantidade', (req, res) => this.controller.getQuantidadeVotos(req, res));
        this.router.get('/voto/quantidade_por_regiao', (req, res) => this.controller.getQuantidadeVotosPorRegiao(req, res));
    }
}

export default VotoRota;
